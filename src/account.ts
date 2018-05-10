import {ZeroEx} from '0x.js';
import {Ethereum} from './ethereum';
import {Wallet, WalletType} from './types';
import {promisify} from 'es6-promisify';
import BigNumber from 'bignumber.js';
import request = require('request-promise');

// TODO move to config
const WETH_TOKEN_ADDRESS = '';

export class Account {

  public address: string;

  private _wallet: Wallet;
  private _ethereum: Ethereum;
  private _zeroEx: ZeroEx;
  private _endpoint: string;

  constructor(ethereum: Ethereum, zeroEx: ZeroEx, apiEndpoint: string, tokens: any[]) {
    // TODO tokens + decimal calculations and conversions
    this._endpoint = apiEndpoint;
    this._ethereum = ethereum;
    this._zeroEx = zeroEx;
    this._wallet = this._ethereum.wallet || undefined;
    this.address = this._ethereum.defaultAccount;
  }

  get walletType() {
    return this._wallet ? WalletType.Core : WalletType.Rpc;
  }

  public async setAddressAsync(account: string | number) {
    await this._ethereum.setDefaultAccount(account);
    this.address = this._ethereum.defaultAccount;
  }

  public async getAvailableAddressesAsync(): Promise<string[]> {
    return await promisify(this._ethereum.web3.eth.getAccounts)();
  }

  public async getEthBalanceAsync(): Promise<BigNumber> {
    return await this._ethereum.getEthBalanceAsync(this.address);
  }

  public async transferEthAsync() {
    // TODO
  }

  public async wrapEthAsync(amount: BigNumber) {
    // TODO get addr from tokens array
    const amt = amount.times(10).pow(18);
    const txHash = await this._zeroEx.etherToken.depositAsync(
      '0xd0a1e359811322d97991e03f863a0c30c2cf029c', amt, this.address);
    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async unwrapEthAsync(amount: BigNumber) {
    // TODO get addr from tokens array
    const amt = amount.times(10).pow(18);
    const txHash = await this._zeroEx.etherToken.withdrawAsync(
      '0xd0a1e359811322d97991e03f863a0c30c2cf029c', amt, this.address);
    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async getTokenBalanceAsync(token: string) {
    return await this._zeroEx.token.getBalanceAsync(token, this.address);
  }

  public async transferTokenAsync(token: string, to: string, amount: BigNumber) {
    const txHash = await this._zeroEx.token.transferAsync(token, this.address, to, amount);
    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async getTokenAllowanceAsync(token: string) {
    return await this._zeroEx.token.getProxyAllowanceAsync(token, this.address);
  }

  public async setTokenAllowanceAsync(token: string, amount: BigNumber) {
    const txHash = await this._zeroEx.token.setProxyAllowanceAsync(token, this.address, amount);
    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async setUnlimitedTokenAllowanceAsync(token: string) {
    const txHash = await this._zeroEx.token.setUnlimitedProxyAllowanceAsync(token, this.address);
    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async getOrdersAsync(page: number, perPage: number = 100) {
    return JSON.parse(await request.get(`${this._endpoint}/accounts/${this.address}/orders`));
  }

  public async getFillsAsync(page: number, perPage: number = 100) {
    return JSON.parse(await request.get(`${this._endpoint}/accounts/${this.address}/fills`));
  }
}
