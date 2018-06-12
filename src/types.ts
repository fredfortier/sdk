import { TransactionOpts, ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import Web3 = require('web3');
import { LocalAccount } from './accounts/LocalAccount';
import { RpcAccount } from './accounts/RpcAccount';
import { InjectedAccount } from './accounts/InjectedAccount';
import { Ethereum } from './Ethereum';
import { EventEmitter } from 'events';
import { TSMap } from 'typescript-map';
import { RadarToken } from '@radarrelay/types';
export { RadarToken, RadarMarket } from '@radarrelay/types';

export interface RadarEndpointConfig {
  endpoint: string;
  websocketEndpoint: string;
}

export interface RadarRelayConfig extends RadarEndpointConfig {
  sdkInitializationTimeoutMs?: number;
}

export interface EthereumConfig {
  defaultGasPrice?: BigNumber;
}

export interface InjectedWalletConfig extends EthereumConfig {
  type: InjectedWalletType;
  web3?: Web3;
  dataRpcUrl?: string;
}

export interface LightWalletOptions {
  password: string;
  seedPhrase?: string;
  salt?: string;
  hdPathString?: string;
}

export interface LightWalletConfig extends EthereumConfig {
  wallet: LightWalletOptions;
  dataRpcUrl: string;
}

export interface RpcWalletConfig extends EthereumConfig {
  rpcUrl: string;
}

export interface Opts {
  transactionOpts?: TransactionOpts;
  awaitTransactionMined?: boolean;
}

export enum WalletType {
  Local,
  Rpc,
  Injected,
  Ledger
}

export enum InjectedWalletType {
  Metmask = 'metamask'
}

export enum InfuraNetwork {
  Mainnet = 'mainnet',
  Kovan = 'kovan',
  Rinkeby = 'rinkeby',
  Ropsten = 'ropsten',
}

export enum NetwordId {
  Mainnet = 1,
  Kovan = 42,
  Rinkeby = 4,
  Ropsten = 3,
}

export type RpcConnection = string | InfuraNetwork;

export type Account = LocalAccount | RpcAccount | InjectedAccount;

export type WalletConfig = LightWalletConfig | RpcWalletConfig | InjectedWalletConfig;

export interface AccountParams {
  ethereum: Ethereum;
  events: EventEmitter;
  zeroEx: ZeroEx;
  endpoint: string;
  tokens: TSMap<string, RadarToken>;
}
