
import {EventEmitter} from 'events';
import {ZeroEx, ZeroExConfig} from '0x.js';
import BigNumber from 'bignumber.js';
import request = require('request-promise');

// SDK Classes
import {SDKEventLifeCycle} from './sdk-event-lifecycle';
import {EventBus} from './event-emitter';
import {EthereumConnection} from './ethereum-connection';
import {Account} from './account';
import {Market} from './market';
import {TradeExecuter} from './trade-executer';

/**
 * RadarRelaySDK
 */
export class RadarRelaySDK {

    public ethereum: EthereumConnection;
    public zeroEx: ZeroEx;
    public account: Account;
    public events: EventEmitter;
    public tradeExecuter: TradeExecuter;
    public markets: Map<string, Market>;

    private apiEndpoint: string;
    private networkId: number;
    private lifecycle: SDKEventLifeCycle;

    constructor() {
      this.events = new EventEmitter();
      this.lifecycle = new SDKEventLifeCycle(this.events);
    }

    public async initialize(ethereumRpcUrl: string, radarRelayEndpoint: string = 'https://api.radarrelay.com/v0') {
      // don't user setter on initialize, because the event
      // lifecycle will trigger updates of the tradeExecutor
      this.apiEndpoint = radarRelayEndpoint;

      // initialize lifecycle eventloop
      this.events.on('tradeExecutorUpdated', this.updateMarketsAsync.bind(this));
      this.events.on('accountUpdated', this.updateTradeExecutor.bind(this));
      this.events.on('apiEndpointUpdated', this.updateTradeExecutor.bind(this));
      this.events.on('zeroExUpdated', this.setAccount.bind(this, 0)); // default to account 0
      this.events.on('ethereumNetworkIdUpdated', this.updateZeroEx.bind(this));
      this.events.on('ethereumNetworkUpdated', this.updateEthereumNetworkIdAsync.bind(this));

      // set connection
      await this.setEthereumConnectionAsync(ethereumRpcUrl);
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
      this.account = new Account(this.ethereum, this.zeroEx);
      this.events.emit('accountUpdated', this.account);
      return this.lifecycle.promise('accountUpdated');
    }

    public async setApiEndpoint(endpoint: string) {
      this.apiEndpoint = endpoint;
      this.events.emit('apiEndpointUpdated', this.apiEndpoint);
      return this.lifecycle.promise('apiEndpointUpdated');
    }

    // --- not user configurable below this line --- //
    private async updateEthereumNetworkIdAsync() {
      this.networkId = await this.ethereum.getNetworkIdAsync.apply(this.ethereum);
      this.events.emit('ethereumNetworkIdUpdated', this.networkId);
      return this.lifecycle.promise('ethereumNetworkIdUpdated');
    }

    private async updateZeroEx() {
      this.zeroEx = new ZeroEx(this.ethereum.provider, {
        networkId: this.networkId
      });
      this.events.emit('zeroExUpdated', this.zeroEx);
      return this.lifecycle.promise('zeroExUpdated');
    }

    private async updateTradeExecutor() {
      this.tradeExecuter = new TradeExecuter(this.zeroEx, this.apiEndpoint, this.account, this.events);
      this.events.emit('tradeExecutorUpdated', this.zeroEx);
      return this.lifecycle.promise('tradeExecutorUpdated');
    }

    private async updateMarketsAsync() {
      try {
        const markets = JSON.parse(await request.get(`${this.apiEndpoint}/markets`));
        this.markets = new Map(
          markets.map(market => [market.id, new Market(market, this.tradeExecuter)]));
        this.events.emit('marketsUpdated', this.markets);
      } catch (err) {
        console.warn(err);
      }
      return this.lifecycle.promise('marketsUpdated');
    }

}
