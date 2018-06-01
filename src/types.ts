import BigNumber from 'bignumber.js';
import Web3 = require('web3');
export {RadarToken, RadarMarket} from 'radar-types';

export interface RadarRelayConfig {
  endpoint: string;
}

export interface EthereumConfig {
  defaultGasPrice?: BigNumber;
}

export interface InjectedWalletConfig extends EthereumConfig {
  type: InjectedWalletType;
  web3: Web3;
  dataRpcUrl: string;
}

export interface CoreWalletOptions {
  password: string;
  seedPhrase?: string;
  salt?: string;
  hdPathString?: string;
}

export interface LightWalletConfig extends EthereumConfig {
  wallet: CoreWalletOptions;
  dataRpcUrl: string;
}

export interface RpcWalletConfig extends EthereumConfig {
  walletRpcUrl: string;
  dataRpcUrl: string;
}

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
  signPersonalMessageHashAsync(account: string, hash: string): Promise<string>;
  signTransactionAsync(txParams: PartialTxParams): Promise<string>;
}

export interface Wallet {
  type: WalletType;
  signer: Signer;
  getAccounts(): string[];
  addNewAccounts(numberOfAccounts: number): void;
  exportSeedPhraseAsync(password: string): string;
  exportAccountPrivateKeyAsync(account: string, password: string);
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
  Local,
  Rpc,
  Injected,
  Ledger
}

export enum InjectedWalletType {
  Metmask
}

export enum InfuraNetwork {
  Mainnet = 'mainnet',
  Kovan = 'kovan',
  Rinkeby = 'rinkeby',
  Ropsten = 'ropsten',
}

export declare type RpcConnection = string | InfuraNetwork;
