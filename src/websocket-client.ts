import {RadarSubscribeRequest, RadarUnsubscribeRequest} from 'radar-types';
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
   * subscribe method
   */
  public async subscribe(subscribeRequest: RadarSubscribeRequest, subscriptionHandler) {
    if (!this._clientIsConnected) throw new Error('WEBSOCKET_DISCONNECTED');
    this._curSubID = this._curSubID + 1;
    subscribeRequest.requestId = this._curSubID;
    this._client.send(JSON.stringify(subscribeRequest));
    this._subscriptions[this._curSubID] = subscriptionHandler;
  }

  /**
   * Unsubscribe method
   * TODO handle subscription request ids
   *
   * @param {RadarUnsubscribeRequest}  unsubscribeRequest
   */
  public async unsubscribe(unsubscribeRequest: RadarUnsubscribeRequest) {
    if (!this._clientIsConnected) return true;
    this._client.send(JSON.stringify(unsubscribeRequest));
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
   * @param {any} conn
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
   * @param {string} closed
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
   * @param {string} err
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
      // TODO multiple subscriptions
      if (this._subscriptions) {
        if (message.data === 'string') {
          let parsed;
          try {
            parsed = JSON.parse(message.data);
            if (parsed.requestId && this._subscriptions[parsed.requestId]) {
              this._subscriptions[parsed.requestId](parsed);
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
