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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var _0x_js_1 = require("0x.js");
var types_1 = require("./types");
var es6_promisify_1 = require("es6-promisify");
var request = require("request-promise");
var Account = /** @class */ (function () {
    function Account(ethereum, zeroEx, apiEndpoint, tokens) {
        // TODO tokens + decimal calculations and conversions
        this._endpoint = apiEndpoint;
        this._tokens = tokens;
        this._ethereum = ethereum;
        this._zeroEx = zeroEx;
        this._wallet = this._ethereum.wallet || undefined;
        this.address = this._ethereum.defaultAccount;
    }
    Object.defineProperty(Account.prototype, "walletType", {
        get: function () {
            return this._wallet ? types_1.WalletType.Local : types_1.WalletType.Rpc;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Export an account wallet seed phrase.
     * NOTE: This method is only available if using a LightWallet
     *
     * @param {string} password
     */
    Account.prototype.exportSeedPhraseAsync = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._wallet)
                            return [2 /*return*/, ''];
                        return [4 /*yield*/, this._wallet.exportSeedPhraseAsync(password)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Export a wallet address private key
     * NOTE: This method is only available if using a LightWallet
     *
     * @param {string} password
     */
    Account.prototype.exportAddressPrivateKeyAsync = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._wallet)
                            return [2 /*return*/, ''];
                        return [4 /*yield*/, this._wallet.exportAccountPrivateKeyAsync(this.address, password)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Set the current address in use
     * NOTE: This method is only available if using a LightWallet
     *
     * @param {string|number} address or address index
     */
    Account.prototype.setAddressAsync = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ethereum.setDefaultAccount(address)];
                    case 1:
                        _a.sent();
                        this.address = this._ethereum.defaultAccount;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add new addresses for this account
     * NOTE: This method is only available if using a LightWallet
     *
     * @param {number}  num  amount of addresses to create
     */
    Account.prototype.addNewAddresses = function (num) {
        this._wallet.addNewAccounts(num);
    };
    /**
     * Get available addresses for this account
     */
    Account.prototype.getAvailableAddressesAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, es6_promisify_1.promisify(this._ethereum.web3.eth.getAccounts)()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get ETH balance for the current selected address
     */
    Account.prototype.getEthBalanceAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ethereum.getEthBalanceAsync(this.address)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, _0x_js_1.ZeroEx.toUnitAmount(balance, 18)];
                }
            });
        });
    };
    /**
     * Transfer ETH to another address
     *
     * @param {string}     to     address to transfer to
     * @param {BigNumber}  amount amount of eth to transfer
     * @param {Opts}       opts   optional transaction options
     */
    Account.prototype.transferEthAsync = function (to, amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var txOpts, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txOpts = {
                            gasPrice: opts.transactionOpts ? opts.transactionOpts.gasPrice : undefined,
                            gas: opts.transactionOpts ? opts.transactionOpts.gasLimit : undefined
                        };
                        return [4 /*yield*/, this._ethereum.transferEthAsync(this.address, to, amount, txOpts)];
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
     * Wrap ETH to convert it to WETH
     *
     * @param {BigNumber}  amount amount of eth to wrap
     * @param {Opts}       opts   optional transaction options
     */
    Account.prototype.wrapEthAsync = function (amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._zeroEx.etherToken.depositAsync(this._getWETHTokenAddress(), _0x_js_1.ZeroEx.toBaseUnitAmount(amount, 18), this.address, opts.transactionOpts)];
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
     * Unwrap WETH to convert it to ETH
     *
     * @param {BigNumber}  amount amount of WETH to unwrap
     * @param {Opts}       opts   optional transaction options
     */
    Account.prototype.unwrapEthAsync = function (amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._zeroEx.etherToken.withdrawAsync(this._getWETHTokenAddress(), _0x_js_1.ZeroEx.toBaseUnitAmount(amount, 18), this.address, opts.transactionOpts)];
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
     * Get balance of a token for the current selected address
     *
     * @param {string}  token  token address
     */
    Account.prototype.getTokenBalanceAsync = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._zeroEx.token.getBalanceAsync(token, this.address)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, _0x_js_1.ZeroEx.toUnitAmount(balance, this._tokens.get(token).decimals)];
                }
            });
        });
    };
    /**
     * Transfer tokens to another address
     *
     * @param {string}     token  token address
     * @param {string}     to     address to transfer to
     * @param {BigNumber}  amount amount of token to transfer
     * @param {Opts}       opts   optional transaction options
     */
    Account.prototype.transferTokenAsync = function (token, to, amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var amt, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amt = _0x_js_1.ZeroEx.toBaseUnitAmount(amount, this._tokens.get(token).decimals);
                        return [4 /*yield*/, this._zeroEx.token.transferAsync(token, this.address, to, amt, opts.transactionOpts)];
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
     * Transfer tokens to another address
     *
     * @param {string}     token  token address
     */
    Account.prototype.getTokenAllowanceAsync = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var baseUnitallowance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._zeroEx.token.getProxyAllowanceAsync(token, this.address)];
                    case 1:
                        baseUnitallowance = _a.sent();
                        return [2 /*return*/, _0x_js_1.ZeroEx.toUnitAmount(baseUnitallowance, this._tokens.get(token).decimals)];
                }
            });
        });
    };
    /**
     * Set a token allowance
     *
     * @param {string}     token  token address
     * @param {BigNumber}  amount allowance amount
     * @param {Opts}       opts   optional transaction options
     */
    Account.prototype.setTokenAllowanceAsync = function (token, amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var amt, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amt = _0x_js_1.ZeroEx.toBaseUnitAmount(amount, this._tokens.get(token).decimals);
                        return [4 /*yield*/, this._zeroEx.token.setProxyAllowanceAsync(token, this.address, amt, opts.transactionOpts)];
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
     * Set unlimited token allowance
     *
     * @param {string}     token  token address
     * @param {Opts}       opts   optional transaction options
     */
    Account.prototype.setUnlimitedTokenAllowanceAsync = function (token, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._zeroEx.token.setUnlimitedProxyAllowanceAsync(token, this.address, opts.transactionOpts)];
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
     * Get orders for the selected address that have been placed on Radar
     *
     * @param {number} page
     * @param {number} perPage
     */
    Account.prototype.getOrdersAsync = function (page, perPage) {
        if (page === void 0) { page = 1; }
        if (perPage === void 0) { perPage = 100; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, request.get(this._endpoint + "/accounts/" + this.address + "/orders?page=" + page + "&per_page=" + perPage)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    /**
     * Get fills for the selected address that have been executed on Radar
     *
     * @param {number} page
     * @param {number} perPage
     */
    Account.prototype.getFillsAsync = function (page, perPage) {
        if (page === void 0) { page = 1; }
        if (perPage === void 0) { perPage = 100; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, request.get(this._endpoint + "/accounts/" + this.address + "/fills?page=" + page + "&per_page=" + perPage)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    Account.prototype._getWETHTokenAddress = function () {
        var token;
        this._tokens.forEach(function (t) {
            if (t.symbol === 'WETH') {
                token = t;
            }
        });
        return token.address;
    };
    return Account;
}());
exports.Account = Account;
