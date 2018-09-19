import { ZeroEx } from './ZeroEx';
import { RadarToken } from '@radarrelay/types';
import { WalletType, Config, AccountParams } from './types';
import { TSMap } from 'typescript-map';
import Web3 = require('web3');
import { EventBus } from './EventEmitter';
import { Market } from './Market';
import { LazyMap } from './LazyMap';
import { BaseAccount } from './accounts/BaseAccount';
/**
 * RadarRelay main SDK singleton
 */
export declare class RadarRelay<T extends BaseAccount> {
    events: EventBus;
    account: T;
    tokens: TSMap<string, RadarToken>;
    markets: LazyMap<string, Market<T>>;
    zeroEx: ZeroEx;
    web3: Web3;
    private _trade;
    private _ethereum;
    private _networkId;
    private _prevApiEndpoint;
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
    private initAccountAsync;
    private initEthereumNetworkIdAsync;
    private initZeroEx;
    private initTrade;
    private initTokensAsync;
    private initMarketsAsync;
    private getCallback;
    private setEndpointOrThrowAsync;
}
