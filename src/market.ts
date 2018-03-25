import {SignedOrder} from '0x.js';
import {TradeExecuter} from './trade-executer';
import BigNumber from 'bignumber.js';
import request = require('request-promise');

export class Market {
  public id: string;
  public baseTokenAddress: string;
  public quoteTokenAddress: string;
  public baseTokenDecimals: BigNumber;
  public quoteTokenDecimals: BigNumber;
  public baseMinSize: BigNumber;
  public baseMaxSize: BigNumber;
  public quoteIncrement: BigNumber;
  public basedisplayNameMinSize: string;

  private tradeExecuter: TradeExecuter;
  private endpoint: string;

  constructor(params, apiEndpoint: string, tradeExecuter: TradeExecuter) {
      this.endpoint = apiEndpoint;
      this.tradeExecuter = tradeExecuter;
      this.id = params.id;
      this.baseTokenAddress = params.baseTokenAddress;
      this.quoteTokenAddress = params.quoteTokenAddress;
      this.baseTokenDecimals = new BigNumber(params.baseTokenDecimals);
      this.quoteTokenDecimals = new BigNumber(params.quoteTokenDecimals);
      this.baseMinSize = new BigNumber(params.baseMinSize);
      this.baseMaxSize = new BigNumber(params.baseMaxSize);
      this.quoteIncrement = new BigNumber(params.quoteIncrement);
      this.basedisplayNameMinSize = params.basedisplayNameMinSize;
  }

  // getBook
  // TODO managed books?
  public async getBookAsync() {
    return JSON.parse(await request.get(`${this.endpoint}/markets/${this.id}/book`));
  }

  // getFills
  public async getFillsAsync() {
    return JSON.parse(await request.get(`${this.endpoint}/markets/${this.id}/fills`));
  }

  // getCandles
  public async getCandlesAsync() {
    return JSON.parse(await request.get(`${this.endpoint}/markets/${this.id}/candles`));
  }

  // getTicker
  public async getTickerAsync() {
    return JSON.parse(await request.get(`${this.endpoint}/markets/${this.id}/ticker`));
  }

  // marketOrder
  public async marketOrderAsync(type: string, amount: BigNumber) {
    return await this.tradeExecuter.marketOrder(this, type, amount);
  }

  // limitOrder
  public async limitOrderAsync(
    type: string = 'buy',
    baseTokenAmount: BigNumber,
    quoteTokenAmount: BigNumber,
    expiration: BigNumber) {

    return await this.tradeExecuter.limitOrder(this, type, baseTokenAmount, quoteTokenAmount, expiration);
  }

  // cancelOrder
  public async cancelOrderAsync(order: SignedOrder) {
    return await this.tradeExecuter.cancelOrderAsync(order);
  }

}
