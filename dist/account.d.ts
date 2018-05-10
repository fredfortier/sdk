import { ZeroEx, TransactionReceiptWithDecodedLogs } from '0x.js';
import { Ethereum } from './ethereum';
import { WalletType } from './types';
import { RadarSignedOrder, RadarFill } from 'radar-types';
import BigNumber from 'bignumber.js';
export declare class Account {
    address: string;
    private _wallet;
    private _ethereum;
    private _zeroEx;
    private _endpoint;
    constructor(ethereum: Ethereum, zeroEx: ZeroEx, apiEndpoint: string, tokens: any[]);
    readonly walletType: WalletType;
    setAddressAsync(account: string | number): Promise<void>;
    getAvailableAddressesAsync(): Promise<string[]>;
    getEthBalanceAsync(): Promise<BigNumber>;
    transferEthAsync(): Promise<void>;
    wrapEthAsync(amount: BigNumber): Promise<TransactionReceiptWithDecodedLogs>;
    unwrapEthAsync(amount: BigNumber): Promise<TransactionReceiptWithDecodedLogs>;
    getTokenBalanceAsync(token: string): Promise<BigNumber>;
    transferTokenAsync(token: string, to: string, amount: BigNumber): Promise<TransactionReceiptWithDecodedLogs>;
    getTokenAllowanceAsync(token: string): Promise<BigNumber>;
    setTokenAllowanceAsync(token: string, amount: BigNumber): Promise<TransactionReceiptWithDecodedLogs>;
    setUnlimitedTokenAllowanceAsync(token: string): Promise<TransactionReceiptWithDecodedLogs>;
    getOrdersAsync(page: number, perPage?: number): Promise<RadarSignedOrder[]>;
    getFillsAsync(page: number, perPage?: number): Promise<RadarFill>;
}
