import { ZeroEx } from '0x.js';
import { RadarToken } from 'radar-types';
import { RadarRelayConfig, LightWalletConfig, RpcWalletConfig, InjectedWalletConfig } from './types';
import { EventBus } from './event-emitter';
import { Account } from './account';
import { Market } from './market';
import { Ws } from './ws';
/**
 * RadarRelay
 */
export declare class RadarRelay {
    events: EventBus;
    account: Account;
    tokens: Map<string, RadarToken>;
    markets: Map<string, Market>;
    ws: Ws;
    zeroEx: ZeroEx;
    private _trade;
    private _ethereum;
    private _apiEndpoint;
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
    constructor(config: RadarRelayConfig);
    initialize(config: LightWalletConfig | RpcWalletConfig | InjectedWalletConfig): Promise<string | boolean>;
    private initAccountAsync;
    private initEthereumNetworkIdAsync;
    private initZeroEx;
    private initTrade;
    private initTokensAsync;
    private initMarketsAsync;
    private getCallback;
}
