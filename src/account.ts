import {ZeroEx, TransactionReceiptWithDecodedLogs} from '0x.js';
import {Ethereum} from './ethereum';
import {Wallet, WalletType} from './types';
import {promisify} from 'es6-promisify';
import {RadarSignedOrder, RadarFill, RadarToken} from 'radar-types';
import BigNumber from 'bignumber.js';
import request = require('request-promise');
import * as Map from 'es6-map';

export class Account {

  public address: string;

  private _wallet: Wallet;
  private _ethereum: Ethereum;
  private _zeroEx: ZeroEx;
  private _tokens: Map<string, RadarToken>;
  private _endpoint: string;

  constructor(ethereum: Ethereum, zeroEx: ZeroEx, apiEndpoint: string, tokens: Map<string, RadarToken>) {
    // TODO tokens + decimal calculations and conversions
    this._endpoint = apiEndpoint;
    this._tokens = tokens;
    this._ethereum = ethereum;
    this._zeroEx = zeroEx;
    this._wallet = this._ethereum.wallet || undefined;
    this.address = this._ethereum.defaultAccount;
  }

  get walletType() {
    return this._wallet ? WalletType.Local : WalletType.Rpc;
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

  public addNewAddresses(num: number): void {
    this._wallet.addNewAccounts(num);
  }

  public async getAvailableAddressesAsync(): Promise<string[]> {
    return await promisify(this._ethereum.web3.eth.getAccounts)();
  }

  public async getEthBalanceAsync(): Promise<BigNumber> {
    const balance = await this._ethereum.getEthBalanceAsync(this.address);
    return ZeroEx.toUnitAmount(balance, 18);
  }

  public async transferEthAsync(
    to: string, amount: BigNumber, awaitTransactionMined: boolean = false
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    const txHash = await this._ethereum.transferEthAsync(this.address, to, amount);
    if (!awaitTransactionMined) {
      return txHash;
    }
    return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  public async wrapEthAsync(
    amount: BigNumber, awaitTransactionMined: boolean = false
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    // TODO get addr from tokens array
    const txHash = await this._zeroEx.etherToken.depositAsync(
      this._getWETHTokenAddress(), ZeroEx.toBaseUnitAmount(amount, 18), this.address
    );
    if (!awaitTransactionMined) {
      return txHash;
    }
    return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  public async unwrapEthAsync(
    amount: BigNumber, awaitTransactionMined: boolean = false
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    const txHash = await this._zeroEx.etherToken.withdrawAsync(
      this._getWETHTokenAddress(), ZeroEx.toBaseUnitAmount(amount, 18), this.address);
      if (!awaitTransactionMined) {
        return txHash;
      }
      return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  public async getTokenBalanceAsync(token: string): Promise<BigNumber> {
    const balance = await this._zeroEx.token.getBalanceAsync(token, this.address);
    return ZeroEx.toUnitAmount(balance, this._tokens.get(token).decimals);
  }

  public async transferTokenAsync(
    token: string, to: string, amount: BigNumber, awaitTransactionMined: boolean = false
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    const amt = ZeroEx.toBaseUnitAmount(amount, this._tokens.get(token).decimals);
    const txHash = await this._zeroEx.token.transferAsync(token, this.address, to, amt);
    if (!awaitTransactionMined) {
      return txHash;
    }
    return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  public async getTokenAllowanceAsync(token: string): Promise<BigNumber> {
    const baseUnitallowance = await this._zeroEx.token.getProxyAllowanceAsync(token, this.address);
    return ZeroEx.toUnitAmount(baseUnitallowance, this._tokens.get(token).decimals);
  }

  public async setTokenAllowanceAsync(
    token: string, amount: BigNumber, awaitTransactionMined: boolean = false
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    const amt = ZeroEx.toBaseUnitAmount(amount, this._tokens.get(token).decimals);
    const txHash = await this._zeroEx.token.setProxyAllowanceAsync(token, this.address, amt);
    if (!awaitTransactionMined) {
      return txHash;
    }
    return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  public async setUnlimitedTokenAllowanceAsync(
    token: string, awaitTransactionMined: boolean = false
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    const txHash = await this._zeroEx.token.setUnlimitedProxyAllowanceAsync(token, this.address);
    if (!awaitTransactionMined) {
      return txHash;
    }
    return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  public async getOrdersAsync(page: number = 1, perPage: number = 100): Promise<RadarSignedOrder[]> {
    return JSON.parse(await request.get(`${this._endpoint}/accounts/${this.address}/orders`));
  }

  public async getFillsAsync(page: number = 1, perPage: number = 100): Promise<RadarFill> {
    return JSON.parse(await request.get(`${this._endpoint}/accounts/${this.address}/fills`));
  }

  private _getWETHTokenAddress(): string {
    let token;
    this._tokens.forEach(t => {
      if (t.symbol === 'WETH') {
        token = t;
      }
    });
    return token.address;
  }
}
