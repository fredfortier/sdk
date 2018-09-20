/// <reference types="node" />
import { EventEmitter } from 'events';
import { RadarToken } from '@radarrelay/types';
import Web3 = require('web3');
import { WalletType, Config, AccountParams } from './types';
import { ZeroEx } from './ZeroEx';
import { BaseAccount } from './accounts/BaseAccount';
import { MarketsCache } from './pagination/MarketsCache';
/**
 * RadarRelay main SDK singleton
 */
export declare class RadarRelay<T extends BaseAccount> {
    events: EventEmitter;
    account: T;
    tokens: Map<string, RadarToken>;
    zeroEx: ZeroEx;
    web3: Web3;
    markets: MarketsCache<T>;
    private _trade;
    private _ethereum;
    private _networkId;
    private _lifecycle;
    private _wallet;
    private _config;
    private _walletType;
    /**
     * The load priority list maintains the function call
     * priority for each init method in the RadarRelaySDK class.
     * It is utilized by the SdkInitLifeCycle
     *
     * This list is configurable if additional init methods are necessary
     */
    private loadPriorityList;
    /**
     * SDK instance
     *
     * @param {RadarRelayConfig} config  sdk config
     */
    constructor(wallet: new (params: AccountParams) => T, walletType: WalletType, config: Config);
    /**
     * Initialize the SDK
     *
     * @param {Config} config The wallet configuration
     */
    initializeAsync(): Promise<RadarRelay<T>>;
    readonly config: Config;
    private initAccountAsync;
    private initEthereumNetworkIdAsync;
    private initZeroEx;
    private initTrade;
    private initTokensAsync;
    private initMarketsAsync;
    private getCallback;
    private setEndpointOrThrowAsync;
}
