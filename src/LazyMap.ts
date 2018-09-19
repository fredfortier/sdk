export interface LazyMapConfig<KeyType, ValueType> {
  getHandler?: LazyMap<KeyType, ValueType>['_getHandler'];
  setHandler?: LazyMap<KeyType, ValueType>['_setHandler'];
  entries?: ReadonlyArray<[KeyType, ValueType]>;
}

export class LazyMap<KeyType, ValueType> implements Iterable<[KeyType, ValueType]> {

  // --- Properties --- //

  private _data: Map<KeyType, ValueType>; // Internal ES6 Map object
  private _getHandler: ({ key }: { key: KeyType }) => Promise<ValueType>;
  private _setHandler: ({ key, value }: { key: KeyType, value: ValueType }) => Promise<void>;

  // Mock public ES6 Map methods
  public size: Map<KeyType, ValueType>['size'];
  public clear: Map<KeyType, ValueType>['clear'];
  public delete: Map<KeyType, ValueType>['delete'];
  public entries: Map<KeyType, ValueType>['entries'];
  public forEach: Map<KeyType, ValueType>['forEach'];
  public has: Map<KeyType, ValueType>['has'];
  public keys: Map<KeyType, ValueType>['keys'];
  public values: Map<KeyType, ValueType>['values'];
  public nativeGet: Map<KeyType, ValueType>['get'];
  public nativeSet: Map<KeyType, ValueType>['set'];

  constructor(config: LazyMapConfig<KeyType, ValueType>) {
    this._data = new Map();

    // Mock native ES6 Map `get` and `set` methods.
    this.nativeGet = this._data.get;
    this.nativeSet = this._data.set;

    this._getHandler = config.getHandler || (async ({ key }) => this.nativeGet(key));
    this._setHandler = config.setHandler || (async ({ key, value }) => { this.nativeSet(key, value); });

    const proxyHandler: ProxyHandler<this> = {
      get: (target, prop) => {
        if (!target[prop]) {

          // If the prop is being accessed, return the properly bound ES6 Map method.
          if (
            prop === Symbol.iterator ||
            typeof this._data[prop] === 'function'
          ) return this._data[prop].bind(this._data);

          // Else, simply return the Map property.
          return this._data[prop];

        }
        return Reflect.get(target, prop);
      }
    };

    const proxy = new Proxy(this, proxyHandler);

    // Add initial entries
    if (config.entries) {
      for (const [key, value] of config.entries) {
        proxy.set(key as any, value);
      }
    }

    return proxy;
  }

  /**
   * Gets the desired entry at `key`. If the entry is not found, the
   * asynchronous `getHandler` callback is executed and the resulting data is
   * cached.
   *
   * @param key The cached entry to retrieve.
   */
  public async get(key: KeyType) {
    if (!this._data.has(key)) {
      const data = await this._getHandler({ key });
      this._data.set(key, data);
    }
    return this._data.get(key);
  }

  /**
   * Sets the desired entry at `key` and executes the asynchronous `setHandler`
   * callback.
   *
   * @param key The cached entry to retrieve.
   */
  public async set(key: KeyType, value: ValueType) {
    await this._setHandler({ key, value });
    this._data.set(key, value);
    return this;
  }

  // Mock ES6 iterable
  public *[Symbol.iterator]() { return; }
}
