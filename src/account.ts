import {ZeroEx} from '0x.js';
import {EthereumConnection} from './ethereum-connection';
import BigNumber from 'bignumber.js';
import request = require('request-promise');

// TODO move to config
const WETH_TOKEN_ADDRESS = '';
const ZEROEX_PROXY_ADDRESS = '0x087eed4bc1ee3de49befbd66c662b434b15d49d4';

export class Account {

  public address: string;
  private connection: EthereumConnection;
  private zeroEx: ZeroEx;
  private endpoint: string;

  constructor(connection: EthereumConnection, zeroEx: ZeroEx, apiEndpoint: string) {
    this.endpoint = apiEndpoint;
    this.connection = connection;
    this.address = this.connection.defaultAccount;
    this.zeroEx = zeroEx;
  }

  public async getEthBalanceAsync(): Promise<BigNumber> {
    return await this.connection.getEthBalanceAsync(this.address);
  }

  public async transferEthAsync() {
    // TODO
  }

  public async wrapEthAsync(amount: BigNumber) {
    const txHash = await this.zeroEx.etherToken.depositAsync(WETH_TOKEN_ADDRESS, amount, this.address);
    const receipt = await this.zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async unwrapEthAsync(amount: BigNumber) {
    const txHash = await this.zeroEx.etherToken.withdrawAsync(WETH_TOKEN_ADDRESS, amount, this.address);
    const receipt = await this.zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async getTokenBalanceAsync(token: string) {
    return await this.zeroEx.token.getBalanceAsync(token, this.address);
  }

  public async transferTokenAsync(token: string, to: string, amount: BigNumber) {
    const txHash = await this.zeroEx.token.transferAsync(token, this.address, to, amount);
    const receipt = await this.zeroEx.awaitTransactionMinedAsync(txHash);
    return receipt;
  }

  public async getTokenAllowanceAsync(token: string) {
    return await this.zeroEx.token.getProxyAllowanceAsync(token, this.address);
  }

  public async setTokenAllowanceAsync(token: string, amount: BigNumber) {
    const txHash = await this.zeroEx.token.setProxyAllowanceAsync(token, this.address, amount);
      const receipt = await this.zeroEx.awaitTransactionMinedAsync(txHash);
      return receipt;
  }

  public async getOrdersAsync(page: number, perPage: number = 100) {
    return JSON.parse(await request.get(`${this.endpoint}/accounts/${this.address}/orders`));
  }

  public async getFillsAsync(page: number, perPage: number = 100) {
    return JSON.parse(await request.get(`${this.endpoint}/accounts/${this.address}/fills`));
  }
}
