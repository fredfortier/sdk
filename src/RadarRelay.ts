
import { ZeroEx } from './ZeroEx';
import { EventEmitter } from 'events';
import { RadarToken, RadarMarket } from '@radarrelay/types';
import {
  InjectedWalletConfig,
  WalletType,
  Config,
  AccountParams,
  EventName,
  SdkError
} from './types';
import BigNumber from 'bignumber.js';
import request = require('request-promise');
import Web3 = require('web3');

// SDK Classes
import { SdkInitLifeCycle, InitPriorityItem } from './SdkInitLifeCycle';
import { Ethereum } from './Ethereum';
import { Market } from './Market';
import { Trade } from './Trade';
import { RADAR_RELAY_ENDPOINTS } from './constants';
import { BaseAccount } from './accounts/BaseAccount';
import { MarketsPagination } from './MarketsPagination';

BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

/**
 * RadarRelay main SDK singleton
 */
export class RadarRelay<T extends BaseAccount> {

  public events: EventEmitter;
  public account: T;
  public tokens: Map<string, RadarToken>;
  public zeroEx: ZeroEx;
  public web3: Web3;
  public marketsPagination: MarketsPagination<T>;

  private _trade: Trade<T>;
  private _ethereum: Ethereum;
  private _networkId: number;
  private _lifecycle: SdkInitLifeCycle;
  private _wallet: new (params: AccountParams) => T;
  private _config: Config;
  private _walletType: WalletType;

  /**
   * The load priority list maintains the function call
   * priority for each init method in the RadarRelaySDK class.
   * It is utilized by the SdkInitLifeCycle
   *
   * This list is configurable if additional init methods are necessary
   */
  private loadPriorityList: InitPriorityItem[] = [
    { event: EventName.EthereumInitialized, func: this.initEthereumNetworkIdAsync },
    { event: EventName.EthereumNetworkIdInitialized, func: this.initZeroEx },
    { event: EventName.ZeroExInitialized, func: this.initTokensAsync },
    { event: EventName.TokensInitialized, func: this.initAccountAsync, args: [0] }, // Pass default account of 0 to setAccount(...)
    { event: EventName.AccountInitialized, func: this.initTrade },
    { event: EventName.TradeInitialized, func: this.initMarketsAsync },
    { event: EventName.MarketsInitialized, func: undefined}
  ];

  /**
   * SDK instance
   *
   * @param {RadarRelayConfig} config  sdk config
   */
  constructor(wallet: new (params: AccountParams) => T, walletType: WalletType, config: Config) {
    this._wallet = wallet;
    this._walletType = walletType;
    this._config = config;

    // Instantiate event handler
    this.events = new EventEmitter();

    // Instantiate ethereum class
    this._ethereum = new Ethereum();

    // setup the _lifecycle
    this._lifecycle = new SdkInitLifeCycle(this.events, this.loadPriorityList, config.sdkInitializationTimeoutMs);
    this._lifecycle.setup(this);
  }

  /**
   * Initialize the SDK
   *
   * @param {Config} config The wallet configuration
   */
  public async initializeAsync(): Promise<RadarRelay<T>> {
    await this._ethereum.setProvider(this._walletType, this.config);

    // Allow access to web3 object
    this.web3 = this._ethereum.web3;

    await this.setEndpointOrThrowAsync();
    await this.getCallback(EventName.EthereumInitialized, this._ethereum);

    return this;
  }

  // --- Instance methods --- //

  public async fetchMarkets(marketIds: string[]) {
    const ids = marketIds.join(',');

    const response: RadarMarket[] = JSON.parse(await request.get(`${this.config.radarRestEndpoint}/markets?ids=${ids}`));
    const markets: Array<Market<T>> = response.map(market => {
      return new Market(market, this.config.radarRestEndpoint, this.config.radarWebsocketEndpoint, this._trade);
    });

    return markets || [];
  }

  public async fetchMarket(marketId: string) {
    try {
      const response = await request.get(`${this.config.radarRestEndpoint}/markets/${marketId}`);
      const market = JSON.parse(response);
      return new Market(market, this.config.radarRestEndpoint, this.config.radarWebsocketEndpoint, this._trade);
    } catch (e) {
      throw e;
    }
  }

  // --- Getters/setters --- //

  get config() {
    return this._config;
  }

  // --- Initialization methods, not user configurable below this line --- //

  private async initAccountAsync(address: string | number): Promise<string | boolean> {
    await this._ethereum.setDefaultAccount(address);
    this.account = new this._wallet({
      ethereum: this._ethereum,
      events: this.events,
      zeroEx: this.zeroEx,
      endpoint: this.config.radarRestEndpoint,
      tokens: this.tokens
    });
    return this.getCallback(EventName.AccountInitialized, this.account);
  }

  private async initEthereumNetworkIdAsync(): Promise<string | boolean> {
    this._networkId = await this._ethereum.getNetworkIdAsync.apply(this._ethereum);
    return this.getCallback(EventName.EthereumNetworkIdInitialized, this._networkId);
  }

  private initZeroEx(): Promise<string | boolean> {
    this.zeroEx = new ZeroEx(this._ethereum.web3.currentProvider, {
      networkId: this._networkId
    });
    return this.getCallback(EventName.ZeroExInitialized, this.zeroEx);
  }

  private initTrade(): Promise<string | boolean> {
    this._trade = new Trade<T>(this.zeroEx, this.config.radarRestEndpoint, this.account, this.events);
    return this.getCallback(EventName.TradeInitialized, this._trade);
  }

  private async initTokensAsync(): Promise<string | boolean> {
    // Only fetch if not already fetched
    if (!this.tokens || !this.tokens.size) {
      const tokens: RadarToken[] = JSON.parse(await request.get(`${this.config.radarRestEndpoint}/tokens`));

      const entries = tokens.map(token => [token.address, token]);
      this.tokens = new Map(entries as any);

      tokens.map(token => this.tokens.set(token.address, token));
    }

    // TODO: index by address
    return this.getCallback(EventName.TokensInitialized, this.tokens);
  }

  private async initMarketsAsync(): Promise<string | boolean> {
    // Instantiate markets pagination helper
    this.marketsPagination = new MarketsPagination(
      1, // Starting page
      100, // Results per page
      this.config.radarRestEndpoint,
      this.config.radarWebsocketEndpoint,
      this._trade
    );

    return this.getCallback(EventName.MarketsInitialized, this.marketsPagination.markets);
  }

  private getCallback(event, data): Promise<string | boolean> {
    const callback = this._lifecycle.promise(event);
    this.events.emit(event, data);
    return callback;
  }

  private async setEndpointOrThrowAsync() {
    const walletConfig = this.config as InjectedWalletConfig;
    if (this._walletType === WalletType.Injected && !walletConfig.dataRpcUrl) {
      // Set Radar Relay API Endpoints if using injected provider
      const { radarRestEndpoint, radarWebsocketEndpoint } = RADAR_RELAY_ENDPOINTS(await this._ethereum.getNetworkIdAsync());
      this.config.radarRestEndpoint = radarRestEndpoint;
      this.config.radarWebsocketEndpoint = radarWebsocketEndpoint;
    }

    if (!this.config.radarRestEndpoint || !this.config.radarWebsocketEndpoint) {
      throw new Error(SdkError.InvalidOrMissingEndpoints);
    }
  }
}
