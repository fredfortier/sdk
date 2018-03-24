
import {EventEmitter} from 'events';
import {request} from 'request';
import {ZeroEx, ZeroExConfig} from '0x.js';
import BigNumber from 'bignumber.js';

// SDK Classes
import {EventBus} from './event-emitter';
import {EthereumConnection} from './ethereum-connection';
import {Account} from './account';
import {Market} from './market';
import {Trade} from './trade';

/**
 * RadarRelaySDK
 */
export class RadarRelaySDK {

    public ethereum: EthereumConnection;
    public zeroEx: ZeroEx;
    public account: Account;
    public events: EventEmitter;
    public markets: {};
    public trade: Trade;
    private apiEndpoint: string;
    private networkId: number;

    constructor() {
      this.events = new EventEmitter();
    }

    public async initialize(ethereumRpcUrl: string, radarRelayEndpoint: string = 'https://api.radarrelay.com/v0') {
      this.setApiEndpoint(radarRelayEndpoint); // set API endpoint
      await this.setEthereumConnectionAsync(ethereumRpcUrl);
      this.setAccount(0); // default to account 0
      await this.updateEthereumNetworkIdAsync(); // retrieve the current networkID
      this.updateZeroEx(); // instantiate the ZeroEx class
      await this.updateMarketsAsync();

      // setup trade functionality
      this.trade = new Trade(
        this.zeroEx,
        this.apiEndpoint,
        this.account,
        this.events
      );
    }

    public async updateMarketsAsync() {
      // const markets = await request.get(`${this.apiEndpoint}/markets`);
      // this.markets = new Map(markets.map(market => new Market(market)));
      this.events.emit('marketsUpdated', this.markets);
    }

    public async updateEthereumNetworkIdAsync() {
      this.networkId = await this.ethereum.getNetworkIdAsync.apply(this.ethereum);
      this.events.emit('ethereumNetworkIdUpdated', this.networkId);
    }

    public updateZeroEx() {
      this.zeroEx = new ZeroEx(this.ethereum.provider, {
        networkId: this.networkId
      });
      this.events.emit('zeroExUpdated', this.zeroEx);
    }

    public async setEthereumConnectionAsync(ethereumRpcUrl: string) {
      // same rpcUrl
      if (this.ethereum && ethereumRpcUrl === (this.ethereum.provider as any).host) return;
      this.ethereum = new EthereumConnection(ethereumRpcUrl);
      this.events.emit('ethereumNetworkUpdated', this.ethereum);
    }

    public setAccount(account: string | number) {
      this.ethereum.setDefaultAccount(account);
      this.account = new Account(this.ethereum);
      this.events.emit('accountUpdated', this.account);
    }

    public setApiEndpoint(endpoint: string) {
      this.apiEndpoint = endpoint;
      this.events.emit('apiEndpointUpdated', this.apiEndpoint);
    }

}
