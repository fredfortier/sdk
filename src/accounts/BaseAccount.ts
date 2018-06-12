import { Ethereum } from '../Ethereum';
import { promisify } from 'util';
import { ZeroEx, TransactionReceiptWithDecodedLogs } from '0x.js';
import BigNumber from 'bignumber.js';
import { Opts, AccountParams } from '../types';
import * as request from 'request-promise';
import { RadarFill, RadarSignedOrder, RadarToken } from '@radarrelay/types';
import { TSMap } from 'typescript-map';
import { EventEmitter } from 'events';

export class BaseAccount {
  public readonly type;
  public address: string;
  protected _ethereum: Ethereum;
  protected _events: EventEmitter;
  private _zeroEx: ZeroEx;
  private _endpoint: string;
  private _tokens: TSMap<string, RadarToken>;

  constructor(params: AccountParams) {
    this._ethereum = params.ethereum;
    this._events = params.events;
    this._zeroEx = params.zeroEx;
    this._endpoint = params.endpoint;
    this._tokens = params.tokens;
    this.address = this._ethereum.defaultAccount;
  }

  /**
   * Get available addresses for this account
   */
  public async getAvailableAddressesAsync(): Promise<string[]> {
    return await promisify(this._ethereum.web3.eth.getAccounts)();
  }

  /**
   * Get ETH balance for the current selected address
   */
  public async getEthBalanceAsync(): Promise<BigNumber> {
    const balance = await this._ethereum.getEthBalanceAsync(this.address);
    return ZeroEx.toUnitAmount(balance, 18);
  }

  /**
   * Transfer ETH to another address
   *
   * @param {string}     to     address to transfer to
   * @param {BigNumber}  amount amount of eth to transfer
   * @param {Opts}       opts   optional transaction options
   */
  public async transferEthAsync(
    to: string, amount: BigNumber, opts?: Opts
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    const txOpts = {
      gasPrice: opts.transactionOpts ? opts.transactionOpts.gasPrice : undefined,
      gas: opts.transactionOpts ? opts.transactionOpts.gasLimit : undefined
    };
    const txHash = await this._ethereum.transferEthAsync(this.address, to, amount, txOpts);
    if (!opts.awaitTransactionMined) {
      return txHash;
    }
    return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  /**
   * Wrap ETH to convert it to WETH
   *
   * @param {BigNumber}  amount amount of eth to wrap
   * @param {Opts}       opts   optional transaction options
   */
  public async wrapEthAsync(
    amount: BigNumber, opts?: Opts
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    // TODO get addr from tokens array
    const txHash = await this._zeroEx.etherToken.depositAsync(
      this._getWETHTokenAddress(), ZeroEx.toBaseUnitAmount(amount, 18), this.address, opts.transactionOpts
    );
    if (!opts.awaitTransactionMined) {
      return txHash;
    }
    return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  /**
   * Unwrap WETH to convert it to ETH
   *
   * @param {BigNumber}  amount amount of WETH to unwrap
   * @param {Opts}       opts   optional transaction options
   */
  public async unwrapEthAsync(
    amount: BigNumber, opts?: Opts
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    const txHash = await this._zeroEx.etherToken.withdrawAsync(
      this._getWETHTokenAddress(), ZeroEx.toBaseUnitAmount(amount, 18), this.address, opts.transactionOpts);
    if (!opts.awaitTransactionMined) {
      return txHash;
    }
    return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  /**
   * Get balance of a token for the current selected address
   *
   * @param {string}  token  token address
   */
  public async getTokenBalanceAsync(token: string): Promise<BigNumber> {
    const balance = await this._zeroEx.token.getBalanceAsync(token, this.address);
    return ZeroEx.toUnitAmount(balance, this._tokens.get(token).decimals);
  }

  /**
   * Transfer tokens to another address
   *
   * @param {string}     token  token address
   * @param {string}     to     address to transfer to
   * @param {BigNumber}  amount amount of token to transfer
   * @param {Opts}       opts   optional transaction options
   */
  public async transferTokenAsync(
    token: string, to: string, amount: BigNumber, opts?: Opts
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    const amt = ZeroEx.toBaseUnitAmount(amount, this._tokens.get(token).decimals);
    const txHash = await this._zeroEx.token.transferAsync(token, this.address, to, amt, opts.transactionOpts);
    if (!opts.awaitTransactionMined) {
      return txHash;
    }
    return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  /**
   * Transfer tokens to another address
   *
   * @param {string}     token  token address
   */
  public async getTokenAllowanceAsync(token: string): Promise<BigNumber> {
    const baseUnitallowance = await this._zeroEx.token.getProxyAllowanceAsync(token, this.address);
    return ZeroEx.toUnitAmount(baseUnitallowance, this._tokens.get(token).decimals);
  }

  /**
   * Set a token allowance
   *
   * @param {string}     token  token address
   * @param {BigNumber}  amount allowance amount
   * @param {Opts}       opts   optional transaction options
   */
  public async setTokenAllowanceAsync(
    token: string, amount: BigNumber, opts?: Opts
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    const amt = ZeroEx.toBaseUnitAmount(amount, this._tokens.get(token).decimals);
    const txHash = await this._zeroEx.token.setProxyAllowanceAsync(token, this.address, amt, opts.transactionOpts);
    if (!opts.awaitTransactionMined) {
      return txHash;
    }
    return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  /**
   * Set unlimited token allowance
   *
   * @param {string}     token  token address
   * @param {Opts}       opts   optional transaction options
   */
  public async setUnlimitedTokenAllowanceAsync(
    token: string, opts?: Opts
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    const txHash = await this._zeroEx.token.setUnlimitedProxyAllowanceAsync(token, this.address, opts.transactionOpts);
    if (!opts.awaitTransactionMined) {
      return txHash;
    }
    return await this._zeroEx.awaitTransactionMinedAsync(txHash);
  }

  /**
   * Get orders for the selected address that have been placed on Radar
   *
   * @param {number} page
   * @param {number} perPage
   */
  public async getOrdersAsync(page: number = 1, perPage: number = 100): Promise<RadarSignedOrder[]> {
    return JSON.parse(await request.get(
      `${this._endpoint}/accounts/${this.address}/orders?page=${page}&per_page=${perPage}`
    ));
  }

  /**
   * Get fills for the selected address that have been executed on Radar
   *
   * @param {number} page
   * @param {number} perPage
   */
  public async getFillsAsync(page: number = 1, perPage: number = 100): Promise<RadarFill> {
    return JSON.parse(await request.get(
      `${this._endpoint}/accounts/${this.address}/fills?page=${page}&per_page=${perPage}`
    ));
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
