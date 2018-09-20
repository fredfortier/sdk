import { BaseAccount } from './BaseAccount';
import { WalletType, AccountParams } from '../types';
import { LightWallet } from '@radarrelay/wallet-manager';

export class LocalAccount extends BaseAccount {

  // --- Properties --- //

  public readonly type = WalletType.Local;

  private _wallet: LightWallet;

  // --- Constructor --- //

  /**
   * Instantiate a LocalAccount.
   *
   * @param {AccountParams} params The account params
   */
  constructor(params: AccountParams) {
    super(params);

    this._wallet = this._ethereum.wallet; // This probably shouldn't be held on Ethereum
  }

  // --- Exposed methods --- //

  /**
   * Export an account wallet seed phrase.
   *
   * @param {string} password The plaintext password.
   */
  public async exportSeedPhraseAsync(password: string): Promise<string> {
    if (!this._wallet) return '';
    return await this._wallet.exportSeedPhraseAsync(password);
  }

  /**
   * Export a wallet address private key.
   *
   * @param {string} password The plaintext password.
   */
  public async exportAddressPrivateKeyAsync(password: string): Promise<string> {
    if (!this._wallet) return '';
    return await this._wallet.exportAccountPrivateKeyAsync(this.address, password);
  }

  /**
   * Set the current address in use.
   *
   * @param {string|number} address The address or address index.
   */
  public async setAddressAsync(address: string | number) {
    await this._ethereum.setDefaultAccount(address);
    this.address = this._ethereum.defaultAccount;
  }

  /**
   * Add new addresses for this account.
   *
   * @param {number} num The number of addresses to add.
   */
  public addNewAddresses(num: number): void {
    this._wallet.addNewAccounts(num);
  }
}
