// Vendor
import {
  SignedOrder,
  RadarBook,
  RadarFill,
  RadarCandle,
  RadarTicker,
  UserOrderType,
  RadarMarket,
  WebsocketRequestTopic,
  WebsocketRequestType,
  RadarStats,
  RadarHistory,
  RadarMarketBase
} from '@radarrelay/types';
import { TransactionReceiptWithDecodedLogs } from 'ethereum-types';
import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';

// Internal
import { Trade } from './Trade';
import { WebsocketClient } from './WebsocketClient';
import { Opts } from './types';
import { ErrorFormatter } from './errors/ErrorFormatter';
import { BaseAccount } from './accounts';

export class Market<T extends BaseAccount> implements RadarMarket, RadarMarketBase {

  public id: string;
  public baseTokenAddress: string;
  public quoteTokenAddress: string;
  public baseTokenDecimals: number;
  public quoteTokenDecimals: number;
  public minOrderSize: BigNumber;
  public maxOrderSize: BigNumber;
  public quoteIncrement: number;
  public displayName: string;
  public score: number;

  private _endpoint: string;
  private _wsEndpoint: string;
  private _trade: Trade<T>;
  private _wsClient: WebsocketClient;

  constructor(market: RadarMarket, apiEndpoint: string, wsEndpoint: string, trade: Trade<T>) {
    // Setup config
    this._endpoint = apiEndpoint;
    this._wsEndpoint = wsEndpoint;
    this._trade = trade;
    this._wsClient = new WebsocketClient(wsEndpoint);

    // Setup RadarMarket properties
    this.id = market.id;
    this.displayName = market.displayName;
    this.baseTokenAddress = market.baseTokenAddress;
    this.quoteTokenAddress = market.quoteTokenAddress;
    this.baseTokenDecimals = Number(market.baseTokenDecimals);
    this.quoteTokenDecimals = Number(market.quoteTokenDecimals);
    this.minOrderSize = new BigNumber(market.minOrderSize);
    this.maxOrderSize = new BigNumber(market.maxOrderSize);
    this.quoteIncrement = Number(market.quoteIncrement);
    this.score = market.score;
  }

  /*
   * Get book for this market
   */
  public async getBookAsync(): Promise<RadarBook> {
    const response: AxiosResponse<RadarBook> = await axios.get(`${this._endpoint}/markets/${this.id}/book`);
    return response.data;
  }

  /*
   * Get fills for this market
   */
  public async getFillsAsync(): Promise<RadarFill[]> {
    const response: AxiosResponse<RadarFill[]> = await axios.get(`${this._endpoint}/markets/${this.id}/fills`);
    return response.data;
  }

  /*
   * Get candles for this market
   */
  public async getCandlesAsync(): Promise<RadarCandle[]> {
    const response: AxiosResponse<RadarCandle[]> = await axios.get(`${this._endpoint}/markets/${this.id}/candles`);
    return response.data;
  }

  /*
   * Get this markets ticker
   */
  public async getTickerAsync(): Promise<RadarTicker> {
    const response: AxiosResponse<RadarTicker> = await axios.get(`${this._endpoint}/markets/${this.id}/ticker`);
    return response.data;
  }

  /*
   * Get this markets stats.
   */
  public async getStatsAsync(): Promise<RadarStats> {
    const response: AxiosResponse<RadarStats> = await axios.get(`${this._endpoint}/markets/${this.id}/stats`);
    return response.data;
  }

  /*
   * Get this markets history.
   */
  public async getHistoryAsync(): Promise<RadarHistory> {
    const response: AxiosResponse<RadarHistory> = await axios.get(`${this._endpoint}/markets/${this.id}/history`);
    return response.data;
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
  ): Promise<SignedOrder> {
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
