
export interface PartialTxParams {
  nonce: string;
  gasPrice?: string;
  gas: string;
  to: string;
  from?: string;
  value?: string;
  data?: string;
  chainId: number; // EIP 155 chainId - mainnet: 1, ropsten: 3
}

export interface MsgParams {
  from: string;
  data: string;
}

export interface UnsignedPayload {
  type: PayloadType;
  params: PartialTxParams | MsgParams;
}

export interface Signer {
  signPersonalMessageAsync(account: string, message: string): Promise<string>;
  signTransactionAsync(txParams: PartialTxParams): Promise<string>;
}

export interface Wallet {
  type: WalletType;
  signer: Signer;
  getAccounts(): string[];
  addNewAccounts(numberOfAccounts: number): void;
}

export interface TransactionManager {
  getAccounts(): string[];
  signTransactionAsync(unsignedTx: UnsignedPayload): Promise<any>;
  signMessageAsync(unsignedMsg: UnsignedPayload): Promise<any>;
}

export enum PayloadType {
  Tx,
  Msg,
  PersonalMsg
}

export enum WalletType {
  Core,
  Ledger
}

export enum InfuraNetwork {
  Mainnet = 'mainnet',
  Kovan = 'kovan',
  Rinkeby = 'rinkeby',
  Ropsten = 'ropsten',
}

export declare type RpcConnection = string | InfuraNetwork;
