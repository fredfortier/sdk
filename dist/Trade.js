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
var _0x_js_1 = require("0x.js");
var types_1 = require("@radarrelay/types");
var bignumber_js_1 = require("bignumber.js");
var axios_1 = require("axios");
var types_2 = require("./types");
var ZeroEx_1 = require("./ZeroEx");
var Trade = /** @class */ (function () {
    // --- Constructor --- //
    function Trade(zeroEx, apiEndpoint, account, events) {
        this._zeroEx = zeroEx;
        this._endpoint = apiEndpoint;
        this._account = account;
        this._events = events;
    }
    // --- Exposed methods --- //
    Trade.prototype.marketOrder = function (market, type, quantity, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var axiosResponse, marketResponse, txHash, fn, receipt;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!opts) {
                            opts = {};
                        }
                        return [4 /*yield*/, axios_1.default.post(this._endpoint + "/markets/" + market.id + "/order/market", {
                                type: type,
                                quantity: quantity.toString(),
                            })];
                    case 1:
                        axiosResponse = _a.sent();
                        marketResponse = axiosResponse.data;
                        marketResponse.orders.forEach(function (order, i) { return _this.hydrateSignedOrder(order); });
                        if (!(marketResponse.orders.length === 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._zeroEx.exchange.fillOrderAsync(marketResponse.orders[0], ZeroEx_1.ZeroEx.toBaseUnitAmount(quantity, market.baseTokenDecimals), this._account.address, opts.transactionOpts)];
                    case 2:
                        // Save gas by executing a fill order if only one order was returned
                        txHash = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        fn = type === types_1.UserOrderType.BUY ? 'marketBuyOrdersAsync' : 'marketSellOrdersAsync';
                        return [4 /*yield*/, this._zeroEx.exchange[fn](marketResponse.orders, ZeroEx_1.ZeroEx.toBaseUnitAmount(quantity, market.baseTokenDecimals), this._account.address, opts.transactionOpts)];
                    case 4:
                        txHash = _a.sent();
                        _a.label = 5;
                    case 5:
                        this._events.emit(types_2.EventName.TransactionPending, txHash);
                        if (!opts.awaitTransactionMined) {
                            return [2 /*return*/, txHash];
                        }
                        return [4 /*yield*/, this._zeroEx.awaitTransactionMinedAsync(txHash)];
                    case 6:
                        receipt = _a.sent();
                        this._events.emit(types_2.EventName.TransactionComplete, receipt);
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    // sign and post order to book
    Trade.prototype.limitOrder = function (market, type, // ask == sell, bid == buy
    quantity, // base token quantity
    price, // price (in quote)
    expiration // expiration in seconds from now
    ) {
        if (market === void 0) { market = null; }
        return __awaiter(this, void 0, void 0, function () {
            var axiosResponse, order, prefix, orderHash, signature, orderPostURL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post(this._endpoint + "/markets/" + market.id + "/order/limit", {
                            type: type,
                            quantity: quantity.toString(),
                            price: price.toString(),
                            expiration: expiration.toString(),
                        })];
                    case 1:
                        axiosResponse = _a.sent();
                        order = axiosResponse.data;
                        // Transform BigNumbers
                        this.hydrateSignedOrder(order);
                        // Add missing data
                        order.makerAddress = this._account.address;
                        prefix = (this._account.type === types_2.WalletType.Injected) ? _0x_js_1.SignerType.Metamask : _0x_js_1.SignerType.Default;
                        orderHash = ZeroEx_1.ZeroEx.getOrderHashHex(order);
                        return [4 /*yield*/, this._zeroEx.ecSignOrderHashAsync(orderHash, this._account.address, prefix)];
                    case 2:
                        signature = _a.sent();
                        order.signature = signature;
                        orderPostURL = process.env.RADAR_SDK_ORDER_URL
                            ? process.env.RADAR_SDK_ORDER_URL
                            : this._endpoint + "/orders";
                        return [4 /*yield*/, axios_1.default.post(orderPostURL, order)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, order];
                }
            });
        });
    };
    // TODO fill individual order
    // cancel a signed order
    // TODO cancel partial?
    Trade.prototype.cancelOrderAsync = function (order, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var txHash, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!opts) {
                            opts = {};
                        }
                        return [4 /*yield*/, this._zeroEx.exchange.cancelOrderAsync(order, opts.transactionOpts)];
                    case 1:
                        txHash = _a.sent();
                        this._events.emit(types_2.EventName.TransactionPending, txHash);
                        if (!opts.awaitTransactionMined) {
                            return [2 /*return*/, txHash];
                        }
                        return [4 /*yield*/, this._zeroEx.awaitTransactionMinedAsync(txHash)];
                    case 2:
                        receipt = _a.sent();
                        this._events.emit(types_2.EventName.TransactionComplete, receipt);
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    /**
     * Transform all BigNumber fields from string (request) to BigNumber. This is needed for a
     * correct hashing and signature.
     * @param order a signedOrder from DB or user input, that have strings instead of BigNumbers
     */
    Trade.prototype.hydrateSignedOrder = function (order) {
        order.salt = new bignumber_js_1.default(order.salt);
        order.makerFee = new bignumber_js_1.default(order.makerFee);
        order.takerFee = new bignumber_js_1.default(order.takerFee);
        order.makerAssetAmount = new bignumber_js_1.default(order.makerAssetAmount);
        order.takerAssetAmount = new bignumber_js_1.default(order.takerAssetAmount);
        order.expirationTimeSeconds = new bignumber_js_1.default(order.expirationTimeSeconds);
        return order;
    };
    return Trade;
}());
exports.Trade = Trade;
