import { BaseAccount } from './BaseAccount';
import { Ethereum } from '../ethereum';
import { RadarRelay } from '../RadarRelay';
import { ZeroEx } from '0x.js';
import { TSMap } from 'typescript-map';
import { RadarToken, WalletType, AccountParams } from '../types';
import { EventEmitter } from 'events';

export class InjectedAccount extends BaseAccount {
  public readonly type = WalletType.Injected;

  /**
   * Instantiate an InjectedAccount
   *
   * @param {Ethereum} ethereum
   * @param {ZeroEx} zeroEx
   * @param {string} endpoint
   * @param {TSMap<string, RadarToken>} tokens
   */
  constructor(params: AccountParams) {
    super(params);
    this._watchActiveAddress();
  }

  /**
   * Watch the active address and update if necessary
   */
  private _watchActiveAddress() {
    setInterval(async () => {
      if (this._ethereum.web3.eth.accounts[0] !== this.address) {
        this.address = this._ethereum.web3.eth.accounts[0];
        this._events.emit('addressChanged', this.address);
      }
    }, 500);
  }
}
