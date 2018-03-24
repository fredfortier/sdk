import BigNumber from 'bignumber.js';
import {EthereumConnection} from './ethereum-connection';

export class Account {

  public address: string;
  // public fills: Fill[];
  // public orders: Order[];
  private connection: EthereumConnection;

  constructor(connection: EthereumConnection) {
    this.connection = connection;
    this.address = this.connection.defaultAccount;
  }

  public async getEthBalanceAsync(): Promise<BigNumber> {
    return await this.connection.getEthBalanceAsync(this.address);
  }

  // public async transferEthAsync() {}

  // public async wrapEthAsync() {}

  // public async unwrapEthAsync() {}

  // public async getTokenBalanceAsync() {}

  // public async transferTokensAsync() {}

  // public async getTokenAllowanceAsync(tokenAddress: string) {
  //   const zeroExProxyContract = '0x087eed4bc1ee3de49befbd66c662b434b15d49d4';
  //
  //   // Set Exchange Contract Address.
  //   const exchangeAddress = zeroEx.exchange.getContractAddress();
  //
  //   const zrxAllowance = await zeroEx.token.getAllowanceAsync(
  //     '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570',
  //     this.address,
  //     exchangeAddress
  //   );
  // }

  // public async setTokenAllowanceAsync() {}

  // public async getOpenOrders
}
