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
}))();
