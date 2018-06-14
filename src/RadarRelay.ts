
import { ZeroEx } from '0x.js';
import { EventEmitter } from 'events';
import { RadarToken, RadarMarket } from '@radarrelay/types';
import {
  InjectedWalletConfig,
  WalletType,
  Config,
  AccountParams
} from './types';
import BigNumber from 'bignumber.js';
import request = require('request-promise');
import { TSMap } from 'typescript-map';

// SDK Classes
import { SDKInitLifeCycle, InitPriorityItem } from './SDKInitLifeCycle';
import { EventBus } from './EventEmitter';
import { Ethereum } from './Ethereum';
import { Market } from './Market';
import { Trade } from './Trade';
import { RADAR_RELAY_ENDPOINTS } from './constants';
import { BaseAccount } from './accounts/BaseAccount';

BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

/**
 * RadarRelay main SDK singleton
 */
export class RadarRelay<T extends BaseAccount> {

  public events: EventBus;
  public account: T;
  public tokens: TSMap<string, RadarToken>;
  public markets: TSMap<string, Market<T>>;
  public zeroEx: ZeroEx;

  private _trade: Trade<T>;
  private _ethereum: Ethereum;
  private _networkId: number;
  private _prevApiEndpoint: string;
  private _markets: RadarMarket[];
  private _lifecycle: SDKInitLifeCycle;
  private _wallet: new (params: AccountParams) => T;
  private _config: Config;
  private _walletType: WalletType;

  /**
   * The load priority list maintains the function call
   * priority for each init method in the RadarRelaySDK class.
   * It is utilized by the SDKInitLifeCycle
   *
   * This list is configurable if additional init methods are necessary
   */
  private loadPriorityList: InitPriorityItem[] = [
    {
      event: 'ethereumInitialized',
      func: this.initEthereumNetworkIdAsync
    }, {
      event: 'ethereumNetworkIdInitialized',
      func: this.initZeroEx
    }, {
      event: 'zeroExInitialized',
      func: this.initTokensAsync
    }, {
      event: 'tokensInitialized',
      func: this.initAccountAsync,
      args: [0] // pass default account of 0 to setAccount
    }, {
      event: 'accountInitialized',
      func: this.initTrade
    }, {
      event: 'tradeInitialized',
      func: this.initMarketsAsync
    }, {
      event: 'marketsInitialized',
      func: undefined
    }];

  /**
   * SDK instance
   *
   * @param {RadarRelayConfig}  config  sdk config
   */
  constructor(wallet: new (params: AccountParams) => T, walletType: WalletType, config: Config) {
    this._wallet = wallet;
    this._config = config;
    this._walletType = walletType;

    // instantiate event handler
    this.events = new EventEmitter();

    // instantiate ethereum class
    this._ethereum = new Ethereum();

    // setup the _lifecycle
    this._lifecycle = new SDKInitLifeCycle(this.events, this.loadPriorityList, config.sdkInitializationTimeoutMs);
    this._lifecycle.setup(this);
  }

  /**
   * Initialize the SDK
   *
   * @param {Config}  config  wallet config
   */
  public async initializeAsync(): Promise<RadarRelay<T>> {
    await this._ethereum.setProvider(this._walletType, this._config);
    await this.setEndpointOrThrowAsync();
    await this.getCallback('ethereumInitialized', this._ethereum);

    return this;
  }

  // --- not user configurable below this line --- //

  private async initAccountAsync(address: string | number): Promise<string | boolean> {
    await this._ethereum.setDefaultAccount(address);
    this.account = new this._wallet({
      ethereum: this._ethereum,
      events: this.events,
      zeroEx: this.zeroEx,
      endpoint: this._config.radarRestEndpoint,
      tokens: this.tokens
    });
    return this.getCallback('accountInitialized', this.account);
  }

  private async initEthereumNetworkIdAsync(): Promise<string | boolean> {
    this._networkId = await this._ethereum.getNetworkIdAsync.apply(this._ethereum);
    return this.getCallback('ethereumNetworkIdInitialized', this._networkId);
  }

  private initZeroEx(): Promise<string | boolean> {
    this.zeroEx = new ZeroEx(this._ethereum.web3.currentProvider, {
      networkId: this._networkId
    });
    return this.getCallback('zeroExInitialized', this.zeroEx);
  }

  private initTrade(): Promise<string | boolean> {
    this._trade = new Trade<T>(this.zeroEx, this._config.radarRestEndpoint, this.account, this.events, this.tokens);
    return this.getCallback('tradeInitialized', this._trade);
  }

  private async initTokensAsync(): Promise<string | boolean> {
    // only fetch if not already fetched
    if (this._prevApiEndpoint !== this._config.radarRestEndpoint) {
      const tokens = JSON.parse(await request.get(`${this._config.radarRestEndpoint}/tokens`));
      this.tokens = new TSMap();
      tokens.map(token => {
        this.tokens.set(token.address, token);
      });
    }
    // todo index by address
    return this.getCallback('tokensInitialized', this.tokens);
  }

  private async initMarketsAsync(): Promise<string | boolean> {
    // only fetch if not already fetched
    if (this._prevApiEndpoint !== this._config.radarRestEndpoint) {
      this._markets = JSON.parse(await request.get(`${this._config.radarRestEndpoint}/markets`));
    }
    // TODO probably not the best place for this
    this._prevApiEndpoint = this._config.radarRestEndpoint;
    this.markets = new TSMap();
    this._markets.map(market => {
      this.markets.set(market.id, new Market(
        market, this._config.radarRestEndpoint, this._config.radarWebsocketEndpoint, this._trade
      ));
    });

    return this.getCallback('marketsInitialized', this.markets);
  }

  private getCallback(event, data): Promise<string | boolean> {
    const callback = this._lifecycle.promise(event);
    this.events.emit(event, data);
    return callback;
  }

  private async setEndpointOrThrowAsync() {
    const walletConfig = this._config as InjectedWalletConfig;
    if (this._walletType === WalletType.Injected && !walletConfig.web3) {
      // Set Radar Relay API Endpoints if using injected provider
      const { radarRestEndpoint, radarWebsocketEndpoint } = RADAR_RELAY_ENDPOINTS(await this._ethereum.getNetworkIdAsync());
      this._config.radarRestEndpoint = radarRestEndpoint;
      this._config.radarWebsocketEndpoint = radarWebsocketEndpoint;
    }

    if (!this._config.radarRestEndpoint || !this._config.radarWebsocketEndpoint) {
      throw new Error('Invalid or missing Radar Relay API Endpoints');
    }
  }
}
