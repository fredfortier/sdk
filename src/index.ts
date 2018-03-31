
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
import {TradeExecuter} from './trade-executer';
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

    private marketsData: any;
    private tradeExecuter: TradeExecuter;
    private apiEndpoint: string;
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
        event: 'marketsInitialized',
        func: undefined,
        priority: 0
      }, {
        event: 'tradeExecutorInitialized',
        func: this.initMarketsAsync,
        priority: 1
      }, {
        event: 'accountUpdated',
        func: this.initTradeExecutor,
        priority: 2
      }, {
        event: 'apiEndpointUpdated',
        func: this.setAccount,
        priority: 3,
        args: [0], // pass default account of 0 to setAccount
      }, {
        event: 'zeroExInitialized',
        func: this.setAccount,
        args: [0], // pass default account of 0 to setAccount
        priority: 4
      }, {
        event: 'ethereumNetworkIdInitialized',
        func: this.initZeroEx,
        priority: 5
      }, {
        event: 'ethereumNetworkUpdated',
        func: this.initEthereumNetworkIdAsync,
        priority: 6
      }];

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
      await this.setEthereumConnectionAsync(ethereumRpcUrl);

      // init Websockets
      this.ws = new Ws();
    }

    // --- user configurable --- //
    public async setEthereumConnectionAsync(ethereumRpcUrl: string) {
      // same rpcUrl
      if (this.ethereum && ethereumRpcUrl === (this.ethereum.provider as any).host) return;
      this.ethereum = new EthereumConnection(ethereumRpcUrl);
      this.events.emit('ethereumNetworkUpdated', this.ethereum);
      return this.lifecycle.promise('ethereumNetworkUpdated');
    }

    public async setAccount(account: string | number) {
      this.ethereum.setDefaultAccount(account);
      this.account = new Account(this.ethereum, this.zeroEx, this.apiEndpoint);
      this.events.emit('accountUpdated', this.account);
      return this.lifecycle.promise('accountUpdated');
    }

    public async setApiEndpoint(endpoint: string) {
      this.apiEndpoint = endpoint;
      this.events.emit('apiEndpointUpdated', this.apiEndpoint);
      return this.lifecycle.promise('apiEndpointUpdated');
    }

    // --- not user configurable below this line --- //
    private async initEthereumNetworkIdAsync() {
      this.networkId = await this.ethereum.getNetworkIdAsync.apply(this.ethereum);
      this.events.emit('ethereumNetworkIdInitialized', this.networkId);
      return this.lifecycle.promise('ethereumNetworkIdInitialized');
    }

    private async initZeroEx() {
      this.zeroEx = new ZeroEx(this.ethereum.provider, {
        networkId: this.networkId
      });
      this.events.emit('zeroExInitialized', this.zeroEx);
      return this.lifecycle.promise('zeroExInitialized');
    }

    private async initTradeExecutor() {
      this.tradeExecuter = new TradeExecuter(this.zeroEx, this.apiEndpoint, this.account, this.events);
      this.events.emit('tradeExecutorInitialized', this.zeroEx);
      return this.lifecycle.promise('tradeExecutorInitialized');
    }

    private async initMarketsAsync() {
      try {
        this.marketsData = JSON.parse(await request.get(`${this.apiEndpoint}/markets`));
        this.markets = new Map(
          this.marketsData.map(market => [market.id, new Market(market, this.apiEndpoint)]));
        this.events.emit('marketsInitialized', this.markets);
      } catch (err) {
        console.warn(err);
      }
      return this.lifecycle.promise('marketsInitialized');
    }

    private async initMarketsTradeExecutor() {
      this.markets.forEach(market => {
        console.log(this);
      });
      this.events.emit('marketsTradeExecutorInitialized', this.markets);
      return this.lifecycle.promise('marketsTradeExecutorInitialized');
    }

}
