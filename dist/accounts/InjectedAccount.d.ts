import { BaseAccount } from './BaseAccount';
import { Ethereum } from '..';
import { ZeroEx } from '0x.js';
import { TSMap } from 'typescript-map';
import { RadarToken, WalletType } from '../types';
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
    constructor(ethereum: Ethereum, zeroEx: ZeroEx, endpoint: string, tokens: TSMap<string, RadarToken>);
    /**
     * Watch the active address and update if necessary
     */
    private _watchActiveAddress;
}
