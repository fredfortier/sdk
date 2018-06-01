"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("websocket");
/**
 * Websocket client helper class
 * for websocket connection handling
 */
var WebsocketClient = /** @class */ (function () {
    function WebsocketClient(wsEndpoint) {
        this._subscriptions = {};
        this._curSubID = 0;
        // Setup websocket client
        this._wsEndpoint = wsEndpoint;
        this._client = new WebSocket.client();
        this._client.on('connect', this._connectHandler.bind(this));
        this._client.on('connectFailed', this._failedConnectHandler.bind(this));
    }
    /**
     * subscribe method
     */
    WebsocketClient.prototype.subscribe = function (subscribeRequest, subscriptionHandler) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this._connection)
                    throw new Error('WEBSOCKET_DISCONNECTED');
                this._curSubID = this._curSubID + 1;
                subscribeRequest.requestId = this._curSubID;
                this._connection.send(JSON.stringify(subscribeRequest));
                this._subscriptions[this._curSubID] = subscriptionHandler;
                return [2 /*return*/];
            });
        });
    };
    /**
     * Unsubscribe method
     * TODO handle subscription request ids
     *
     * @param {RadarUnsubscribeRequest}  unsubscribeRequest
     */
    WebsocketClient.prototype.unsubscribe = function (unsubscribeRequest) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this._connection)
                    return [2 /*return*/, true];
                this._connection.send(JSON.stringify(unsubscribeRequest));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Connect method
     */
    WebsocketClient.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._client.connect(_this._wsEndpoint);
                        _this._connectPromise = {
                            resolve: resolve, reject: reject
                        };
                    })];
            });
        });
    };
    /**
     * Default connection handler
     *
     * @param {any} conn
     */
    WebsocketClient.prototype._connectHandler = function (conn) {
        this._connection = conn;
        this._connection.on('close', this._closeHandler.bind(this));
        this._connection.on('error', this._errorHandler.bind(this));
        this._connection.on('message', this._messageHandler.bind(this));
        this.connected = true;
        if (this._connectPromise) {
            this._connectPromise.resolve(conn);
        }
    };
    /**
     * Default failed conn handler
     *
     * @param {string} err
     */
    WebsocketClient.prototype._failedConnectHandler = function (err) {
        this.connected = false;
        if (this._connectPromise) {
            this._connectPromise.reject(err);
        }
    };
    /**
     * default close handler
     *
     * @param {string} closed
     */
    WebsocketClient.prototype._closeHandler = function (closed) {
        this.connected = false;
        this._connectPromise = undefined;
        this._subscriptions = {};
        console.log('closed', closed);
    };
    /**
     * default error handler
     *
     * @param {string} err
     */
    WebsocketClient.prototype._errorHandler = function (err) {
        this.connected = false;
        console.log('err', err);
    };
    /**
     * Handle a message passing it to
     * the active subscription if it exists
     *
     * @param {string} message
     */
    WebsocketClient.prototype._messageHandler = function (message) {
        // TODO multiple subscriptions
        if (this._subscriptions) {
            if (message.type === 'utf8') {
                var parsed = void 0;
                try {
                    parsed = JSON.parse(message.utf8Data);
                    if (parsed.requestId && this._subscriptions[parsed.requestId]) {
                        this._subscriptions[parsed.requestId](parsed);
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                console.log(message);
            }
        }
    };
    return WebsocketClient;
}());
exports.WebsocketClient = WebsocketClient;
