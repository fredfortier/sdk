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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
// Vendor
var types_1 = require("@radarrelay/types");
var bignumber_js_1 = require("bignumber.js");
var axios_1 = require("axios");
var WebsocketClient_1 = require("./WebsocketClient");
var ErrorFormatter_1 = require("./errors/ErrorFormatter");
var Market = /** @class */ (function () {
    // --- Constructor --- //
    function Market(market, apiEndpoint, wsEndpoint, trade) {
        // Setup config
        this._endpoint = apiEndpoint;
        this._wsEndpoint = wsEndpoint;
        this._trade = trade;
        this._wsClient = new WebsocketClient_1.WebsocketClient(wsEndpoint);
        // Setup RadarMarket properties
        this.id = market.id;
        this.displayName = market.displayName;
        this.baseTokenAddress = market.baseTokenAddress;
        this.quoteTokenAddress = market.quoteTokenAddress;
        this.baseTokenDecimals = Number(market.baseTokenDecimals);
        this.quoteTokenDecimals = Number(market.quoteTokenDecimals);
        this.minOrderSize = new bignumber_js_1.default(market.minOrderSize);
        this.maxOrderSize = new bignumber_js_1.default(market.maxOrderSize);
        this.quoteIncrement = Number(market.quoteIncrement);
        this.score = market.score;
    }
    // --- Exposed methods --- //
    /*
     * Get book for this market
     */
    Market.prototype.getBookAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this._endpoint + "/markets/" + this.id + "/book")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /*
     * Get fills for this market
     */
    Market.prototype.getFillsAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this._endpoint + "/markets/" + this.id + "/fills")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /*
     * Get candles for this market
     */
    Market.prototype.getCandlesAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this._endpoint + "/markets/" + this.id + "/candles")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /*
     * Get this markets ticker
     */
    Market.prototype.getTickerAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this._endpoint + "/markets/" + this.id + "/ticker")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /*
     * Get this markets stats.
     */
    Market.prototype.getStatsAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this._endpoint + "/markets/" + this.id + "/stats")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /*
     * Get this markets history.
     */
    Market.prototype.getHistoryAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this._endpoint + "/markets/" + this.id + "/history")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * subscribe to a socket topic for this market
     *
     * @param {WebsocketRequestTopic}  topic  The market topic
     * @param {(message: any) => void}  handlerFunc The subscription handler
     */
    Market.prototype.subscribeAsync = function (topic, handlerFunc) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._wsClient.connected) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._wsClient.connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this._wsClient.subscribe({
                            type: types_1.WebsocketRequestType.SUBSCRIBE,
                            topic: topic,
                            market: this.id
                        }, handlerFunc)];
                }
            });
        });
    };
    /**
     * Execute a market order
     *
     * @param {UserOrderType} type   Order type of BUY|SELL
     * @param {BigNumber}     amount Amount in base token
     * @param {Opts}          [opts]   Optional transaction options
     */
    Market.prototype.marketOrderAsync = function (type, amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._trade.marketOrder(this, type, amount, opts)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        ErrorFormatter_1.ErrorFormatter.formatRadarError(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Place a limit order
     *
     * @param {UserOrderType} type       Order type of BUY|SELL
     * @param {BigNumber}     quantity   Amount in base token
     * @param {BigNumber}     price      Price in quote
     * @param {BigNumber}     expiration Order expiration time in seconds
     */
    Market.prototype.limitOrderAsync = function (type, quantity, price, expiration) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._trade.limitOrder(this, type, quantity, price, expiration)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        ErrorFormatter_1.ErrorFormatter.formatRadarError(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cancel an order
     *
     * @param {SignedOrder}  order SignedOrder to cancel
     * @param {Opts}         [opts]  Optional transaction options
     */
    Market.prototype.cancelOrderAsync = function (order, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._trade.cancelOrderAsync(order, opts)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_3 = _a.sent();
                        ErrorFormatter_1.ErrorFormatter.formatRadarError(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Market;
}());
exports.Market = Market;
