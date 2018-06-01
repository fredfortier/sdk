import { RadarSubscribeRequest, RadarUnsubscribeRequest } from 'radar-types';
/**
 * Websocket client helper class
 * for websocket connection handling
 */
export declare class WebsocketClient {
    connected: boolean;
    private _client;
    private _connection;
    private _connectPromise;
    private _subscribePromise;
    private _wsEndpoint;
    private _subscriptions;
    private _curSubID;
    constructor(wsEndpoint: string);
    /**
     * subscribe method
     */
    subscribe(subscribeRequest: RadarSubscribeRequest, subscriptionHandler: any): Promise<void>;
    /**
     * Unsubscribe method
     * TODO handle subscription request ids
     *
     * @param {RadarUnsubscribeRequest}  unsubscribeRequest
     */
    unsubscribe(unsubscribeRequest: RadarUnsubscribeRequest): Promise<boolean>;
    /**
     * Connect method
     */
    connect(): Promise<{}>;
    /**
     * Default connection handler
     *
     * @param {any} conn
     */
    private _connectHandler;
    /**
     * Default failed conn handler
     *
     * @param {string} err
     */
    private _failedConnectHandler;
    /**
     * default close handler
     *
     * @param {string} closed
     */
    private _closeHandler;
    /**
     * default error handler
     *
     * @param {string} err
     */
    private _errorHandler;
    /**
     * Handle a message passing it to
     * the active subscription if it exists
     *
     * @param {string} message
     */
    private _messageHandler;
}
