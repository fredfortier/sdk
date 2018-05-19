import { SignedOrder, TransactionReceiptWithDecodedLogs, Order } from '0x.js';
import { Trade } from './trade';
import { RadarBook, RadarFill, RadarCandle, RadarTicker, UserOrderType, RadarMarket } from 'radar-types';
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
    private _trade;
    constructor(params: RadarMarket, apiEndpoint: string, trade: Trade);
    getBookAsync(): Promise<RadarBook>;
    getFillsAsync(): Promise<RadarFill[]>;
    getCandlesAsync(): Promise<RadarCandle[]>;
    getTickerAsync(): Promise<RadarTicker>;
    marketOrderAsync(type: UserOrderType, amount: BigNumber, awaitTransactionMined?: boolean): Promise<TransactionReceiptWithDecodedLogs | string>;
    limitOrderAsync(type: UserOrderType, quantity: BigNumber, price: BigNumber, expiration: BigNumber): Promise<Order>;
    cancelOrderAsync(order: SignedOrder, awaitTransactionMined?: boolean): Promise<TransactionReceiptWithDecodedLogs | string>;
}
