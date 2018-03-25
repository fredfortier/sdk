"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
class Market {
    constructor(params, tradeExecuter) {
        this.tradeExecuter = tradeExecuter;
        this.id = params.id;
        this.baseTokenAddress = params.baseTokenAddress;
        this.quoteTokenAddress = params.quoteTokenAddress;
        this.baseTokenDecimals = new bignumber_js_1.default(params.baseTokenDecimals);
        this.quoteTokenDecimals = new bignumber_js_1.default(params.quoteTokenDecimals);
        this.baseMinSize = new bignumber_js_1.default(params.baseMinSize);
        this.baseMaxSize = new bignumber_js_1.default(params.baseMaxSize);
        this.quoteIncrement = new bignumber_js_1.default(params.quoteIncrement);
        this.basedisplayNameMinSize = params.basedisplayNameMinSize;
    }
}
exports.Market = Market;
