import {ZeroEx, ZeroExConfig} from '0x.js';
import {WalletManager} from 'vault-manager';
import {EventEmitter} from 'events';
import {Wallet} from './types';
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

/**
 * RadarRelaySDK
 */
export class RadarRelaySDK {

    public events: EventEmitter;
    public account: Account;
    public tokens: any;
    public markets: Map<string, Market>;
    public trade: Trade;
    public ws: Ws;
    public zeroEx: ZeroEx;

    private _ethereum: Ethereum;
    private _apiEndpoint: string;
    private _networkId: number;
    private _prevApiEndpoint: string;
    private _markets: any;
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

    public async initialize(
      config: {
        password?: string;
        walletRpcUrl?: string;
        dataRpcUrl: string;
        radarRelayEndpoint: string;
      }) {

      // set the api endpoint outside
      // of the init lifecycle
      this._apiEndpoint = config.radarRelayEndpoint;

      // setup the lifecycle function bindings
      this.lifecycle.setup(this);

      // setup ethereum class
      return await this.setEthereumAsync(config);
    }

    // --- user configurable --- //

    public async setEthereumAsync(config: {
      password?: string;
      walletRpcUrl?: string;
      dataRpcUrl: string;
    }) {

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

    private async initAccountAsync(account: string | number) {
      await this._ethereum.setDefaultAccount(account);
      this.account = new Account(this._ethereum, this.zeroEx, this._apiEndpoint, this.tokens);
      return this.getCallback('accountInitialized', this.account);
    }

    private async initEthereumNetworkIdAsync() {
      this._networkId = await this._ethereum.getNetworkIdAsync.apply(this._ethereum);
      return this.getCallback('ethereumNetworkIdInitialized', this._networkId);
    }

    private initZeroEx() {
      this.zeroEx = new ZeroEx(this._ethereum.provider, {
        networkId: this._networkId
      });
      return this.getCallback('zeroExInitialized', this.zeroEx);
    }

    private initTrade() {
      this.trade = new Trade(this.zeroEx, this._apiEndpoint, this.account, this.events);
      return this.getCallback('tradeInitialized', this.trade);
    }

    private async initTokensAsync() {
      // only fetch if not already fetched
      if (this._prevApiEndpoint !== this._apiEndpoint) {
        this.tokens = JSON.parse(await request.get(`${this._apiEndpoint}/tokens`));
      }
      // todo index by address
      return this.getCallback('tokensInitialized', this.tokens);
    }

    private async initMarketsAsync() {
        // only fetch if not already fetched
        if (this._prevApiEndpoint !== this._apiEndpoint) {
          this._markets = JSON.parse(await request.get(`${this._apiEndpoint}/markets`));
        }
        // TODO probably not the best place for this
        this._prevApiEndpoint = this._apiEndpoint;

        this.markets = new Map(
          this._markets.map(
            market => [market.id, new Market(market, this._apiEndpoint, this.trade)]
          )
        );
        return this.getCallback('marketsInitialized', this.markets);
    }

    private getCallback(event, data) {
      const callback = this.lifecycle.promise(event);
      this.events.emit(event, data);
      return callback;
    }

}
