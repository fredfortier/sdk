import Web3 = require('web3');
import BigNumber from 'bignumber.js';
import { LightWallet } from '@radarrelay/wallet-manager';
import { WalletType, Config } from './types';
/**
 * Ethereum
 */
export declare class Ethereum {
    wallet: LightWallet;
    walletType: WalletType;
    networkId: number;
    web3: Web3;
    private _config;
    /**
     * Set the provider
     *
     * @param {WalletType} type The wallet type
     * @param {Config} config The wallet config
     */
    setProvider(type: WalletType, config: Config): Promise<void>;
    /**
     * Default account getter
     */
    readonly defaultAccount: string;
    /**
     * Get the ether balance for an account
     *
     * @param {string} address The address
     */
    getEthBalanceAsync(address: string): Promise<BigNumber>;
    /**
     * Transfer ether to another account
     *
     * @param {string} from The from address
     * @param {string} to The to address
     * @param {BigNumber} value The value to transfer
     */
    transferEthAsync(from: string, to: string, value: BigNumber, opts?: {
        gasPrice: BigNumber;
        gas: number;
    }): Promise<string>;
    /**
     * Get the RPC Connections networkId
     */
    getNetworkIdAsync(): Promise<number>;
    /**
     * Set ETH defaultAccount to a new address index or address
     *
     * @param {number|string}  account The account index or address
     */
    setDefaultAccount(account: number | string): Promise<void>;
    /**
     * Set the local LightWallet Provider
     *
     * @param {config} LightWalletConfig The LightWallet configuration
     */
    private _setLightWalletProvider;
    /**
     * Set injected wallet provider
     *
     * @param {config} InjectedWalletConfig The InjectedWallet config
     */
    private _setInjectedWalletProvider;
    /**
     * Set the rpc wallet provider
     *
     * @param {config} RpcWalletConfig The RpcWallet config
     */
    private _setRpcWalletProvider;
}
