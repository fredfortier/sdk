import BigNumber from 'bignumber.js';
import {EthereumConnection} from './ethereum-connection';

export class Account {

  private connection: EthereumConnection;

  constructor(connection: EthereumConnection) {
    this.connection = connection;
  }

  get address() {
    return this.connection.defaultAccount;
  }

  public async getEthBalanceAsync(): Promise<BigNumber> {
    return await this.connection.getEthBalanceAsync();
  }

  // public async transfer() {}

}
