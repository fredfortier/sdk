import { BaseAccount } from './BaseAccount';
import { Ethereum } from '..';
import { ZeroEx } from '0x.js';
import { TSMap } from 'typescript-map';
import { RadarToken, WalletType } from '../types';

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
  constructor(ethereum: Ethereum, zeroEx: ZeroEx, endpoint: string, tokens: TSMap<string, RadarToken>) {
    super(ethereum, zeroEx, endpoint, tokens);

    this._watchActiveAddress();
  }

  /**
   * Watch the active address and update if necessary
   */
  private _watchActiveAddress() {
    setInterval(async () => {
      if (this._ethereum.web3.eth.accounts[0] !== this.address) {
        this.address = this._ethereum.web3.eth.accounts[0];
      }
    }, 500);
  }
}
