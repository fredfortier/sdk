/// <reference types="node" />
import { ZeroEx } from '0x.js';
import { EventEmitter } from 'events';
import { SDKConfig } from './types';
import { Account } from './account';
import { Market } from './market';
import { Trade } from './trade';
import { Ws } from './ws';
/**
 * RadarRelaySDK
 */
export declare class RadarRelaySDK {
    events: EventEmitter;
    account: Account;
    tokens: any;
    markets: Map<string, Market>;
    trade: Trade;
    ws: Ws;
    zeroEx: ZeroEx;
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
    setEthereumAsync(config: {
        password?: string;
        walletRpcUrl?: string;
        dataRpcUrl: string;
    }): Promise<string | boolean>;
    private initAccountAsync(account);
    private initEthereumNetworkIdAsync();
    private initZeroEx();
    private initTrade();
    private initTokensAsync();
    private initMarketsAsync();
    private getCallback(event, data);
}
