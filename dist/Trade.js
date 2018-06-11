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
var types_1 = require("./types");
var _0x_js_1 = require("0x.js");
var bignumber_js_1 = require("bignumber.js");
var request = require("request-promise");
var Trade = /** @class */ (function () {
    function Trade(zeroEx, apiEndpoint, account, events, tokens) {
        this._zeroEx = zeroEx;
        this._endpoint = apiEndpoint;
        this._account = account;
        this._events = events;
        this._tokens = tokens;
    }
    Trade.prototype.marketOrder = function (market, type, quantity, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var marketResponse, txHash, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.post({
                            url: this._endpoint + "/markets/" + market.id + "/order/market",
                            json: {
                                type: type,
                                quantity: quantity.toString(),
                            }
                        })];
                    case 1:
                        marketResponse = _a.sent();
                        marketResponse.orders.forEach(function (order, i) {
                            marketResponse.orders[i].takerTokenAmount = new bignumber_js_1.default(order.takerTokenAmount);
                            marketResponse.orders[i].makerTokenAmount = new bignumber_js_1.default(order.makerTokenAmount);
                            marketResponse.orders[i].expirationUnixTimestampSec = new bignumber_js_1.default(order.expirationUnixTimestampSec);
                        });
                        return [4 /*yield*/, this._zeroEx.exchange.fillOrdersUpToAsync(marketResponse.orders, _0x_js_1.ZeroEx.toBaseUnitAmount(quantity, market.baseTokenDecimals.toNumber()), true, this._account.address, opts.transactionOpts)];
                    case 2:
                        txHash = _a.sent();
                        this._events.emit('transactionPending', txHash);
                        if (!opts.awaitTransactionMined) {
                            return [2 /*return*/, txHash];
                        }
                        return [4 /*yield*/, this._zeroEx.awaitTransactionMinedAsync(txHash)];
                    case 3:
                        receipt = _a.sent();
                        this._events.emit('transactionComplete', receipt);
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
            var order, prefix, orderHash, ecSignature, orderPostURL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.post({
                            url: this._endpoint + "/markets/" + market.id + "/order/limit",
                            json: {
                                type: type,
                                quantity: quantity.toString(),
                                price: price.toString(),
                                expiration: expiration.toString()
                            }
                        })];
                    case 1:
                        order = _a.sent();
                        // add missing data
                        order.exchangeContractAddress = this._zeroEx.exchange.getContractAddress();
                        order.maker = this._account.address;
                        prefix = (this._account.type === types_1.WalletType.Local);
                        orderHash = _0x_js_1.ZeroEx.getOrderHashHex(order);
                        return [4 /*yield*/, this._zeroEx.signOrderHashAsync(orderHash, this._account.address, prefix)];
                    case 2:
                        ecSignature = _a.sent();
                        order.ecSignature = ecSignature;
                        orderPostURL = process.env.RADAR_SDK_ORDER_URL
                            ? process.env.RADAR_SDK_ORDER_URL
                            : this._endpoint + "/orders";
                        return [4 /*yield*/, request.post({
                                url: orderPostURL,
                                json: order
                            })];
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
                    case 0: return [4 /*yield*/, this._zeroEx.exchange.cancelOrderAsync(order, order.takerTokenAmount, opts.transactionOpts)];
                    case 1:
                        txHash = _a.sent();
                        this._events.emit('transactionPending', txHash);
                        if (!opts.awaitTransactionMined) {
                            return [2 /*return*/, txHash];
                        }
                        return [4 /*yield*/, this._zeroEx.awaitTransactionMinedAsync(txHash)];
                    case 2:
                        receipt = _a.sent();
                        this._events.emit('transactionComplete', receipt);
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    return Trade;
}());
exports.Trade = Trade;
