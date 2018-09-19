import { Trade } from './Trade';
import { Opts } from './types';
import { SignedOrder, RadarBook, RadarFill, RadarCandle, RadarTicker, UserOrderType, RadarMarket, WebsocketRequestTopic, RadarStats, RadarHistory, RadarMarketBase } from '@radarrelay/types';
import { TransactionReceiptWithDecodedLogs } from 'ethereum-types';
import BigNumber from 'bignumber.js';
import { BaseAccount } from './accounts';
export declare class Market<T extends BaseAccount> implements RadarMarket, RadarMarketBase {
    id: string;
    baseTokenAddress: string;
    quoteTokenAddress: string;
    baseTokenDecimals: number;
    quoteTokenDecimals: number;
    minOrderSize: BigNumber;
    maxOrderSize: BigNumber;
    quoteIncrement: number;
    displayName: string;
    score: number;
    private _endpoint;
    private _wsEndpoint;
    private _trade;
    private _wsClient;
    constructor(market: RadarMarket, apiEndpoint: string, wsEndpoint: string, trade: Trade<T>);
    getBookAsync(): Promise<RadarBook>;
    getFillsAsync(): Promise<RadarFill[]>;
    getCandlesAsync(): Promise<RadarCandle[]>;
    getTickerAsync(): Promise<RadarTicker>;
    getStatsAsync(): Promise<RadarStats>;
    getHistoryAsync(): Promise<RadarHistory>;
    /**
     * subscribe to a socket topic for this market
     *
     * @param {WebsocketRequestTopic}  topic  The market topic
     * @param {(message: any) => void}  handlerFunc The subscription handler
     */
    subscribeAsync(topic: WebsocketRequestTopic, handlerFunc: (message: any) => void): Promise<{
        requestId: number;
        subscriptionHandler: (message: any) => void;
        unsubscribe: () => void;
    }>;
    /**
     * Execute a market order
     *
     * @param {UserOrderType} type   Order type of BUY|SELL
     * @param {BigNumber}     amount Amount in base token
     * @param {Opts}          [opts]   Optional transaction options
     */
    marketOrderAsync(type: UserOrderType, amount: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    /**
     * Place a limit order
     *
     * @param {UserOrderType} type       Order type of BUY|SELL
     * @param {BigNumber}     quantity   Amount in base token
     * @param {BigNumber}     price      Price in quote
     * @param {BigNumber}     expiration Order expiration time in seconds
     */
    limitOrderAsync(type: UserOrderType, quantity: BigNumber, price: BigNumber, expiration: BigNumber): Promise<SignedOrder>;
    /**
     * Cancel an order
     *
     * @param {SignedOrder}  order SignedOrder to cancel
     * @param {Opts}         [opts]  Optional transaction options
     */
    cancelOrderAsync(order: SignedOrder, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
}
