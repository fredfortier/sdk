import { BaseAccount } from './BaseAccount';
import { RadarToken, WalletType, AccountParams } from '../types';
import { Ethereum } from '../ethereum';
import { ZeroEx } from '0x.js';
import { TSMap } from 'typescript-map';
import { LightWallet } from '@radarrelay/wallet-manager/dist/wallets/lightwallet';
import { EventEmitter } from 'events';

export class LocalAccount extends BaseAccount {
  public readonly type = WalletType.Local;
  private _wallet: LightWallet;

  /**
   * Instantiate a LocalAccount
   *
   * @param {Ethereum} ethereum
   * @param {ZeroEx} zeroEx
   * @param {string} endpoint
   * @param {TSMap<string, RadarToken>} tokens
   */
  constructor(params: AccountParams) {
    super(params);

    this._wallet = this._ethereum.wallet; // This probably shouldn't be held on Ethereum
  }

  /**
   * Export an account wallet seed phrase.
   *
   * @param {string} password
   */
  public async exportSeedPhraseAsync(password: string): Promise<string> {
    if (!this._wallet) return '';
    return await this._wallet.exportSeedPhraseAsync(password);
  }

  /**
   * Export a wallet address private key
   *
   * @param {string} password
   */
  public async exportAddressPrivateKeyAsync(password: string): Promise<string> {
    if (!this._wallet) return '';
    return await this._wallet.exportAccountPrivateKeyAsync(this.address, password);
  }

  /**
   * Set the current address in use
   *
   * @param {string|number} address or address index
   */
  public async setAddressAsync(address: string | number) {
    await this._ethereum.setDefaultAccount(address);
    this.address = this._ethereum.defaultAccount;
  }

  /**
   * Add new addresses for this account
   * NOTE: This method is only available if using a LightWallet
   *
   * @param {number}  num  amount of addresses to create
   */
  public addNewAddresses(num: number): void {
    this._wallet.addNewAccounts(num);
  }
}
