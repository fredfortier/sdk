import { RadarSubscribeRequest, RadarUnsubscribeRequest } from 'radar-types';
/**
 * Websocket client helper class
 * for websocket connection handling
 */
export declare class WebsocketClient {
    connected: boolean;
    private _client;
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
     * @param {Event} conn
     */
    private _connectHandler;
    /**
     * default close handler
     *
     * @param {CloseEvent} closed
     */
    private _closeHandler;
    /**
     * default error handler
     *
     * @param {Event} err
     */
    private _errorHandler;
    /**
     * Handle a message passing it to
     * the active subscription if it exists
     *
     * @param {MessageEvent} message
     */
    private _messageHandler;
    /**
     * Detect if the WebSocket client is connected
     */
    private _clientIsConnected;
}
