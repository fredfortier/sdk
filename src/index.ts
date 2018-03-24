
import {EventEmitter} from 'events';
import {request} from 'request';
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
    public networkId: number;
    public account: Account;
    public events: EventEmitter;
    public markets: {};
    public trade: Trade;
    private apiEndpoint: string;

    constructor() {
      this.events = new EventEmitter();
    }

    /**
     * Initialize the SDK
     */
    public async initialize(ethereumRpcUrl: string, radarRelayEndpoint: string = 'https://api.radarrelay.com/v0') {
      this.setApiEndpoint(radarRelayEndpoint);
      await this.setEthereumConnectionAsync(ethereumRpcUrl);
      await this.fetchMarketsAsync(radarRelayEndpoint);

      // setup trade functionality
      this.trade = new Trade(
        this.ethereum,
        this.networkId,
        this.apiEndpoint,
        this.account,
        this.events
      );
    }

    /**
     * Fetch our markets from the API
     */
    public async fetchMarketsAsync(radarRelayEndpoint: string) {
      // const markets = await request.get(`${radarRelayEndpoint}/markets`);
      // this.markets = new Map(markets.map(market => new Market(market)));
      this.events.emit('marketsUpdated', this.markets);
    }

    /**
     * Set the Ethereum RPC connection
     */
    public async setEthereumConnectionAsync(ethereumRpcUrl: string) {
      // same rpcUrl
      if (this.ethereum && ethereumRpcUrl === (this.ethereum.provider as any).host) return;
      this.ethereum = new EthereumConnection(ethereumRpcUrl);
      this.networkId = await this.ethereum.getNetworkIdAsync.apply(this.ethereum);
      this.events.emit('networkUpdated', this.ethereum);
      // default to account 0
      this.setAccount(0);
    }

    public setAccount(account: string | number) {
      this.ethereum.setDefaultAccount(account);
      this.account = new Account(this.ethereum);
      this.events.emit('accountUpdated', this.account);
    }

    public setApiEndpoint(endpoint: string) {
      this.apiEndpoint = endpoint;
    }

}
