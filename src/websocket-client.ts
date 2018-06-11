import {RadarSubscribeRequest, RadarUnsubscribeRequest, WebsocketRequestType} from 'radar-types';
import {w3cwebsocket} from 'websocket';

/**
 * Websocket client helper class
 * for websocket connection handling
 */
export class WebsocketClient {

  public connected: boolean;
  private _client: w3cwebsocket;
  private _connectPromise;
  private _subscribePromise;
  private _wsEndpoint: string;
  private _subscriptions: {} = {};
  private _curSubID: number = 0;

  constructor(wsEndpoint: string) {
    this._wsEndpoint = wsEndpoint;
  }

  /**
   * Event listener for global connection events
   */
  public on(event: 'connect' | 'error' | 'disconnect' | 'message', handlerFunction) {
    // TODO
  }

  /**
   * Create a Radar subscription
   *
   * @param {RadarSubscribeRequest}  subscribeRequest
   * @param {function}               subscriptionHandler
   */
  public subscribe(
    subscribeRequest: RadarSubscribeRequest,
    subscriptionHandler: (messsage: any) => void
  ): {
    requestId: number,
    subscriptionHandler: (messsage: any) => void,
    unsubscribe: () => void
  } {
    if (!this._clientIsConnected) throw new Error('WEBSOCKET_DISCONNECTED');
    this._curSubID = this._curSubID + 1;
    subscribeRequest.requestId = this._curSubID;
    this._client.send(JSON.stringify(subscribeRequest));
    this._subscriptions[this._curSubID] = {
      requestId: this._curSubID,
      subscriptionHandler,
      unsubscribe: () => {
        // Send unsubscribe for this subscribe request
        (subscribeRequest as any).type = WebsocketRequestType.UNSUBSCRIBE;
        this._client.send(JSON.stringify(subscribeRequest));
      }
    };

    return this._subscriptions[this._curSubID];
  }

  /**
   * Connect method
   */
  public async connect() {
    return new Promise((resolve, reject) => {
      try {
        this._client = new w3cwebsocket(this._wsEndpoint);
        this._client.onopen = this._connectHandler.bind(this);
        this._client.onerror = this._errorHandler.bind(this);
        this._client.onclose = this._closeHandler.bind(this);
        this._client.onmessage = this._messageHandler.bind(this);
      } catch (err) {
        reject(err);
      }

      this._connectPromise = {
        resolve, reject
      };
    });
  }

  /**
   * Default connection handler
   *
   * @param {Event} conn
   */
  private _connectHandler(conn: Event) {
    this.connected = true;
    if (this._connectPromise) {
      this._connectPromise.resolve(conn);
    }
  }

  /**
   * default close handler
   *
   * @param {CloseEvent} closed
   */
  private _closeHandler(closed: CloseEvent) {
    this.connected = false;
    this._client = undefined;
    this._connectPromise = undefined;
    this._subscriptions = {};
    console.log('closed', closed);
  }

  /**
   * default error handler
   *
   * @param {Event} err
   */
  private _errorHandler(err: Event) {
    this.connected = false;
    if (this._connectPromise) {
      this._client = undefined;
      this._connectPromise.reject(err);
    }
    console.log('err', err);
  }

  /**
   * Handle a message passing it to
   * the active subscription if it exists
   *
   * @param {MessageEvent} message
   */
  private _messageHandler(message: MessageEvent) {

      if (this._subscriptions) {
        if (typeof(message.data) === 'string') {
          let parsed;
          try {
            parsed = JSON.parse(message.data);
            if (parsed.requestId && this._subscriptions[parsed.requestId]) {
              this._subscriptions[parsed.requestId].subscriptionHandler(parsed);
            }
          } catch (err) {
            console.log(err);
          }
       } else {
        console.log(message);
       }
    }
  }

  /**
   * Detect if the WebSocket client is connected
   */
  private _clientIsConnected() {
    return this._client && (this._client.readyState === this._client.OPEN);
  }
}
