import BigNumber from 'bignumber.js';
export { RadarToken, RadarMarket } from 'radar-types';
export interface CoreWalletOptions {
    password: string;
    seedPhrase?: string;
    salt?: string;
    hdPathString?: string;
}
export interface RadarRelayConfig {
    wallet?: CoreWalletOptions;
    rpcWallet?: string;
    endpoint?: string;
    defaultGasPrice?: BigNumber;
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
    chainId: number;
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
    exportAccountPrivateKeyAsync(account: string, password: string): any;
}
export interface TransactionManager {
    getAccounts(): string[];
    signTransactionAsync(unsignedTx: UnsignedPayload): Promise<any>;
    signMessageAsync(unsignedMsg: UnsignedPayload): Promise<any>;
}
export declare enum PayloadType {
    Tx = 0,
    Msg = 1,
    PersonalMsg = 2,
}
export declare enum WalletType {
    Core = 0,
    Ledger = 1,
    Rpc = 2,
}
export declare enum InfuraNetwork {
    Mainnet = "mainnet",
    Kovan = "kovan",
    Rinkeby = "rinkeby",
    Ropsten = "ropsten",
}
export declare type RpcConnection = string | InfuraNetwork;
