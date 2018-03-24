import {EventEmitter} from 'events';
import BigNumber from 'bignumber.js';
import {ZeroEx, ZeroExConfig, SignedOrder} from '0x.js';

// SDK Classes
import {EventBus} from './event-emitter';
import {EthereumConnection} from './ethereum-connection';
import {Account} from './account';

// 'http://35.196.15.153:8545'

/**
 * RadarRelaySDK
 */
export class RadarRelaySDK {

    public events: EventEmitter;
    public zeroEx: ZeroEx;
    public ethereum: EthereumConnection;
    public networkId: number;
    public account: Account;

    constructor() {
      this.events = new EventEmitter();
    }

    public async setEthereumConnectionAsync(ethereumRpcUrl: string) {
      this.ethereum = new EthereumConnection(ethereumRpcUrl);
      this.networkId = await this.ethereum.getNetworkIdAsync.apply(this.ethereum);
      this.zeroEx = new ZeroEx(this.ethereum.provider, {
        networkId: this.networkId
      });
      this.events.emit('networkUpdated', this.ethereum, this.zeroEx);

      // default to account 0
      this.setAccount(0);
    }

    public setAccount(account: string | number) {
      this.ethereum.setDefaultAccount(account);
      this.account = new Account(this.ethereum);
      this.events.emit('accountUpdated', this.account);
    }

}
