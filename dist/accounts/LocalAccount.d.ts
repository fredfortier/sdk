import { BaseAccount } from './BaseAccount';
import { WalletType, AccountParams } from '../types';
export declare class LocalAccount extends BaseAccount {
    readonly type: WalletType;
    private _wallet;
    /**
     * Instantiate a LocalAccount
     *
     * @param {AccountParams} params The account params
     */
    constructor(params: AccountParams);
    /**
     * Export an account wallet seed phrase
     *
     * @param {string} password The plaintext password
     */
    exportSeedPhraseAsync(password: string): Promise<string>;
    /**
     * Export a wallet address private key
     *
     * @param {string} password The plaintext password
     */
    exportAddressPrivateKeyAsync(password: string): Promise<string>;
    /**
     * Set the current address in use
     *
     * @param {string|number} address The address or address index
     */
    setAddressAsync(address: string | number): Promise<void>;
    /**
     * Add new addresses for this account
     *
     * @param {number} num The number of addresses to add
     */
    addNewAddresses(num: number): void;
}
