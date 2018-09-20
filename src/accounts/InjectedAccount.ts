import { BaseAccount } from './BaseAccount';
import { WalletType, AccountParams, EventName } from '../types';

export class InjectedAccount extends BaseAccount {

  // --- Properties --- //

  public readonly type = WalletType.Injected;

  // --- Constructor --- //

  /**
   * Instantiate an InjectedAccount.
   *
   * @param {AccountParams} params The account parameters.
   */
  constructor(params: AccountParams) {
    super(params);
    this._watchActiveAddress();
  }

  // --- Internal methods --- //

  /**
   * Watch the active address and update if necessary.
   */
  private _watchActiveAddress() {
    setInterval(async () => {
      if (this._ethereum.web3.eth.accounts[0] !== this.address) {
        this.address = this._ethereum.web3.eth.accounts[0];
        this._events.emit(EventName.AddressChanged, this.address);
      }
    }, 500);
  }
}
