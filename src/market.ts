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

  constructor(params, tradeExecuter: TradeExecuter) {
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

  // getFills

  // getCandles

  // getTicker

  // marketOrder

  // limitOrder

}
