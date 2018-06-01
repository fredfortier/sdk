import {RadarSubscribeRequest, RadarUnsubscribeRequest} from 'radar-types';
import WebSocket = require('websocket');

/**
 * Websocket client helper class
 * for websocket connection handling
 */
export class WebsocketClient {

  public connected: boolean;
  private _client;
  private _connection;
  private _connectPromise;
  private _subscribePromise;
  private _wsEndpoint: string;
  private _subscriptions: {} = {};
  private _curSubID: number = 0;

  constructor(wsEndpoint: string) {
    // Setup websocket client
    this._wsEndpoint = wsEndpoint;
    this._client = new WebSocket.client();
    this._client.on('connect', this._connectHandler.bind(this));
    this._client.on('connectFailed', this._failedConnectHandler.bind(this));
  }

  /**
   * subscribe method
   */
  public async subscribe(subscribeRequest: RadarSubscribeRequest, subscriptionHandler) {
    if (!this._connection) throw new Error('WEBSOCKET_DISCONNECTED');
    this._curSubID = this._curSubID + 1;
    subscribeRequest.requestId = this._curSubID;
    this._connection.send(JSON.stringify(subscribeRequest));
    this._subscriptions[this._curSubID] = subscriptionHandler;
  }

  /**
   * Unsubscribe method
   * TODO handle subscription request ids
   *
   * @param {RadarUnsubscribeRequest}  unsubscribeRequest
   */
  public async unsubscribe(unsubscribeRequest: RadarUnsubscribeRequest) {
    if (!this._connection) return true;
    this._connection.send(JSON.stringify(unsubscribeRequest));
  }

  /**
   * Connect method
   */
  public async connect() {
    return new Promise((resolve, reject) => {
      this._client.connect(this._wsEndpoint);
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
  private _connectHandler(conn) {
    this._connection = conn;
    this._connection.on('close', this._closeHandler.bind(this));
    this._connection.on('error', this._errorHandler.bind(this));
    this._connection.on('message', this._messageHandler.bind(this));
    this.connected = true;
    if (this._connectPromise) {
      this._connectPromise.resolve(conn);
    }
  }

  /**
   * Default failed conn handler
   *
   * @param {string} err
   */
  private _failedConnectHandler(err) {
    this.connected = false;
    if (this._connectPromise) {
      this._connectPromise.reject(err);
    }
  }

  /**
   * default close handler
   *
   * @param {string} closed
   */
  private _closeHandler(closed) {
    this.connected = false;
    this._connectPromise = undefined;
    this._subscriptions = {};
    console.log('closed', closed);
  }

  /**
   * default error handler
   *
   * @param {string} err
   */
  private _errorHandler(err) {
    this.connected = false;
    console.log('err', err);
  }

  /**
   * Handle a message passing it to
   * the active subscription if it exists
   *
   * @param {string} message
   */
  private _messageHandler(message) {
      // TODO multiple subscriptions
      if (this._subscriptions) {
        if (message.type === 'utf8') {
          let parsed;
          try {
            parsed = JSON.parse(message.utf8Data);
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

}
