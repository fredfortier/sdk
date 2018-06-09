import { BaseAccount } from './BaseAccount';
import { Ethereum } from '..';
import { ZeroEx } from '0x.js';
import { TSMap } from 'typescript-map';
import { RadarToken, WalletType } from '../types';
import { EventEmitter } from 'events';

export class InjectedAccount extends BaseAccount {
  public readonly type = WalletType.Injected;
  private _events: EventEmitter;

  /**
   * Instantiate an InjectedAccount
   *
   * @param {Ethereum} ethereum
   * @param {ZeroEx} zeroEx
   * @param {string} endpoint
   * @param {TSMap<string, RadarToken>} tokens
   */
  constructor(
    ethereum: Ethereum,
    zeroEx: ZeroEx,
    endpoint: string,
    tokens: TSMap<string, RadarToken>,
    events: EventEmitter
  ) {
    super(ethereum, zeroEx, endpoint, tokens);

    this._events = events;
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
