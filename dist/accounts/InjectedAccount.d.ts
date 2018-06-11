import { BaseAccount } from './BaseAccount';
import { WalletType, AccountParams } from '../types';
export declare class InjectedAccount extends BaseAccount {
    readonly type: WalletType;
    /**
     * Instantiate an InjectedAccount
     *
     * @param {Ethereum} ethereum
     * @param {ZeroEx} zeroEx
     * @param {string} endpoint
     * @param {TSMap<string, RadarToken>} tokens
     */
    constructor(params: AccountParams);
    /**
     * Watch the active address and update if necessary
     */
    private _watchActiveAddress;
}
