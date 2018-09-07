/// <reference types="node" />
import { Market } from './Market';
import { EventEmitter } from 'events';
import { Opts } from './types';
import { Order, SignedOrder } from '0x.js';
import { TransactionReceiptWithDecodedLogs } from 'ethereum-types';
import { ZeroEx } from '../src/ZeroEx';
import { RadarToken, UserOrderType } from '@radarrelay/types';
import BigNumber from 'bignumber.js';
import { TSMap } from 'typescript-map';
import { BaseAccount } from './accounts';
export declare class Trade<T extends BaseAccount> {
    private _endpoint;
    private _account;
    private _zeroEx;
    private _events;
    private _tokens;
    constructor(zeroEx: ZeroEx, apiEndpoint: string, account: T, events: EventEmitter, tokens: TSMap<string, RadarToken>);
    marketOrder(market: Market<T>, type: UserOrderType, quantity: BigNumber, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
    limitOrder(market: Market<T>, type: UserOrderType, // ask == sell, bid == buy
    quantity: BigNumber, // base token quantity
    price: BigNumber, // price (in quote)
    expiration: BigNumber): Promise<Order>;
    cancelOrderAsync(order: SignedOrder, opts?: Opts): Promise<TransactionReceiptWithDecodedLogs | string>;
}
