/// <reference types="node" />
import { Market } from './market';
import { Account } from './account';
import { EventEmitter } from 'events';
import { Opts } from './types';
import { ZeroEx, Order, SignedOrder, TransactionReceiptWithDecodedLogs } from '0x.js';
import { RadarToken, UserOrderType } from 'radar-types';
import BigNumber from 'bignumber.js';
import { TSMap } from 'typescript-map';
export declare class Trade {
    private _endpoint;
    private _account;
    private _zeroEx;
    private _events;
    private _tokens;
    constructor(zeroEx: ZeroEx, apiEndpoint: string, account: Account, events: EventEmitter, tokens: TSMap<string, RadarToken>);
    marketOrder(market: Market, type: UserOrderType, quantity: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    limitOrder(market: Market, type: UserOrderType, // ask == sell, bid == buy
    quantity: BigNumber, // base token quantity
    price: BigNumber, // price (in quote)
    expiration: BigNumber): Promise<Order>;
    cancelOrderAsync(order: SignedOrder, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
}
