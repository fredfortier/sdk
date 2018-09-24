"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Vendor
var util_1 = require("util");
var axios_1 = require("axios");
var ZeroEx_1 = require("../ZeroEx");
var BaseAccount = /** @class */ (function () {
    // --- Constructor --- //
    /**
     * Instantiate a BaseAccount.
     *
     * @param {AccountParams} params The account parameters
     */
    function BaseAccount(params) {
        this._ethereum = params.ethereum;
        this._events = params.events;
        this._zeroEx = params.zeroEx;
        this._endpoint = params.endpoint;
        this._tokens = params.tokens;
        this.address = this._ethereum.defaultAccount;
    }
    // --- Exposed methods --- //
    /**
     * Get available addresses for this account.
     */
    BaseAccount.prototype.getAvailableAddressesAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, util_1.promisify(this._ethereum.web3.eth.getAccounts)()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get ETH balance for the current selected address.
     */
    BaseAccount.prototype.getEthBalanceAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ethereum.getEthBalanceAsync(this.address)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, ZeroEx_1.ZeroEx.toUnitAmount(balance, 18)];
                }
            });
        });
    };
    /**
     * Transfer ETH to another address.
     *
     * @param {string} toAddress The address to transfer to.
     * @param {BigNumber} amount The amount of ETH to transfer.
     * @param {Opts} [opts] The transaction options.
     */
    BaseAccount.prototype.transferEthAsync = function (toAddress, amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var txOpts, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!opts) {
                            opts = {};
                        }
                        txOpts = {
                            gasPrice: opts.transactionOpts ? opts.transactionOpts.gasPrice : undefined,
                            gas: opts.transactionOpts ? opts.transactionOpts.gasLimit : undefined
                        };
                        return [4 /*yield*/, this._ethereum.transferEthAsync(this.address, toAddress, amount, txOpts)];
                    case 1:
                        txHash = _a.sent();
                        if (!opts.awaitTransactionMined) {
                            return [2 /*return*/, txHash];
                        }
                        return [4 /*yield*/, this._zeroEx.awaitTransactionMinedAsync(txHash)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Wrap ETH to convert it to WETH.
     *
     * @param {BigNumber} amount The amount of ETH to wrap.
     * @param {Opts} [opts] The transaction options.
     */
    BaseAccount.prototype.wrapEthAsync = function (amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!opts) {
                            opts = {};
                        }
                        return [4 /*yield*/, this._zeroEx.etherToken.depositAsync(this._getWETHTokenAddress(), ZeroEx_1.ZeroEx.toBaseUnitAmount(amount, 18), this.address, opts.transactionOpts)];
                    case 1:
                        txHash = _a.sent();
                        if (!opts.awaitTransactionMined) {
                            return [2 /*return*/, txHash];
                        }
                        return [4 /*yield*/, this._zeroEx.awaitTransactionMinedAsync(txHash)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Unwrap WETH to convert it to ETH.
     *
     * @param {BigNumber} amount The amount of WETH to unwrap.
     * @param {Opts} [opts] The transaction options.
     */
    BaseAccount.prototype.unwrapEthAsync = function (amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!opts) {
                            opts = {};
                        }
                        return [4 /*yield*/, this._zeroEx.etherToken.withdrawAsync(this._getWETHTokenAddress(), ZeroEx_1.ZeroEx.toBaseUnitAmount(amount, 18), this.address, opts.transactionOpts)];
                    case 1:
                        txHash = _a.sent();
                        if (!opts.awaitTransactionMined) {
                            return [2 /*return*/, txHash];
                        }
                        return [4 /*yield*/, this._zeroEx.awaitTransactionMinedAsync(txHash)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get balance of a token for the current selected address.
     *
     * @param {string} tokenAddress The token address.
     */
    BaseAccount.prototype.getTokenBalanceAsync = function (tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var balance, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._zeroEx.erc20Token.getBalanceAsync(tokenAddress, this.address)];
                    case 1:
                        balance = _d.sent();
                        _b = (_a = ZeroEx_1.ZeroEx).toUnitAmount;
                        _c = [balance];
                        return [4 /*yield*/, this._tokens.get(tokenAddress)];
                    case 2: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.sent()).decimals]))];
                }
            });
        });
    };
    /**
     * Transfer tokens to another address.
     *
     * @param {string} tokenAddress The token address.
     * @param {string} toAddress The address to transfer to.
     * @param {BigNumber} amount The amount of token to transfer.
     * @param {Opts} [opts] The transaction options.
     */
    BaseAccount.prototype.transferTokenAsync = function (tokenAddress, toAddress, amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var amt, _a, _b, _c, txHash;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!opts) {
                            opts = {};
                        }
                        _b = (_a = ZeroEx_1.ZeroEx).toBaseUnitAmount;
                        _c = [amount];
                        return [4 /*yield*/, this._tokens.get(tokenAddress)];
                    case 1:
                        amt = _b.apply(_a, _c.concat([(_d.sent()).decimals]));
                        return [4 /*yield*/, this._zeroEx.erc20Token.transferAsync(tokenAddress, this.address, toAddress, amt, opts.transactionOpts)];
                    case 2:
                        txHash = _d.sent();
                        if (!opts.awaitTransactionMined) {
                            return [2 /*return*/, txHash];
                        }
                        return [4 /*yield*/, this._zeroEx.awaitTransactionMinedAsync(txHash)];
                    case 3: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    /**
     * Get a token allowance.
     *
     * @param {string} tokenAddress The token address.
     */
    BaseAccount.prototype.getTokenAllowanceAsync = function (tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var baseUnitallowance, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._zeroEx.erc20Token.getProxyAllowanceAsync(tokenAddress, this.address)];
                    case 1:
                        baseUnitallowance = _d.sent();
                        _b = (_a = ZeroEx_1.ZeroEx).toUnitAmount;
                        _c = [baseUnitallowance];
                        return [4 /*yield*/, this._tokens.get(tokenAddress)];
                    case 2: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.sent()).decimals]))];
                }
            });
        });
    };
    /**
     * Set a token allowance.
     *
     * @param {string} tokenAddress The token address.
     * @param {BigNumber} amount The allowance amount.
     * @param {Opts} [opts] The transaction options.
     */
    BaseAccount.prototype.setTokenAllowanceAsync = function (tokenAddress, amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var amt, _a, _b, _c, txHash;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!opts) {
                            opts = {};
                        }
                        _b = (_a = ZeroEx_1.ZeroEx).toBaseUnitAmount;
                        _c = [amount];
                        return [4 /*yield*/, this._tokens.get(tokenAddress)];
                    case 1:
                        amt = _b.apply(_a, _c.concat([(_d.sent()).decimals]));
                        return [4 /*yield*/, this._zeroEx.erc20Token.setProxyAllowanceAsync(tokenAddress, this.address, amt, opts.transactionOpts)];
                    case 2:
                        txHash = _d.sent();
                        if (!opts.awaitTransactionMined) {
                            return [2 /*return*/, txHash];
                        }
                        return [4 /*yield*/, this._zeroEx.awaitTransactionMinedAsync(txHash)];
                    case 3: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    /**
     * Set unlimited token allowance.
     *
     * @param {string} tokenAddress The token address.
     * @param {Opts} [opts] The transaction options.
     */
    BaseAccount.prototype.setUnlimitedTokenAllowanceAsync = function (tokenAddress, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!opts) {
                            opts = {};
                        }
                        return [4 /*yield*/, this._zeroEx.erc20Token.setUnlimitedProxyAllowanceAsync(tokenAddress, this.address, opts.transactionOpts)];
                    case 1:
                        txHash = _a.sent();
                        if (!opts.awaitTransactionMined) {
                            return [2 /*return*/, txHash];
                        }
                        return [4 /*yield*/, this._zeroEx.awaitTransactionMinedAsync(txHash)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get orders for the selected address that have been placed on Radar.
     *
     * @param {number} page The page to fetch.
     * @param {number} perPage The number of orders per page.
     */
    BaseAccount.prototype.getOrdersAsync = function (page, perPage) {
        if (page === void 0) { page = 1; }
        if (perPage === void 0) { perPage = 100; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this._endpoint + "/accounts/" + this.address + "/orders", {
                            params: { page: page, perPage: perPage },
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Get fills for the selected address that have been executed on Radar.
     *
     * @param {number} page The page to fetch.
     * @param {number} perPage The number of fills per page.
     */
    BaseAccount.prototype.getFillsAsync = function (page, perPage) {
        if (page === void 0) { page = 1; }
        if (perPage === void 0) { perPage = 100; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this._endpoint + "/accounts/" + this.address + "/fills", {
                            params: { page: page, perPage: perPage },
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // --- Internal methods --- //
    BaseAccount.prototype._getWETHTokenAddress = function () {
        var token;
        this._tokens.forEach(function (t) {
            if (t.symbol === 'WETH') {
                token = t;
            }
        });
        return token.address;
    };
    return BaseAccount;
}());
exports.BaseAccount = BaseAccount;
