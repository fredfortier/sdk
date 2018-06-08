import { BaseAccount } from './BaseAccount';
import { RadarToken, WalletType } from '../types';
import { Ethereum } from '../ethereum';
import { ZeroEx } from '0x.js';
import { TSMap } from 'typescript-map';
export declare class LocalAccount extends BaseAccount {
    readonly type: WalletType;
    private _wallet;
    /**
     * Instantiate a LocalAccount
     *
     * @param {Ethereum} ethereum
     * @param {ZeroEx} zeroEx
     * @param {string} endpoint
     * @param {TSMap<string, RadarToken>} tokens
     */
    constructor(ethereum: Ethereum, zeroEx: ZeroEx, endpoint: string, tokens: TSMap<string, RadarToken>);
    /**
     * Export an account wallet seed phrase.
     *
     * @param {string} password
     */
    exportSeedPhraseAsync(password: string): Promise<string>;
    /**
     * Export a wallet address private key
     *
     * @param {string} password
     */
    exportAddressPrivateKeyAsync(password: string): Promise<string>;
    /**
     * Set the current address in use
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
}
