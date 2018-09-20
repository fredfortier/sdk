// Vendor
import axios, { AxiosResponse } from 'axios';

type MockES6Map<T, K> = Pick<
  Map<T, K>,
  Exclude<keyof Map<T, K>, 'get' | 'set'>
>;

export abstract class PaginatedCache<ValueType>
implements
  Iterable<[string, ValueType]>,
  MockES6Map<string, ValueType> {

  // --- Properties --- //

  public page: number;
  public perPage: number;

  protected _cache: Map<string, ValueType>;
  protected _endpoint: string;

  // --- Constructor --- //

  constructor(
    initialPage: number,
    perPage: number,
    endpoint: string,
  ) {
    this._endpoint = endpoint;
    this.page = initialPage;
    this.perPage = perPage;
  }

  // --- Getters/setters --- //

  public get cache() {
    return new Map(this._cache);
  }

  // --- Exposed methods --- //

  public async getPageAsync<T>(page: number, perPage: number) {
    const response = await axios.get<T[]>(this._endpoint, {
      params: {
        page,
        perPage,
      }
    });

    return this._cacheResponseData<T>(response);
  }

  public async getNextPageAsync() {
    const data = await this.getPageAsync(this.page, this.perPage);
    this.page++;
    return data;
  }

  // --- Mock relevant ES6 Map properties/methods--- //

  public get size() {
    return this._cache.size;
  }

  public clear() {
    return this._cache.clear();
  }

  public delete(key: string) {
    return this._cache.delete(key);
  }

  public forEach(
    callbackfn: (value: ValueType, key: string, map: Map<string, ValueType>) => void,
    thisArg?: any
  ) {
    return this._cache.forEach(callbackfn, thisArg);
  }

  public entries() {
    return this._cache.entries();
  }

  public values() {
    return this._cache.values();
  }

  public has(key: string) {
    return this._cache.has(key);
  }

  public keys() {
    return this._cache.keys();
  }

  public [Symbol.iterator]() {
    return this._cache.entries();
  }

  // --- Internal protected methods --- //

  protected _cacheResponseData<T>(response: AxiosResponse<T[]>) {
    const data = new Map();

    response.data.forEach(item => {
      const transformedData = this._transformResponseData(item);
      data.set(transformedData[0], transformedData[1]);
      this._cache.set(transformedData[0], transformedData[1]);
    });

    return data;
  }

  // --- Declare abstract methods --- //

  protected abstract _transformResponseData<T>(data: T): [string, ValueType];

}
