import { ZeroEx } from '0x.js';
import { SDKConfig } from './types';
import { RadarToken } from 'radar-types';
import { EventBus } from './event-emitter';
import { Account } from './account';
import { Market } from './market';
import { Ws } from './ws';
/**
 * RadarRelaySDK
 */
export declare class RadarRelaySDK {
    events: EventBus;
    account: Account;
    tokens: RadarToken[];
    markets: {
        [key: string]: Market;
    };
    ws: Ws;
    zeroEx: ZeroEx;
    private _trade;
    private _ethereum;
    private _apiEndpoint;
    private _networkId;
    private _prevApiEndpoint;
    private _markets;
    private lifecycle;
    /**
     * The load priority list maintains the function call
     * priority for each init method in the RadarRelaySDK class.
     * It is utilized by the SDKInitLifeCycle
     *
     * This list is configurable if additional init methods are necessary
     */
    private loadPriorityList;
    constructor();
    initialize(config: SDKConfig): Promise<string | boolean>;
    setEthereumAsync(config: SDKConfig): Promise<string | boolean>;
    private initAccountAsync(account);
    private initEthereumNetworkIdAsync();
    private initZeroEx();
    private initTrade();
    private initTokensAsync();
    private initMarketsAsync();
    private getCallback(event, data);
}
