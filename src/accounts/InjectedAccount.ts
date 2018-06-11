import { BaseAccount } from './BaseAccount';
import { WalletType, AccountParams } from '../types';

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
