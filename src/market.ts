import {SignedOrder} from '0x.js';
import {Trade} from './trade';
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

  constructor(params, apiEndpoint: string, trade: Trade) {
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
  public async getBookAsync() {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/book`));
  }

  // getFills
  public async getFillsAsync() {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/fills`));
  }

  // getCandles
  public async getCandlesAsync() {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/candles`));
  }

  // getTicker
  public async getTickerAsync() {
    return JSON.parse(await request.get(`${this._endpoint}/markets/${this.id}/ticker`));
  }

  // marketOrder
  public async marketOrderAsync(type: string, amount: BigNumber) {
    return await this._trade.marketOrder(this, type, amount);
  }

  // limitOrder
  public async limitOrderAsync(
    type: string = 'buy',
    quantity: BigNumber,
    price: BigNumber,
    expiration: BigNumber) {
    return await this._trade.limitOrder(this, type, quantity, price, expiration);
  }

  // cancelOrder
  public async cancelOrderAsync(order: SignedOrder) {
    return await this._trade.cancelOrderAsync(order);
  }

}
