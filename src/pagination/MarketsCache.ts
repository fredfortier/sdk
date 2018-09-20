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

  private _wsEndpoint: string;
  private _trade: Trade<T>;

  // --- Constructor --- //

  constructor(
    initialPage: number,
    perPage: number,
    apiEndpoint: string,
    wsEndpoint: string,
    trade: Trade<T>
  ) {
    super(initialPage, perPage, apiEndpoint);

    this._endpoint = apiEndpoint;
    this._wsEndpoint = wsEndpoint;
    this._trade = trade;
  }

  // --- Exposed methods --- //

  public async getAsync(marketId: string, ...additionalMarketIds: string[]) {
    let response: AxiosResponse<RadarMarket[]>;

    if (!additionalMarketIds) {
      response = await axios.get(`${this._endpoint}/${marketId}`);
    } else {
      const ids = [marketId, ...additionalMarketIds].join(',');
      response = await axios.get(this._endpoint, {
        params: { ids },
      });
    }

    return this._cacheResponseData<RadarMarket>(response);
  }

  // --- Abstract method implementation --- //

  protected _transformResponseData<RadarMarket>(market): [string, Market<any>] {
    return [market.id, new Market(market, this._endpoint, this._wsEndpoint, this._trade)];
  }
}
