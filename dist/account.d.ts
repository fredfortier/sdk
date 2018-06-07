import { ZeroEx, TransactionReceiptWithDecodedLogs } from '0x.js';
import { Ethereum } from './ethereum';
import { WalletType, Opts } from './types';
import { RadarSignedOrder, RadarFill, RadarToken } from 'radar-types';
import BigNumber from 'bignumber.js';
import { TSMap } from 'typescript-map';
export declare class Account {
    address: string;
    private _wallet;
    private _ethereum;
    private _zeroEx;
    private _tokens;
    private _endpoint;
    constructor(ethereum: Ethereum, zeroEx: ZeroEx, apiEndpoint: string, tokens: TSMap<string, RadarToken>);
    readonly walletType: WalletType.Local | WalletType.Rpc;
    /**
     * Export an account wallet seed phrase.
     * NOTE: This method is only available if using a LightWallet
     *
     * @param {string} password
     */
    exportSeedPhraseAsync(password: string): Promise<string>;
    /**
     * Export a wallet address private key
     * NOTE: This method is only available if using a LightWallet
     *
     * @param {string} password
     */
    exportAddressPrivateKeyAsync(password: string): Promise<string>;
    /**
     * Set the current address in use
     * NOTE: This method is only available if using a LightWallet
     *
     * @param {string|number} address or address index
     */
    setAddressAsync(address: string | number): Promise<void>;
    /**
     * Add new addresses for this account
     * NOTE: This method is only available if using a LightWallet
     *
     * @param {number}  num  amount of addresses to create
     */
    addNewAddresses(num: number): void;
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
