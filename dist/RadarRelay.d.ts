import { ZeroEx } from '0x.js';
import { RadarToken } from '@radarrelay/types';
import { RadarRelayConfig, WalletType, WalletConfig, AccountParams } from './types';
import { TSMap } from 'typescript-map';
import { EventBus } from './EventEmitter';
import { Market } from './market';
import { BaseAccount } from './accounts/BaseAccount';
/**
 * RadarRelay main SDK singleton
 */
export declare class RadarRelay<T extends BaseAccount> {
    events: EventBus;
    account: T;
    tokens: TSMap<string, RadarToken>;
    markets: TSMap<string, Market<T>>;
    zeroEx: ZeroEx;
    private _trade;
    private _ethereum;
    private _apiEndpoint;
    private _wsEndpoint;
    private _networkId;
    private _prevApiEndpoint;
    private _markets;
    private _lifecycle;
    private _wallet;
    private _walletConfig;
    private _walletType;
    /**
     * The load priority list maintains the function call
     * priority for each init method in the RadarRelaySDK class.
     * It is utilized by the SDKInitLifeCycle
     *
     * This list is configurable if additional init methods are necessary
     */
    private loadPriorityList;
    /**
     * SDK instance
     *
     * @param {RadarRelayConfig}  config  sdk config
     */
    constructor(rrConfig: RadarRelayConfig, wallet: new (params: AccountParams) => T, walletConfig: WalletConfig, walletType: WalletType);
    /**
     * Initialize the SDK
     *
     * @param {WalletConfig}  config  wallet config
     */
    initializeAsync(): Promise<RadarRelay<T>>;
    private initAccountAsync;
    private initEthereumNetworkIdAsync;
    private initZeroEx;
    private initTrade;
    private initTokensAsync;
    private initMarketsAsync;
    private getCallback;
}
