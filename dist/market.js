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
    constructor(params, apiEndpoint, tradeExecuter) {
        this.endpoint = apiEndpoint;
        this.tradeExecuter = tradeExecuter;
        this.id = params.id;
        this.baseTokenAddress = params.baseTokenAddress;
        this.quoteTokenAddress = params.quoteTokenAddress;
        this.baseTokenDecimals = new bignumber_js_1.default(params.baseTokenDecimals);
        this.quoteTokenDecimals = new bignumber_js_1.default(params.quoteTokenDecimals);
        this.baseMinSize = new bignumber_js_1.default(params.baseMinSize);
        this.baseMaxSize = new bignumber_js_1.default(params.baseMaxSize);
        this.quoteIncrement = new bignumber_js_1.default(params.quoteIncrement);
        this.displayName = params.displayName;
    }
    // getBook
    // TODO managed books?
    getBookAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this.endpoint}/markets/${this.id}/book`));
        });
    }
    // getFills
    getFillsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this.endpoint}/markets/${this.id}/fills`));
        });
    }
    // getCandles
    getCandlesAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this.endpoint}/markets/${this.id}/candles`));
        });
    }
    // getTicker
    getTickerAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this.endpoint}/markets/${this.id}/ticker`));
        });
    }
    // marketOrder
    marketOrderAsync(type, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tradeExecuter.marketOrder(this, type, amount);
        });
    }
    // limitOrder
    limitOrderAsync(type = 'buy', baseTokenAmount, quoteTokenAmount, expiration) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tradeExecuter.limitOrder(this, type, baseTokenAmount, quoteTokenAmount, expiration);
        });
    }
    // cancelOrder
    cancelOrderAsync(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tradeExecuter.cancelOrderAsync(order);
        });
    }
}
exports.Market = Market;
