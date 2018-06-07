
import {ZeroEx, ZeroExConfig} from '0x.js';
import {EventEmitter} from 'events';
import {RadarToken, RadarMarket} from 'radar-types';
import {
  Wallet,
  RadarRelayConfig,
  LightWalletConfig,
  InjectedWalletType,
  RpcWalletConfig,
  InjectedWalletConfig,
  WalletType
} from './types';
import BigNumber from 'bignumber.js';
import request = require('request-promise');
import {TSMap} from 'typescript-map';

// SDK Classes
import {SDKInitLifeCycle, InitPriorityItem} from './sdk-init-lifecycle';
import {EventBus} from './event-emitter';
import {Ethereum} from './ethereum';
import {Account} from './account';
import {Market} from './market';
import {Trade} from './trade';

BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

/**
 * RadarRelay main SDK singleton
 */
export class RadarRelay {

    public events: EventBus;
    public account: Account;
    public tokens: TSMap<string, RadarToken>;
    public markets: TSMap<string, Market>;
    public zeroEx: ZeroEx;

    private _trade: Trade;
    private _ethereum: Ethereum;
    private _apiEndpoint: string;
    private _wsEndpoint: string;
    private _networkId: number;
    private _prevApiEndpoint: string;
    private _markets: RadarMarket[];
    private _lifecycle: SDKInitLifeCycle;

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
      },  {
        event: 'marketsInitialized',
        func: undefined
      } ];

    /**
     * SDK instance
     *
     * @param {RadarRelayConfig}  config  sdk config
     */
    constructor(config: RadarRelayConfig) {
      // set the api/ws endpoint outside
      // of the init _lifecycle
      this._apiEndpoint = config.endpoint;
      this._wsEndpoint = config.websocketEndpoint;

      // instantiate event handler
      this.events = new EventEmitter();

      // instantiate ethereum class
      this._ethereum = new Ethereum();

      // setup the _lifecycle
      this._lifecycle = new SDKInitLifeCycle(this.events, this.loadPriorityList, config.sdkInitializationTimeout);
      this._lifecycle.setup(this);
    }

    /**
     * Initialize the SDK
     *
     * @param {LightWalletConfig|RpcWalletConfig|InjectedWalletConfig}  config  wallet config
     */
    public async initialize(
      config: LightWalletConfig | RpcWalletConfig | InjectedWalletConfig
    ): Promise<string | boolean> {

      // Determine wallet type
      let type: WalletType;

      // local
      if ((config as LightWalletConfig).wallet) {
        type = WalletType.Local;
      }

      // rpc
      if ((config as RpcWalletConfig).walletRpcUrl) {
        type = WalletType.Rpc;
      }

      // injected
      if ((config as InjectedWalletConfig).web3) {
        type = WalletType.Injected;
      }

      await this._ethereum.setProvider(type, config);
      return this.getCallback('ethereumInitialized', this._ethereum);
    }

    // --- not user configurable below this line --- //

    private async initAccountAsync(account: string | number): Promise<string | boolean> {
      await this._ethereum.setDefaultAccount(account);
      this.account = new Account(this._ethereum, this.zeroEx, this._apiEndpoint, this.tokens);
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
      this._trade = new Trade(this.zeroEx, this._apiEndpoint, this.account, this.events, this.tokens);
      return this.getCallback('tradeInitialized', this._trade);
    }

    private async initTokensAsync(): Promise<string | boolean> {
      // only fetch if not already fetched
      if (this._prevApiEndpoint !== this._apiEndpoint) {
        const tokens = JSON.parse(await request.get(`${this._apiEndpoint}/tokens`));
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
        if (this._prevApiEndpoint !== this._apiEndpoint) {
          this._markets = JSON.parse(await request.get(`${this._apiEndpoint}/markets`));
        }
        // TODO probably not the best place for this
        this._prevApiEndpoint = this._apiEndpoint;
        this.markets = new TSMap();
        this._markets.map(market => {
          this.markets.set(market.id, new Market(
            market, this._apiEndpoint, this._wsEndpoint, this._trade
          ));
        });

        return this.getCallback('marketsInitialized', this.markets);
    }

    private getCallback(event, data): Promise<string | boolean> {
      const callback = this._lifecycle.promise(event);
      this.events.emit(event, data);
      return callback;
    }
}
