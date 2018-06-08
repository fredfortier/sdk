import { SignedOrder, TransactionReceiptWithDecodedLogs, Order } from '0x.js';
import { Trade } from './trade';
import { Opts } from './types';
import { RadarBook, RadarFill, RadarCandle, RadarTicker, UserOrderType, RadarMarket, WebsocketRequestTopic } from '@radarrelay/types';
import BigNumber from 'bignumber.js';
export declare class Market {
    id: string;
    baseTokenAddress: string;
    quoteTokenAddress: string;
    baseTokenDecimals: BigNumber;
    quoteTokenDecimals: BigNumber;
    minOrderSize: BigNumber;
    maxOrderSize: BigNumber;
    quoteIncrement: BigNumber;
    displayName: string;
    private _endpoint;
    private _wsEndpoint;
    private _trade;
    private _wsClient;
    constructor(params: RadarMarket, apiEndpoint: string, wsEndpoint: string, trade: Trade);
    getBookAsync(): Promise<RadarBook>;
    getFillsAsync(): Promise<RadarFill[]>;
    getCandlesAsync(): Promise<RadarCandle[]>;
    getTickerAsync(): Promise<RadarTicker>;
    /**
     * subscribe to a socket topic for this market
     *
     * @param {string}                 topic  market topic
     * @param {WebsocketRequestTopic}  topic
     */
    subscribe(topic: WebsocketRequestTopic, handleFunc: () => {}): Promise<{}>;
    /**
     * Execute a market order
     *
     * @param {UserOrderType} type   Order type of BUY|SELL
     * @param {BigNumber}     amount Amount in base token
     * @param {Opts}          opts   Optional transaction options
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
    limitOrderAsync(type: UserOrderType, quantity: BigNumber, price: BigNumber, expiration: BigNumber): Promise<Order>;
    /**
     * Cancel an order
     *
     * @param {SignedOrder}  order SignedOrder to cancel
     * @param {Opts}         opts  Optional transaction options
     */
    cancelOrderAsync(order: SignedOrder, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
}
