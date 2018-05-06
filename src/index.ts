
import {EventEmitter} from 'events';
import {ZeroEx, ZeroExConfig} from '0x.js';
import BigNumber from 'bignumber.js';
import request = require('request-promise');

// SDK Classes
import {SDKInitLifeCycle, InitPriorityItem} from './sdk-init-lifecycle';
import {EventBus} from './event-emitter';
import {EthereumConnection} from './ethereum-connection';
import {Account} from './account';
import {Market} from './market';
import {Trade} from './trade';
import {Ws} from './ws';

/**
 * RadarRelaySDK
 */
export class RadarRelaySDK {

    public ethereum: EthereumConnection;
    public zeroEx: ZeroEx;
    public account: Account;
    public events: EventEmitter;
    public markets: Map<string, Market>;
    public ws: Ws;

    private trade: Trade;
    private apiEndpoint: string;
    private _prevApiEndpoint: string;
    private _markets: any;
    private tokens: any;
    private networkId: number;
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
        event: 'apiEndpointUpdated',
        func: this.initTokensAsync
      }, {
        event: 'tokensInitialized',
        func: this.setAccount,
        args: [0] // pass default account of 0 to setAccount
      }, {
        event: 'accountUpdated',
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

    public async initialize(ethereumRpcUrl: string, radarRelayEndpoint: string = 'https://api.radarrelay.com/v0') {
      // setting the API endpoint outside of the lifecycle
      // prevents the TradeExecuter class from loading twice
      this.apiEndpoint = radarRelayEndpoint;

      // setup the lifecycle function bindings
      this.lifecycle.setup(this);

      // set connection
      return await this.setEthereumConnectionAsync(ethereumRpcUrl);
    }

    // --- user configurable --- //
    public async setEthereumConnectionAsync(ethereumRpcUrl: string) {
      // same rpcUrl
      if (this.ethereum && ethereumRpcUrl === (this.ethereum.provider as any).host) return;
      this.ethereum = new EthereumConnection(ethereumRpcUrl);
      return this.getCallback('ethereumNetworkUpdated', this.ethereum);
    }

    public async setAccount(account: string | number) {
      this.ethereum.setDefaultAccount(account);
      this.account = new Account(this.ethereum, this.zeroEx, this.apiEndpoint, this.tokens);
      return this.getCallback('accountUpdated', this.account);
    }

    public async setApiEndpoint(endpoint: string) {
      this.apiEndpoint = endpoint;
      return this.getCallback('apiEndpointUpdated', this.apiEndpoint);
    }

    // --- not user configurable below this line --- //
    private async initEthereumNetworkIdAsync() {
      this.networkId = await this.ethereum.getNetworkIdAsync.apply(this.ethereum);
      return this.getCallback('ethereumNetworkIdInitialized', this.networkId);
    }

    private initZeroEx() {
      this.zeroEx = new ZeroEx(this.ethereum.provider, {
        networkId: this.networkId
      });
      return this.getCallback('zeroExInitialized', this.zeroEx);
    }

    private initTrade() {
      this.trade = new Trade(this.zeroEx, this.apiEndpoint, this.account, this.events);
      return this.getCallback('tradeInitialized', this.trade);
    }

    private async initTokensAsync() {
      // only fetch if not already fetched
      if (this._prevApiEndpoint !== this.apiEndpoint) {
        this.tokens = JSON.parse(await request.get(`${this.apiEndpoint}/tokens`));
      }
      // todo index by address
      return this.getCallback('tokensInitialized', this.tokens);
    }

    private async initMarketsAsync() {
        // only fetch if not already fetched
        if (this._prevApiEndpoint !== this.apiEndpoint) {
          this._markets = JSON.parse(await request.get(`${this.apiEndpoint}/markets`));
        }
        // TODO probably not the best place for this
        this._prevApiEndpoint = this.apiEndpoint;

        this.markets = new Map(
          this._markets.map(
            market => [market.id, new Market(market, this.apiEndpoint, this.trade)]
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
