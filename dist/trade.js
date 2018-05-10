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
const types_1 = require("./types");
const _0x_js_1 = require("0x.js");
const bignumber_js_1 = require("bignumber.js");
const request = require("request-promise");
class Trade {
    constructor(zeroEx, apiEndpoint, account, events, tokens) {
        this._zeroEx = zeroEx;
        this._endpoint = apiEndpoint;
        this._account = account;
        this._events = events;
        this._tokens = tokens;
    }
    marketOrder(market, type = 'buy', quantity = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const marketResponse = yield request.post({
                url: `${this._endpoint}/markets/${market.id}/order/market`,
                json: {
                    type,
                    quantity: quantity.toString(),
                }
            });
            marketResponse.orders.forEach((order, i) => {
                marketResponse.orders[i].takerTokenAmount = new bignumber_js_1.default(order.takerTokenAmount);
                marketResponse.orders[i].makerTokenAmount = new bignumber_js_1.default(order.makerTokenAmount);
                marketResponse.orders[i].expirationUnixTimestampSec = new bignumber_js_1.default(order.expirationUnixTimestampSec);
            });
            const txHash = yield this._zeroEx.exchange.fillOrdersUpToAsync(marketResponse.orders, _0x_js_1.ZeroEx.toBaseUnitAmount(quantity, market.baseTokenDecimals.toNumber()), true, this._account.address);
            this._events.emit('transactionPending', txHash);
            const receipt = yield this._zeroEx.awaitTransactionMinedAsync(txHash);
            this._events.emit('transactionMined', receipt);
            return receipt;
        });
    }
    // sign and post order to book
    limitOrder(market = null, type = 'buy', // ask == sell, bid == buy
    quantity, // base token quantity
    price, // price (in quote)
    expiration // expiration in seconds from now
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield request.post({
                url: `${this._endpoint}/markets/${market.id}/order/limit`,
                json: {
                    type,
                    quantity: quantity.toString(),
                    price: price.toString(),
                    expiration: expiration.toString()
                }
            });
            // add missing data
            order.exchangeContractAddress = this._zeroEx.exchange.getContractAddress();
            order.maker = this._account.address;
            // sign order
            const prefix = (this._account.walletType === types_1.WalletType.Core);
            const orderHash = _0x_js_1.ZeroEx.getOrderHashHex(order);
            const ecSignature = yield this._zeroEx.signOrderHashAsync(orderHash, this._account.address, prefix);
            order.ecSignature = ecSignature;
            // POST order to API
            yield request.post({
                url: `${this._endpoint}/orders`,
                json: order
            });
            return order;
        });
    }
    // TODO fill individual order
    // cancel a signed order
    // TODO cancel partial?
    cancelOrderAsync(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const txHash = yield this._zeroEx.exchange.cancelOrderAsync(order, order.takerTokenAmount);
            this._events.emit('transactionPending', txHash);
            const receipt = yield this._zeroEx.awaitTransactionMinedAsync(txHash);
            this._events.emit('transactionMined', receipt);
            return receipt;
        });
    }
}
exports.Trade = Trade;
