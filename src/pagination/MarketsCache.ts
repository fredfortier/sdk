// Vendor
import { RadarMarket } from '@radarrelay/types';
import axios, { AxiosResponse } from 'axios';

// Internal
import { Market } from '../Market';
import { BaseAccount } from '../accounts';
import { Trade } from '../Trade';
import { PaginatedCache } from './PaginatedCache';

export class MarketsCache<T extends BaseAccount> extends PaginatedCache<Market<T>> {

  // --- Properties --- //

  private _apiEndpoint: string;
  private _wsEndpoint: string;
  private _trade: Trade<T>;

  // --- Constructor --- //

  constructor(
    initialPage: number,
    perPage: number,
    apiEndpoint: string,
    wsEndpoint: string,
    marketsEndpoint: string,
    trade: Trade<T>
  ) {
    super(initialPage, perPage, marketsEndpoint);

    this._apiEndpoint = apiEndpoint;
    this._wsEndpoint = wsEndpoint;
    this._trade = trade;
  }

  // --- Exposed methods --- //

  public async getAsync(marketId: string): Promise<Market<T>>;
  public async getAsync(marketId: string[]): Promise<Map<string, Market<T>>>;
  public async getAsync<K extends string | string[]>(marketId: K): Promise<Market<T> | Map<string, Market<T>>> {
    let response;

    if (!Array.isArray(marketId)) {

      if (this._cache.has(marketId as string)) return this._cache.get(marketId as string);
      response = await axios.get(`${this._endpoint}/${marketId}`);
      return this._cacheResponseData<RadarMarket>(response as AxiosResponse<RadarMarket>).get(marketId as string);

    } else {

      // TODO: retrieve from cache if a market is already fetched.
      response = await axios.get(this._endpoint, {
        params: { ids: (marketId as string[]).join(',') },
      });

      return this._cacheResponseData<RadarMarket[]>(response as AxiosResponse<RadarMarket[]>);

    }
  }

  // --- Abstract method implementation --- //

  protected _transformResponseData<RadarMarket>(market): [string, Market<any>] {
    return [market.id, new Market(market, this._apiEndpoint, this._wsEndpoint, this._trade)];
  }
}
