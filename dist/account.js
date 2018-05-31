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
const types_1 = require("./types");
const es6_promisify_1 = require("es6-promisify");
const request = require("request-promise");
class Account {
    constructor(ethereum, zeroEx, apiEndpoint, tokens) {
        // TODO tokens + decimal calculations and conversions
        this._endpoint = apiEndpoint;
        this._tokens = tokens;
        this._ethereum = ethereum;
        this._zeroEx = zeroEx;
        this._wallet = this._ethereum.wallet || undefined;
        this.address = this._ethereum.defaultAccount;
    }
    get walletType() {
        return this._wallet ? types_1.WalletType.Local : types_1.WalletType.Rpc;
    }
    exportSeedPhraseAsync(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._wallet.exportSeedPhraseAsync(password);
        });
    }
    exportAddressPrivateKeyAsync(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._wallet.exportAccountPrivateKeyAsync(this.address, password);
        });
    }
    setAddressAsync(account) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._ethereum.setDefaultAccount(account);
            this.address = this._ethereum.defaultAccount;
        });
    }
    addNewAddresses(num) {
        this._wallet.addNewAccounts(num);
    }
    getAvailableAddressesAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield es6_promisify_1.promisify(this._ethereum.web3.eth.getAccounts)();
        });
    }
    getEthBalanceAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this._ethereum.getEthBalanceAsync(this.address);
            return _0x_js_1.ZeroEx.toUnitAmount(balance, 18);
        });
    }
    transferEthAsync(to, amount, awaitTransactionMined = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const txHash = yield this._ethereum.transferEthAsync(this.address, to, amount);
            if (!awaitTransactionMined) {
                return txHash;
            }
            return yield this._zeroEx.awaitTransactionMinedAsync(txHash);
        });
    }
    wrapEthAsync(amount, awaitTransactionMined = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO get addr from tokens array
            const txHash = yield this._zeroEx.etherToken.depositAsync(this._getWETHTokenAddress(), _0x_js_1.ZeroEx.toBaseUnitAmount(amount, 18), this.address);
            if (!awaitTransactionMined) {
                return txHash;
            }
            return yield this._zeroEx.awaitTransactionMinedAsync(txHash);
        });
    }
    unwrapEthAsync(amount, awaitTransactionMined = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const txHash = yield this._zeroEx.etherToken.withdrawAsync(this._getWETHTokenAddress(), _0x_js_1.ZeroEx.toBaseUnitAmount(amount, 18), this.address);
            if (!awaitTransactionMined) {
                return txHash;
            }
            return yield this._zeroEx.awaitTransactionMinedAsync(txHash);
        });
    }
    getTokenBalanceAsync(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this._zeroEx.token.getBalanceAsync(token, this.address);
            return _0x_js_1.ZeroEx.toUnitAmount(balance, this._tokens.get(token).decimals);
        });
    }
    transferTokenAsync(token, to, amount, awaitTransactionMined = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const amt = _0x_js_1.ZeroEx.toBaseUnitAmount(amount, this._tokens.get(token).decimals);
            const txHash = yield this._zeroEx.token.transferAsync(token, this.address, to, amt);
            if (!awaitTransactionMined) {
                return txHash;
            }
            return yield this._zeroEx.awaitTransactionMinedAsync(txHash);
        });
    }
    getTokenAllowanceAsync(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUnitallowance = yield this._zeroEx.token.getProxyAllowanceAsync(token, this.address);
            return _0x_js_1.ZeroEx.toUnitAmount(baseUnitallowance, this._tokens.get(token).decimals);
        });
    }
    setTokenAllowanceAsync(token, amount, awaitTransactionMined = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const amt = _0x_js_1.ZeroEx.toBaseUnitAmount(amount, this._tokens.get(token).decimals);
            const txHash = yield this._zeroEx.token.setProxyAllowanceAsync(token, this.address, amt);
            if (!awaitTransactionMined) {
                return txHash;
            }
            return yield this._zeroEx.awaitTransactionMinedAsync(txHash);
        });
    }
    setUnlimitedTokenAllowanceAsync(token, awaitTransactionMined = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const txHash = yield this._zeroEx.token.setUnlimitedProxyAllowanceAsync(token, this.address);
            if (!awaitTransactionMined) {
                return txHash;
            }
            return yield this._zeroEx.awaitTransactionMinedAsync(txHash);
        });
    }
    getOrdersAsync(page = 1, perPage = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this._endpoint}/accounts/${this.address}/orders`));
        });
    }
    getFillsAsync(page = 1, perPage = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request.get(`${this._endpoint}/accounts/${this.address}/fills`));
        });
    }
    _getWETHTokenAddress() {
        let token;
        this._tokens.forEach(t => {
            if (t.symbol === 'WETH') {
                token = t;
            }
        });
        return token.address;
    }
}
exports.Account = Account;
