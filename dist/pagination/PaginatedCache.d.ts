import { AxiosResponse } from 'axios';
declare type MockES6Map<T, K> = Pick<Map<T, K>, Exclude<keyof Map<T, K>, 'get' | 'set'>>;
export declare abstract class PaginatedCache<ValueType> implements Iterable<[string, ValueType]>, MockES6Map<string, ValueType> {
    page: number;
    perPage: number;
    protected _cache: Map<string, ValueType>;
    protected _endpoint: string;
    constructor(initialPage: number, perPage: number, endpoint: string);
    readonly cache: Map<string, ValueType>;
    getPageAsync<T>(page: number, perPage: number): Promise<Map<any, any>>;
    getNextPageAsync(): Promise<Map<any, any>>;
    readonly size: number;
    clear(): void;
    delete(key: string): boolean;
    forEach(callbackfn: (value: ValueType, key: string, map: Map<string, ValueType>) => void, thisArg?: any): void;
    entries(): IterableIterator<[string, ValueType]>;
    values(): IterableIterator<ValueType>;
    has(key: string): boolean;
    keys(): IterableIterator<string>;
    [Symbol.iterator](): IterableIterator<[string, ValueType]>;
    protected _cacheResponseData<T>(response: AxiosResponse<T[]>): Map<any, any>;
    protected abstract _transformResponseData<T>(data: T): [string, ValueType];
}
export {};
