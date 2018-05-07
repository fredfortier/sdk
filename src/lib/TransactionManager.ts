import { EventEmitter } from 'events';
import { TransactionManager, Signer, PayloadType, PartialTxParams,
  UnsignedPayload, SigningError, Wallet } from '../../node_modules/vault-manager/src/types';
import { promisify } from 'promisify';
import BigNumber from 'bignumber.js';

class Web3 {
  public static Instance: any;
}

// getAccounts(): string[];
// signTransactionAsync(unsignedTx: UnsignedPayload): Promise<any>;
// signMessageAsync(unsignedMsg: UnsignedPayload): Promise<any>;

export class CoreTransactionManager implements TransactionManager {
  private _wallet: Wallet;

  constructor(wallet: Wallet) {
    this._wallet = wallet;
  }

 /**
  * Get the first account from the connected wallet
  *
  */
  public getAccounts() {
    return [this._wallet.getAccounts()[0]];
  }

  /**
   * Entry method for signing a message
   */
   public signMessageAsync(unsignedMsg: UnsignedPayload) {
     return this._wallet.signer.signPersonalMessageAsync(unsignedMsg.params.from, unsignedMsg.params.data);
   }

 /**
  * Entry method for signing/sending a transaction
  *
  */
  public async signTransactionAsync(unsignedTx: UnsignedPayload) {
    // Populate the missing tx params
    unsignedTx.params = await this.populateMissingTxParams(unsignedTx);

    return this._wallet.signer.signTransactionAsync(unsignedTx.params as PartialTxParams);
  }

 /**
  * Populates the missing tx params
  *
  */
  private async populateMissingTxParams(unsignedPayload: UnsignedPayload): Promise<PartialTxParams> {
    const web3 = Web3.Instance;
    const defaultGasPrice = await promisify<BigNumber>(web3.eth.getGasPrice)();
    const gasLimit = await promisify<number>(web3.eth.estimateGas)(unsignedPayload.params);

    // TODO: This must be called every time a tx tops the stack to avoid reusing the previous nonce
    const nonce = await promisify<number>(web3.eth.getTransactionCount)(unsignedPayload.params.from, 'pending');

    const filledParams = unsignedPayload.params as PartialTxParams;

    // Fill Params
    filledParams.gasPrice = `0x${defaultGasPrice.toString(16)}`;
    filledParams.gas = `0x${gasLimit.toString(16)}`;
    filledParams.nonce = `0x${nonce.toString(16)}`;

    return filledParams;
  }

}
