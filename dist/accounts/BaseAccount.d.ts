/// <reference types="node" />
import { Ethereum } from '../Ethereum';
import { TransactionReceiptWithDecodedLogs } from 'ethereum-types';
import BigNumber from 'bignumber.js';
import { Opts, AccountParams, WalletType } from '../types';
import { RadarFill, RadarSignedOrder } from '@radarrelay/types';
import { EventEmitter } from 'events';
export declare class BaseAccount {
    readonly type: WalletType;
    address: string;
    protected _ethereum: Ethereum;
    protected _events: EventEmitter;
    private _zeroEx;
    private _endpoint;
    private _tokens;
    /**
     * Instantiate a new BaseAccount
     *
     * @param {AccountParams} params The account parameters
     */
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
     * @param {string} toAddress The address to transfer to
     * @param {BigNumber} amount The amount of ETH to transfer
     * @param {Opts} [opts] The transaction options
     */
    transferEthAsync(toAddress: string, amount: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Wrap ETH to convert it to WETH
     *
     * @param {BigNumber} amount The amount of ETH to wrap
     * @param {Opts} [opts] The transaction options
     */
    wrapEthAsync(amount: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Unwrap WETH to convert it to ETH
     *
     * @param {BigNumber} amount The amount of WETH to unwrap
     * @param {Opts} [opts] The transaction options
     */
    unwrapEthAsync(amount: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Get balance of a token for the current selected address
     *
     * @param {string} tokenAddress The token address
     */
    getTokenBalanceAsync(tokenAddress: string): Promise<BigNumber>;
    /**
     * Transfer tokens to another address
     *
     * @param {string} tokenAddress The token address
     * @param {string} toAddress The address to transfer to
     * @param {BigNumber} amount The amount of token to transfer
     * @param {Opts} [opts] The transaction options
     */
    transferTokenAsync(tokenAddress: string, toAddress: string, amount: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Get a token allowance
     *
     * @param {string} tokenAddress The token address
     */
    getTokenAllowanceAsync(tokenAddress: string): Promise<BigNumber>;
    /**
     * Set a token allowance
     *
     * @param {string} tokenAddress The token address
     * @param {BigNumber} amount The allowance amount
     * @param {Opts} [opts] The transaction options
     */
    setTokenAllowanceAsync(tokenAddress: string, amount: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Set unlimited token allowance
     *
     * @param {string} tokenAddress The token address
     * @param {Opts} [opts] The transaction options
     */
    setUnlimitedTokenAllowanceAsync(tokenAddress: string, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Get orders for the selected address that have been placed on Radar
     *
     * @param {number} page The page to fetch
     * @param {number} perPage The number of orders per page
     */
    getOrdersAsync(page?: number, perPage?: number): Promise<RadarSignedOrder[]>;
    /**
     * Get fills for the selected address that have been executed on Radar
     *
     * @param {number} page The page to fetch
     * @param {number} perPage The number of fills per page
     */
    getFillsAsync(page?: number, perPage?: number): Promise<RadarFill[]>;
    private _getWETHTokenAddress;
}
