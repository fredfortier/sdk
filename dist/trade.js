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
class Trade {
    constructor(zeroEx, apiEndpoint, account, events) {
        this.zeroEx = zeroEx;
        this.endpoint = apiEndpoint;
        this.account = account;
        this.events = events;
        // TODO may need to init event listeners
        // for changes to class instances / params
    }
    // TODO this is a test
    marketOrder(market = null, type = 'buy', amount = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const signedOrder = JSON.parse(`{
        "exchangeContractAddress": "0x90fe2af704b34e0224bf2299c838e04d4dcf1364",
        "maker": "0x9d94d5c4dcf7784023afc5826059ba8c0f17657f",
        "taker": "0x0000000000000000000000000000000000000000",
        "makerTokenAmount": "5144082533960915",
        "takerTokenAmount": "5000000000000000000",
        "makerTokenAddress": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
        "takerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
        "makerFee": "0",
        "takerFee": "0",
        "feeRecipient": "0xa258b39954cef5cb142fd567a46cddb31a670124",
        "expirationUnixTimestampSec": "1521891891",
        "salt": "86821865937684789548136301908081798977199604636974649680523686200827244608231",
        "ecSignature": {
          "v": 27,
          "r": "0xd04bbab1529a1bfd389fd97d7b3b754a92311d179632248848dc6af8c14ab910",
          "s": "0x6d2d88e333a874a5cdbb56248f59a3a576c1465cda3fcdb3cb6f69167c990c6b"
          }
        }`);
            signedOrder.makerTokenAmount = new bignumber_js_1.default(signedOrder.makerTokenAmount);
            signedOrder.takerTokenAmount = new bignumber_js_1.default(signedOrder.takerTokenAmount);
            signedOrder.makerFee = new bignumber_js_1.default(signedOrder.makerFee);
            signedOrder.takerFee = new bignumber_js_1.default(signedOrder.takerFee);
            signedOrder.salt = new bignumber_js_1.default(signedOrder.salt);
            signedOrder.expirationUnixTimestampSec = new bignumber_js_1.default(signedOrder.expirationUnixTimestampSec);
            const txHash = yield this.zeroEx.exchange.fillOrderAsync(signedOrder, new bignumber_js_1.default('100000000000000000'), true, this.account.address, {
                shouldValidate: true
            });
            console.log(txHash);
            const results = yield this.zeroEx.awaitTransactionMinedAsync(txHash, 1000);
            console.log(results);
        });
    }
    // sign and post order to book
    limitOrder(market = null, type = 'buy', amount = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO
        });
    }
}
exports.Trade = Trade;
