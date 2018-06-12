import { RadarSubscribeRequest } from '@radarrelay/types';
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
     * Event listener for global connection events
     */
    on(event: 'connect' | 'error' | 'disconnect' | 'message', handlerFunction: any): void;
    /**
     * Create a Radar subscription
     *
     * @param {RadarSubscribeRequest}  subscribeRequest
     * @param {function}               subscriptionHandler
     */
    subscribe(subscribeRequest: RadarSubscribeRequest, subscriptionHandler: (messsage: any) => void): {
        requestId: number;
        subscriptionHandler: (messsage: any) => void;
        unsubscribe: () => void;
    };
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
