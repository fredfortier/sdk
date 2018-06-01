import {SignedOrder, TransactionReceiptWithDecodedLogs, Order} from '0x.js';
import {Trade} from './trade';
import {RadarBook, RadarFill, RadarSignedOrder, RadarCandle,
  RadarTicker, UserOrderType, RadarMarket} from 'radar-types';
import BigNumber from 'bignumber.js';
import request = require('request-promise');

export class Market {
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
  private _trade: Trade;

  constructor(params: RadarMarket, apiEndpoint: string, trade: Trade) {
      this._endpoint = apiEndpoint;
      this._trade = trade;

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

  // getBook
  // TODO managed books?
  public async getBookAsync(): Promise<RadarBook> {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/book`));
  }

  // getFills
  public async getFillsAsync(): Promise<RadarFill[]> {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/fills`));
  }

  // getCandles
  public async getCandlesAsync(): Promise<RadarCandle[]> {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/candles`));
  }

  // getTicker
  public async getTickerAsync(): Promise<RadarTicker> {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/ticker`));
  }

  // TODO subscribe to ws

  // marketOrder
  public async marketOrderAsync(
    type: UserOrderType,
    amount: BigNumber,
    awaitTransactionMined: boolean = false
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    return await this._trade.marketOrder(this, type, amount, awaitTransactionMined);
  }

  // limitOrder
  public async limitOrderAsync(
    type: UserOrderType,
    quantity: BigNumber,
    price: BigNumber,
    expiration: BigNumber
  ): Promise<Order> {
    return await this._trade.limitOrder(this, type, quantity, price, expiration);
  }

  // cancelOrder
  public async cancelOrderAsync(
    order: SignedOrder,
    awaitTransactionMined: boolean = false
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    return await this._trade.cancelOrderAsync(order, awaitTransactionMined);
  }

}
