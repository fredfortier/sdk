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
const _0x_js_1 = require("0x.js");
const bignumber_js_1 = require("bignumber.js");
const request = require("request-promise");
// TODO move into config file
const feeRecipientAddress = '0xa258b39954cef5cb142fd567a46cddb31a670124';
class Trade {
    constructor(zeroEx, apiEndpoint, account, events) {
        this.zeroEx = zeroEx;
        this.endpoint = apiEndpoint;
        this.account = account;
        this.events = events;
    }
    marketOrder(market, type = 'buy', quantity = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const marketResponse = yield request.post({
                url: `${this.endpoint}/markets/${market.id}/order/market`,
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
            const txHash = yield this.zeroEx.exchange.fillOrdersUpToAsync(marketResponse.orders, quantity.times(10).pow(market.baseTokenDecimals.toNumber()), true, this.account.address);
            this.events.emit('transactionPending', txHash);
            const receipt = yield this.zeroEx.awaitTransactionMinedAsync(txHash);
            this.events.emit('transactionMined', receipt);
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
                url: `${this.endpoint}/markets/${market.id}/order/limit`,
                json: {
                    type,
                    quantity: quantity.toString(),
                    price: price.toString(),
                    expiration: expiration.toString()
                }
            });
            // TODO this appears to be
            // broken, remove once fixed
            if (type === 'sell') {
                order.takerTokenAmount = new bignumber_js_1.default(order.makerTokenAmount).times(price).floor().toString();
            }
            else {
                order.makerTokenAmount = new bignumber_js_1.default(order.takerTokenAmount).times(price).floor().toString();
            }
            // add missing data
            order.exchangeContractAddress = this.zeroEx.exchange.getContractAddress();
            order.maker = this.account.address;
            // sign order
            const orderHash = _0x_js_1.ZeroEx.getOrderHashHex(order);
            const ecSignature = yield this.zeroEx.signOrderHashAsync(orderHash, this.account.address, false);
            order.ecSignature = ecSignature;
            // POST order to API
            yield request.post({
                url: `${this.endpoint}/orders`,
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
            const txHash = yield this.zeroEx.exchange.cancelOrderAsync(order, order.takerTokenAmount);
            this.events.emit('transactionPending', txHash);
            const receipt = yield this.zeroEx.awaitTransactionMinedAsync(txHash);
            this.events.emit('transactionMined', receipt);
            return receipt;
        });
    }
}
exports.Trade = Trade;
