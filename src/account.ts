import {ZeroEx, TransactionReceiptWithDecodedLogs} from '0x.js';
import {Ethereum} from './ethereum';
import {Wallet, WalletType} from './types';
import {promisify} from 'es6-promisify';
import {RadarSignedOrder, RadarFill} from 'radar-types';
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
  private _tokens: any[];

  constructor(ethereum: Ethereum, zeroEx: ZeroEx, apiEndpoint: string, tokens: any[]) {
    // TODO tokens + decimal calculations and conversions
    this._endpoint = apiEndpoint;
    this._tokens = tokens;
    this._ethereum = ethereum;
    this._zeroEx = zeroEx;
    this._wallet = this._ethereum.wallet || undefined;
    this.address = this._ethereum.defaultAccount;
  }

  get walletType() {
    return this._wallet ? WalletType.Core : WalletType.Rpc;
  }

  public async exportSeedPhraseAsync(password: string): Promise<string>  {
    return await this._wallet.exportSeedPhraseAsync(password);
  }

  public async exportAddressPrivateKeyAsync(password: string): Promise<string>  {
    return await this._wallet.exportAccountPrivateKeyAsync(this.address, password);
  }

  public async setAddressAsync(account: string | number) {
    await this._ethereum.setDefaultAccount(account);
    this.address = this._ethereum.defaultAccount;
  }

  public async getAvailableAddressesAsync(): Promise<string[]> {
    return await promisify(this._ethereum.web3.eth.getAccounts)();
  }

  public async getEthBalanceAsync(): Promise<BigNumber> {
    const balance = await this._ethereum.getEthBalanceAsync(this.address);
    return ZeroEx.toUnitAmount(balance, 18);
  }

  public async transferEthAsync() {
    // TODO
  }

  public async wrapEthAsync(amount: BigNumber): Promise<TransactionReceiptWithDecodedLogs> {
    // TODO get addr from tokens array
    const txHash = await this._zeroEx.etherToken.depositAsync(
      '0xd0a1e359811322d97991e03f863a0c30c2cf029c', ZeroEx.toBaseUnitAmount(amount, 18), this.address);
    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async unwrapEthAsync(amount: BigNumber): Promise<TransactionReceiptWithDecodedLogs> {
    // TODO get addr from tokens array
    const txHash = await this._zeroEx.etherToken.withdrawAsync(
      '0xd0a1e359811322d97991e03f863a0c30c2cf029c', ZeroEx.toBaseUnitAmount(amount, 18), this.address);
    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async getTokenBalanceAsync(token: string): Promise<BigNumber> {
    const balance = await this._zeroEx.token.getBalanceAsync(token, this.address);
    return ZeroEx.toBaseUnitAmount(balance, this._tokens[token].decimals);
  }

  public async transferTokenAsync(
    token: string, to: string, amount: BigNumber
  ): Promise<TransactionReceiptWithDecodedLogs> {
    const amt = ZeroEx.toBaseUnitAmount(amount, this._tokens[token].decimals);
    const txHash = await this._zeroEx.token.transferAsync(token, this.address, to, amount);
    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async getTokenAllowanceAsync(token: string): Promise<BigNumber> {
    const baseUnitallowance = await this._zeroEx.token.getProxyAllowanceAsync(token, this.address);
    return ZeroEx.toUnitAmount(baseUnitallowance, this._tokens[token].decimals);
  }

  public async setTokenAllowanceAsync(token: string, amount: BigNumber): Promise<TransactionReceiptWithDecodedLogs> {
    const amt = ZeroEx.toBaseUnitAmount(amount, this._tokens[token].decimals);
    const txHash = await this._zeroEx.token.setProxyAllowanceAsync(token, this.address, amt);
    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async setUnlimitedTokenAllowanceAsync(token: string): Promise<TransactionReceiptWithDecodedLogs> {
    const txHash = await this._zeroEx.token.setUnlimitedProxyAllowanceAsync(token, this.address);
    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async getOrdersAsync(page: number, perPage: number = 100): Promise<RadarSignedOrder[]> {
    return JSON.parse(await request.get(`${this._endpoint}/accounts/${this.address}/orders`));
  }

  public async getFillsAsync(page: number, perPage: number = 100): Promise<RadarFill> {
    return JSON.parse(await request.get(`${this._endpoint}/accounts/${this.address}/fills`));
  }
}
