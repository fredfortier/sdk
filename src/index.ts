import {ZeroEx, ZeroExConfig} from '0x.js';
import {WalletManager} from 'vault-manager';
import {EventEmitter} from 'events';
import {Wallet, SDKConfig} from './types';
import {RadarToken, RadarMarket} from 'radar-types';
import BigNumber from 'bignumber.js';
import request = require('request-promise');

// SDK Classes
import {SDKInitLifeCycle, InitPriorityItem} from './sdk-init-lifecycle';
import {EventBus} from './event-emitter';
import {Ethereum} from './ethereum';
import {Account} from './account';
import {Market} from './market';
import {Trade} from './trade';
import {Ws} from './ws';

BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

/**
 * RadarRelaySDK
 */
export class RadarRelaySDK {

    public events: EventBus;
    public account: Account;
    public tokens: RadarToken[];
    public markets: { [key: string]: Market; };
    public ws: Ws;
    public zeroEx: ZeroEx;

    private _trade: Trade;
    private _ethereum: Ethereum;
    private _apiEndpoint: string;
    private _networkId: number;
    private _prevApiEndpoint: string;
    private _markets: RadarMarket[];
    private lifecycle: SDKInitLifeCycle;

    /**
     * The load priority list maintains the function call
     * priority for each init method in the RadarRelaySDK class.
     * It is utilized by the SDKInitLifeCycle
     *
     * This list is configurable if additional init methods are necessary
     */
    private loadPriorityList: InitPriorityItem[] = [
      {
        event: 'ethereumNetworkUpdated',
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

    constructor() {
      this.events = new EventEmitter();
      this.lifecycle = new SDKInitLifeCycle(this.events, this.loadPriorityList);
    }

    public async initialize(config: SDKConfig): Promise<string | boolean> {

      // set the api endpoint outside
      // of the init lifecycle
      this._apiEndpoint = config.radarRelayEndpoint;

      // setup the lifecycle function bindings
      this.lifecycle.setup(this);

      // setup ethereum class
      return await this.setEthereumAsync(config);
    }

    // --- user configurable --- //

    public async setEthereumAsync(config: SDKConfig): Promise<string | boolean> {

      // init wallet as unlocked rpc node
      let wallet: any = config.walletRpcUrl;

      // if a password is passed in
      // instantiate the WalletManager
      if (config.password) {
        const walletManager = new WalletManager();

        // attempt to load core wallet
        try {
          wallet = await walletManager.core.loadWalletAsync(config.password);
        } catch (err) {
          // create a new core wallet
          // defaulting to 5 addresses
          wallet = await walletManager.core.createWalletAsync({ password: config.password });
          (wallet as Wallet).addNewAccounts(4);
        }
      }

      // same rpcUrl
      this._ethereum = new Ethereum(wallet, config.dataRpcUrl);
      return this.getCallback('ethereumNetworkUpdated', this._ethereum);
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
      this.zeroEx = new ZeroEx(this._ethereum.provider, {
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
        this.tokens = tokens.reduce((result, token) => {
          result[token.address] = token;
          return result;
        }, {});
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

        this.markets = this._markets.reduce((result, market) => {
          result[market.id] = new Market(market, this._apiEndpoint, this._trade);
          return result;
        }, {});

        return this.getCallback('marketsInitialized', this.markets);
    }

    private getCallback(event, data): Promise<string | boolean> {
      const callback = this.lifecycle.promise(event);
      this.events.emit(event, data);
      return callback;
    }

}
