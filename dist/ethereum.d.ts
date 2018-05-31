import Web3 = require('web3');
import BigNumber from 'bignumber.js';
import { Wallet, WalletType, LightWalletConfig, RpcWalletConfig, InjectedWalletConfig } from './types';
/**
 * Ethereum
 */
export declare class Ethereum {
    wallet: Wallet;
    walletType: WalletType;
    networkId: number;
    web3: Web3;
    private _events;
    private _config;
    setProvider(type: WalletType, config: LightWalletConfig | InjectedWalletConfig | RpcWalletConfig): Promise<void>;
    readonly defaultAccount: string;
    /**
     * get the ether balance for an account
     *
     * @param {string} address
     */
    getEthBalanceAsync(address: string): Promise<BigNumber>;
    /**
     * transfer ether to another account
     *
     * @param {string} from
     * @param {string} to
     * @param {BigNumber} value
     */
    transferEthAsync(from: string, to: string, value: BigNumber): Promise<string>;
    /**
     * get the RPC Connections networkId
     */
    getNetworkIdAsync(): Promise<number>;
    /**
     * set eth defaultAccount to a
     * new address index or address
     *
     * @param {number|string}  account  account index or address
     */
    setDefaultAccount(account: number | string): Promise<void>;
    /**
     * Set the local LightWallet Providers
     *
     * @param {config} LightWalletConfig
     */
    private _setLightWalletProvider;
    /**
     * Set injected wallet provider
     *
     * @param {config} InjectedWalletConfig
     */
    private _setInjectedWalletProvider;
    /**
     * Set the rpc wallet providers
     * TODO use Web3Builder
     *
     * @param {config} RpcWalletConfig
     */
    private _setRpcWalletProvider;
}
