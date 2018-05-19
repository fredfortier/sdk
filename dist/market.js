"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const request = require("request-promise");
class Market {
    constructor(params, apiEndpoint, trade) {
        this._endpoint = apiEndpoint;
        this._trade = trade;
        this.id = params.id;
        this.baseTokenAddress = params.baseTokenAddress;
        this.quoteTokenAddress = params.quoteTokenAddress;
        this.baseTokenDecimals = new bignumber_js_1.default(params.baseTokenDecimals);
        this.quoteTokenDecimals = new bignumber_js_1.default(params.quoteTokenDecimals);
        this.minOrderSize = new bignumber_js_1.default(params.minOrderSize);
        this.maxOrderSize = new bignumber_js_1.default(params.maxOrderSize);
        this.quoteIncrement = new bignumber_js_1.default(params.quoteIncrement);
        this.displayName = params.displayName;
    }
    // getBook
    // TODO managed books?
    getBookAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this._endpoint}/markets/${this.id}/book`));
        });
    }
    // getFills
    getFillsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this._endpoint}/markets/${this.id}/fills`));
        });
    }
    // getCandles
    getCandlesAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this._endpoint}/markets/${this.id}/candles`));
        });
    }
    // getTicker
    getTickerAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this._endpoint}/markets/${this.id}/ticker`));
        });
    }
    // marketOrder
    marketOrderAsync(type, amount, awaitTransactionMined = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._trade.marketOrder(this, type, amount, awaitTransactionMined);
        });
    }
    // limitOrder
    limitOrderAsync(type, quantity, price, expiration) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._trade.limitOrder(this, type, quantity, price, expiration);
        });
    }
    // cancelOrder
    cancelOrderAsync(order, awaitTransactionMined = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._trade.cancelOrderAsync(order, awaitTransactionMined);
        });
    }
}
exports.Market = Market;
