import { Market } from '../Market';
import { BaseAccount } from '../accounts';
import { Trade } from '../Trade';
import { PaginatedCache } from './PaginatedCache';
export declare class MarketsCache<T extends BaseAccount> extends PaginatedCache<Market<T>> {
    private _wsEndpoint;
    private _trade;
    constructor(initialPage: number, perPage: number, apiEndpoint: string, wsEndpoint: string, trade: Trade<T>);
    getAsync(marketId: string, ...additionalMarketIds: string[]): Promise<Map<any, any>>;
    protected _transformResponseData<RadarMarket>(market: any): [string, Market<any>];
}
