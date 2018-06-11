/// <reference types="node" />
import { Ethereum } from '../Ethereum';
import { TransactionReceiptWithDecodedLogs } from '0x.js';
import BigNumber from 'bignumber.js';
import { Opts, AccountParams } from '../types';
import { RadarFill, RadarSignedOrder } from '@radarrelay/types';
import { EventEmitter } from 'events';
export declare class BaseAccount {
    readonly type: any;
    address: string;
    protected _ethereum: Ethereum;
    protected _events: EventEmitter;
    private _zeroEx;
    private _endpoint;
    private _tokens;
    constructor(params: AccountParams);
    /**
     * Get available addresses for this account
     */
    getAvailableAddressesAsync(): Promise<string[]>;
    /**
     * Get ETH balance for the current selected address
     */
    getEthBalanceAsync(): Promise<BigNumber>;
    /**
     * Transfer ETH to another address
     *
     * @param {string}     to     address to transfer to
     * @param {BigNumber}  amount amount of eth to transfer
     * @param {Opts}       opts   optional transaction options
     */
    transferEthAsync(to: string, amount: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Wrap ETH to convert it to WETH
     *
     * @param {BigNumber}  amount amount of eth to wrap
     * @param {Opts}       opts   optional transaction options
     */
    wrapEthAsync(amount: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Unwrap WETH to convert it to ETH
     *
     * @param {BigNumber}  amount amount of WETH to unwrap
     * @param {Opts}       opts   optional transaction options
     */
    unwrapEthAsync(amount: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Get balance of a token for the current selected address
     *
     * @param {string}  token  token address
     */
    getTokenBalanceAsync(token: string): Promise<BigNumber>;
    /**
     * Transfer tokens to another address
     *
     * @param {string}     token  token address
     * @param {string}     to     address to transfer to
     * @param {BigNumber}  amount amount of token to transfer
     * @param {Opts}       opts   optional transaction options
     */
    transferTokenAsync(token: string, to: string, amount: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Transfer tokens to another address
     *
     * @param {string}     token  token address
     */
    getTokenAllowanceAsync(token: string): Promise<BigNumber>;
    /**
     * Set a token allowance
     *
     * @param {string}     token  token address
     * @param {BigNumber}  amount allowance amount
     * @param {Opts}       opts   optional transaction options
     */
    setTokenAllowanceAsync(token: string, amount: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Set unlimited token allowance
     *
     * @param {string}     token  token address
     * @param {Opts}       opts   optional transaction options
     */
    setUnlimitedTokenAllowanceAsync(token: string, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Get orders for the selected address that have been placed on Radar
     *
     * @param {number} page
     * @param {number} perPage
     */
    getOrdersAsync(page?: number, perPage?: number): Promise<RadarSignedOrder[]>;
    /**
     * Get fills for the selected address that have been executed on Radar
     *
     * @param {number} page
     * @param {number} perPage
     */
    getFillsAsync(page?: number, perPage?: number): Promise<RadarFill>;
    private _getWETHTokenAddress;
}
