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
class ZeroExWrapper {
}
exports.ZeroExWrapper = ZeroExWrapper;
const Web3 = require("web3");
const es6_promisify_1 = require("es6-promisify");
const bignumber_js_1 = require("bignumber.js");
const _0x_js_1 = require("0x.js");
(() => __awaiter(this, void 0, void 0, function* () {
    const provider = new Web3.providers.HttpProvider('http://35.196.15.153:8545');
    const web3 = new Web3(provider);
    const networkId = yield es6_promisify_1.promisify(web3.version.getNetwork)();
    const zeroExConfig = {
        networkId: parseInt(networkId, 10)
    };
    const zeroEx = new _0x_js_1.ZeroEx(web3.currentProvider, zeroExConfig);
    const zeroExProxyContract = '0x087eed4bc1ee3de49befbd66c662b434b15d49d4';
    // Set Exchange Contract Address.
    const exchangeAddress = zeroEx.exchange.getContractAddress();
    const zrxAllowance = yield zeroEx.token.getBalanceAsync('0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570', web3.eth.accounts[0]);
    const signedOrder = JSON.parse(`{
    "ecSignature": {
      "v": 27,
      "r": "0xabab930ab3b91c87af7113c2606a6ce7a2eed87afad2c9851be1e9225c7c4ef4",
      "s": "0x0bcde602e212288f13d852abd462899d5f816473a14cc9a8082c3ce6a284b880"
    },
    "exchangeContractAddress": "0x90fe2af704b34e0224bf2299c838e04d4dcf1364",
    "expirationUnixTimestampSec": "1522443925",
    "feeRecipient": "0xa258b39954cef5cb142fd567a46cddb31a670124",
    "maker": "0x4f8c975765e58c548b3fded45b9f81c1bfc5fc90",
    "makerFee": "0",
    "makerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
    "makerTokenAmount": "1200000000000000000",
    "salt": "98567051257498161895650393540850073379060812338841565648042755053289806057072",
    "taker": "0x0000000000000000000000000000000000000000",
    "takerFee": "0",
    "takerTokenAddress": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
    "takerTokenAmount": "2280000000000000"
  }`);
    signedOrder.makerTokenAmount = new bignumber_js_1.default(signedOrder.makerTokenAmount);
    signedOrder.takerTokenAmount = new bignumber_js_1.default(signedOrder.takerTokenAmount);
    signedOrder.makerFee = new bignumber_js_1.default(signedOrder.makerFee);
    signedOrder.takerFee = new bignumber_js_1.default(signedOrder.takerFee);
    signedOrder.salt = new bignumber_js_1.default(signedOrder.salt);
    signedOrder.expirationUnixTimestampSec = new bignumber_js_1.default(signedOrder.expirationUnixTimestampSec);
    const txHash = yield zeroEx.exchange.fillOrderAsync(signedOrder, new bignumber_js_1.default('100000000000000000'), true, web3.eth.accounts[0].toLowerCase(), {
        shouldValidate: true
    });
    console.log(txHash);
    const results = yield zeroEx.awaitTransactionMinedAsync(txHash, 1000);
    console.log(results);
}))();
