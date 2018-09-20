import { Market } from '../Market';
import { BaseAccount } from '../accounts';
import { Trade } from '../Trade';
import { PaginatedCache } from './PaginatedCache';
export declare class MarketsCache<T extends BaseAccount> extends PaginatedCache<Market<T>> {
    private _apiEndpoint;
    private _wsEndpoint;
    private _trade;
    constructor(initialPage: number, perPage: number, apiEndpoint: string, wsEndpoint: string, marketsEndpoint: string, trade: Trade<T>);
    getAsync(marketId: string): Promise<Market<T>>;
    getAsync(marketId: string[]): Promise<Map<string, Market<T>>>;
    protected _transformResponseData<RadarMarket>(market: any): [string, Market<any>];
}
