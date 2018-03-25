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
const request = require("request-promise");
// TODO move to config
const WETH_TOKEN_ADDRESS = '';
const ZEROEX_PROXY_ADDRESS = '0x087eed4bc1ee3de49befbd66c662b434b15d49d4';
class Account {
    constructor(connection, zeroEx, apiEndpoint) {
        this.endpoint = apiEndpoint;
        this.connection = connection;
        this.address = this.connection.defaultAccount;
        this.zeroEx = zeroEx;
    }
    getEthBalanceAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.connection.getEthBalanceAsync(this.address);
        });
    }
    transferEthAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO
        });
    }
    wrapEthAsync(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const txHash = yield this.zeroEx.etherToken.depositAsync(WETH_TOKEN_ADDRESS, amount, this.address);
            const receipt = yield this.zeroEx.awaitTransactionMinedAsync(txHash);
            return receipt;
        });
    }
    unwrapEthAsync(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const txHash = yield this.zeroEx.etherToken.withdrawAsync(WETH_TOKEN_ADDRESS, amount, this.address);
            const receipt = yield this.zeroEx.awaitTransactionMinedAsync(txHash);
            return receipt;
        });
    }
    getTokenBalanceAsync(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.zeroEx.token.getBalanceAsync(token, this.address);
        });
    }
    transferTokenAsync(token, to, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const txHash = yield this.zeroEx.token.transferAsync(token, this.address, to, amount);
            const receipt = yield this.zeroEx.awaitTransactionMinedAsync(txHash);
            return receipt;
        });
    }
    getTokenAllowanceAsync(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.zeroEx.token.getProxyAllowanceAsync(token, this.address);
        });
    }
    setTokenAllowanceAsync(token, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const txHash = yield this.zeroEx.token.setProxyAllowanceAsync(token, this.address, amount);
            const receipt = yield this.zeroEx.awaitTransactionMinedAsync(txHash);
            return receipt;
        });
    }
    getOrdersAsync(page, perPage = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this.endpoint}/accounts/${this.address}/orders`));
        });
    }
    getFillsAsync(page, perPage = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this.endpoint}/accounts/${this.address}/fills`));
        });
    }
}
exports.Account = Account;
