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
    marketOrder(market, type = 'buy', amount = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const side = (type === 'buy') ? 'asks' : 'bids';
            const orders = yield market.getBookAsync()[side];
            const signedOrders = [];
            let current = new bignumber_js_1.default(0);
            for (const order of orders) {
                if (current.gte(amount))
                    break;
                if (order.signedOrder.maker === this.account.address)
                    continue;
                const orderAmount = (type === 'buy') ? order.remainingBaseTokenAmount : order.remainingQuoteTokenAmount;
                current = current.plus(order.remainingQuoteTokenAmount);
                signedOrders.push(order.signedOrder);
            }
            const txHash = yield this.zeroEx.exchange.fillOrdersUpToAsync(signedOrders, amount, true, this.account.address);
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
            order.exchangeContractAddress = this.zeroEx.exchange.getContractAddress();
            order.maker = this.account.address;
            const orderHash = _0x_js_1.ZeroEx.getOrderHashHex(order);
            const ecSignature = yield this.zeroEx.signOrderHashAsync(orderHash, this.account.address, false);
            order.ecSignature = ecSignature;
            // POST order to API
            yield request.post(`${this.endpoint}/orders`, order);
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
            // const receipt = await this.zeroEx.awaitTransactionMinedAsync(txHash);
            return txHash;
        });
    }
}
exports.Trade = Trade;
