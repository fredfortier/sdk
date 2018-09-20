import { RadarSubscribeRequest } from '@radarrelay/types';
/**
 * Websocket client helper class
 * for websocket connection handling
 */
export declare class WebsocketClient {
    connected: boolean;
    private _client;
    private _connectPromise;
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
     * @param {RadarSubscribeRequest} subscribeRequest The subscribe request
     * @param {function} subscriptionHandler The subscription handler
     */
    subscribe(subscribeRequest: RadarSubscribeRequest, subscriptionHandler: (messsage: any) => void): {
        requestId: number;
        subscriptionHandler: (messsage: any) => void;
        unsubscribe: () => void;
    };
    /**
     * Open a connection to the Radar Relay WebSocket API
     */
    connect(): Promise<{}>;
    /**
     * Default connection handler
     *
     * @param {Event} conn The open event
     */
    private _connectHandler;
    /**
     * Default close handler
     *
     * @param {CloseEvent} closed The close event
     */
    private _closeHandler;
    /**
     * Default error handler
     *
     * @param {Event} err The error event
     */
    private _errorHandler;
    /**
     * Handle a message passing it to
     * the active subscription if it exists
     *
     * @param {MessageEvent} message The message event
     */
    private _messageHandler;
    /**
     * Detect if the WebSocket client is connected
     */
    private _clientIsConnected;
}
