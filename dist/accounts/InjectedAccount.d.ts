import { BaseAccount } from './BaseAccount';
import { WalletType, AccountParams } from '../types';
export declare class InjectedAccount extends BaseAccount {
    readonly type: WalletType;
    /**
     * Instantiate an InjectedAccount
     *
     * @param {AccountParams} params The account parameters
     */
    constructor(params: AccountParams);
    /**
     * Watch the active address and update if necessary
     */
    private _watchActiveAddress;
}
