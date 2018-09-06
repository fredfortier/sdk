import { SignedOrder, Order } from '0x.js';
import { Trade } from './Trade';
import { WebsocketClient } from './WebsocketClient';
import { Opts } from './types';
import {
  RadarBook,
  RadarFill,
  RadarCandle,
  RadarTicker,
  UserOrderType,
  RadarMarket,
  WebsocketRequestTopic,
  WebsocketRequestType
} from '@radarrelay/types';
import { TransactionReceiptWithDecodedLogs } from 'ethereum-types';
import { ErrorFormatter } from './errors/ErrorFormatter';
import BigNumber from 'bignumber.js';
import request = require('request-promise');
import { BaseAccount } from './accounts';

export class Market<T extends BaseAccount> {
  public id: string;
  public baseTokenAddress: string;
  public quoteTokenAddress: string;
  public baseTokenDecimals: BigNumber;
  public quoteTokenDecimals: BigNumber;
  public minOrderSize: BigNumber;
  public maxOrderSize: BigNumber;
  public quoteIncrement: BigNumber;
  public displayName: string;

  private _endpoint: string;
  private _wsEndpoint: string;
  private _trade: Trade<T>;
  private _wsClient: WebsocketClient;

  constructor(params: RadarMarket, apiEndpoint: string, wsEndpoint: string, trade: Trade<T>) {
    // setup config
    this._endpoint = apiEndpoint;
    this._wsEndpoint = wsEndpoint;
    this._trade = trade;
    this._wsClient = new WebsocketClient(wsEndpoint);

    // Setup instance vars
    this.id = params.id;
    this.baseTokenAddress = params.baseTokenAddress;
    this.quoteTokenAddress = params.quoteTokenAddress;
    this.baseTokenDecimals = new BigNumber(params.baseTokenDecimals);
    this.quoteTokenDecimals = new BigNumber(params.quoteTokenDecimals);
    this.minOrderSize = new BigNumber(params.minOrderSize);
    this.maxOrderSize = new BigNumber(params.maxOrderSize);
    this.quoteIncrement = new BigNumber(params.quoteIncrement);
    this.displayName = params.displayName;
  }

  /*
   * Get book for this market
   */
  public async getBookAsync(): Promise<RadarBook> {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/book`));
  }

  /*
   * Get fills for this market
   */
  public async getFillsAsync(): Promise<RadarFill[]> {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/fills`));
  }

  /*
   * Get candles for this market
   */
  public async getCandlesAsync(): Promise<RadarCandle[]> {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/candles`));
  }

  /*
   * Get this markets ticker
   */
  public async getTickerAsync(): Promise<RadarTicker> {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/ticker`));
  }

  /**
   * subscribe to a socket topic for this market
   *
   * @param {WebsocketRequestTopic}  topic  The market topic
   * @param {(message: any) => void}  handlerFunc The subscription handler
   */
  public async subscribeAsync(
    topic: WebsocketRequestTopic,
    handlerFunc: (message: any) => void
  ): Promise<{
    requestId: number,
    subscriptionHandler: (message: any) => void,
    unsubscribe: () => void
  }> {
    if (!this._wsClient.connected) {
      await this._wsClient.connect();
    }
    return this._wsClient.subscribe({
       type: WebsocketRequestType.SUBSCRIBE,
       topic,
       market: this.id
     }, handlerFunc);
  }

  /**
   * Execute a market order
   *
   * @param {UserOrderType} type   Order type of BUY|SELL
   * @param {BigNumber}     amount Amount in base token
   * @param {Opts}          [opts]   Optional transaction options
   */
  public async marketOrderAsync(
    type: UserOrderType,
    amount: BigNumber,
    opts?: Opts
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    try {
      return await this._trade.marketOrder(this, type, amount, opts);
    } catch (err) {
      ErrorFormatter.formatRadarError(err);
    }
  }

  /**
   * Place a limit order
   *
   * @param {UserOrderType} type       Order type of BUY|SELL
   * @param {BigNumber}     quantity   Amount in base token
   * @param {BigNumber}     price      Price in quote
   * @param {BigNumber}     expiration Order expiration time in seconds
   */
  public async limitOrderAsync(
    type: UserOrderType,
    quantity: BigNumber,
    price: BigNumber,
    expiration: BigNumber
  ): Promise<Order> {
    try {
      return await this._trade.limitOrder(this, type, quantity, price, expiration);
    } catch (err) {
      ErrorFormatter.formatRadarError(err);
    }
  }

  /**
   * Cancel an order
   *
   * @param {SignedOrder}  order SignedOrder to cancel
   * @param {Opts}         [opts]  Optional transaction options
   */
  public async cancelOrderAsync(
    order: SignedOrder,
    opts?: Opts
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    try {
      return await this._trade.cancelOrderAsync(order, opts);
    } catch (err) {
      ErrorFormatter.formatRadarError(err);
    }
  }

}
