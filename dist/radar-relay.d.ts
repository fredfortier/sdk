import { ZeroEx } from '0x.js';
import { RadarToken } from 'radar-types';
import { RadarRelayConfig, LightWalletConfig, RpcWalletConfig, InjectedWalletConfig } from './types';
import Map = require('es6-map');
import { EventBus } from './event-emitter';
import { Account } from './account';
import { Market } from './market';
/**
 * RadarRelay main SDK singleton
 */
export declare class RadarRelay {
    events: EventBus;
    account: Account;
    tokens: Map<string, RadarToken>;
    markets: Map<string, Market>;
    zeroEx: ZeroEx;
    private _trade;
    private _ethereum;
    private _apiEndpoint;
    private _wsEndpoint;
    private _networkId;
    private _prevApiEndpoint;
    private _markets;
    private _lifecycle;
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
    constructor(config: RadarRelayConfig);
    /**
     * Initialize the SDK
     *
     * @param {LightWalletConfig|RpcWalletConfig|InjectedWalletConfig}  config  wallet config
     */
    initialize(config: LightWalletConfig | RpcWalletConfig | InjectedWalletConfig): Promise<string | boolean>;
    private initAccountAsync;
    private initEthereumNetworkIdAsync;
    private initZeroEx;
    private initTrade;
    private initTokensAsync;
    private initMarketsAsync;
    private getCallback;
}
