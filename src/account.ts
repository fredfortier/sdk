import { ZeroEx, TransactionReceiptWithDecodedLogs } from '0x.js';
import { Ethereum } from './ethereum';
import { Wallet, WalletType, Opts } from './types';
import { promisify } from 'es6-promisify';
import { RadarSignedOrder, RadarFill, RadarToken } from 'radar-types';
import BigNumber from 'bignumber.js';
import request = require('request-promise');
import { TSMap } from 'typescript-map';

export class Account {

  public address: string;

  private _wallet: Wallet;
  private _ethereum: Ethereum;
  private _zeroEx: ZeroEx;
  private _tokens: TSMap<string, RadarToken>;
  private _endpoint: string;

  constructor(ethereum: Ethereum, zeroEx: ZeroEx, apiEndpoint: string, tokens: TSMap<string, RadarToken>) {
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

  /**
   * Export an account wallet seed phrase.
   * NOTE: This method is only available if using a LightWallet
   *
   * @param {string} password
   */
  public async exportSeedPhraseAsync(password: string): Promise<string> {
    if (!this._wallet) return '';
    return await this._wallet.exportSeedPhraseAsync(password);
  }

  /**
   * Export a wallet address private key
   * NOTE: This method is only available if using a LightWallet
   *
   * @param {string} password
   */
  public async exportAddressPrivateKeyAsync(password: string): Promise<string> {
    if (!this._wallet) return '';
    return await this._wallet.exportAccountPrivateKeyAsync(this.address, password);
  }

  /**
   * Set the current address in use
   * NOTE: This method is only available if using a LightWallet
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
