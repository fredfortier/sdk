/// <reference types="node" />
import { Market } from './market';
import { Account } from './account';
import { EventEmitter } from 'events';
import { ZeroEx, Order, SignedOrder, TransactionReceiptWithDecodedLogs } from '0x.js';
import { RadarToken, UserOrderType } from 'radar-types';
import BigNumber from 'bignumber.js';
export declare class Trade {
    private _endpoint;
    private _account;
    private _zeroEx;
    private _events;
    private _tokens;
    constructor(zeroEx: ZeroEx, apiEndpoint: string, account: Account, events: EventEmitter, tokens: Map<string, RadarToken>);
    marketOrder(market: Market, type: UserOrderType, quantity: BigNumber, awaitTransactionMined?: boolean): Promise<TransactionReceiptWithDecodedLogs | string>;
    limitOrder(market: Market, type: UserOrderType, quantity: BigNumber, price: BigNumber, expiration: BigNumber): Promise<Order>;
    cancelOrderAsync(order: SignedOrder, awaitTransactionMined?: boolean): Promise<TransactionReceiptWithDecodedLogs | string>;
}
