export interface LazyMapConfig<KeyType, ValueType> {
    getHandler?: LazyMap<KeyType, ValueType>['_getHandler'];
    setHandler?: LazyMap<KeyType, ValueType>['_setHandler'];
    entries?: ReadonlyArray<[KeyType, ValueType]>;
}
export declare class LazyMap<KeyType, ValueType> implements Iterable<[KeyType, ValueType]> {
    private _data;
    private _getHandler;
    private _setHandler;
    size: Map<KeyType, ValueType>['size'];
    clear: Map<KeyType, ValueType>['clear'];
    delete: Map<KeyType, ValueType>['delete'];
    entries: Map<KeyType, ValueType>['entries'];
    forEach: Map<KeyType, ValueType>['forEach'];
    has: Map<KeyType, ValueType>['has'];
    keys: Map<KeyType, ValueType>['keys'];
    values: Map<KeyType, ValueType>['values'];
    nativeGet: Map<KeyType, ValueType>['get'];
    nativeSet: Map<KeyType, ValueType>['set'];
    constructor(config: LazyMapConfig<KeyType, ValueType>);
    /**
     * Gets the desired entry at `key`. If the entry is not found, the
     * asynchronous `getHandler` callback is executed and the resulting data is
     * cached.
     *
     * @param key The cached entry to retrieve.
     */
    get(key: KeyType): Promise<ValueType>;
    /**
     * Sets the desired entry at `key` and executes the asynchronous `setHandler`
     * callback.
     *
     * @param key The cached entry to retrieve.
     */
    set(key: KeyType, value: ValueType): Promise<this>;
    [Symbol.iterator](): IterableIterator<any>;
}
