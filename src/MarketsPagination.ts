// Vendor
import request = require('request-promise');
import { RadarMarket } from '@radarrelay/types';

// Internal
import { BaseAccount } from './accounts/BaseAccount';
import { Market } from './Market';
import { Trade } from './Trade';

export class MarketsPagination<T extends BaseAccount> {

  public page: number;
  public perPage: number;
  public markets: Map<string, Market<T>>;

  private _endpoint: string;
  private _wsEndpoint: string;
  private _trade: Trade<T>;

  constructor(
    initialPage: number,
    perPage: number,
    apiEndpoint: string,
    wsEndpoint: string,
    trade: Trade<T>
  ) {
    this._endpoint = apiEndpoint;
    this._wsEndpoint = wsEndpoint;
    this._trade = trade;
    this.page = initialPage;
    this.perPage = perPage;
    this.markets = new Map();
  }

  public async fetchPage(page: number, count: number) {
    const response: RadarMarket[] = JSON.parse(await request.get(`${this._endpoint}/markets?page=${page}&perPage=${count}`));

    const markets: Map<string, Market<T>> = new Map();
    response.forEach(market => {
      markets.set(market.id, new Market(market, this._endpoint, this._wsEndpoint, this._trade));
    });

    this.markets = new Map([...this.markets, ...markets]);

    return markets;
  }

  public async fetchNextPage() {
    const markets = await this.fetchPage(this.page, this.perPage);
    this.page++;
    return markets;
  }
}
