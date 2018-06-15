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
var Web3 = require("web3");
var bignumber_js_1 = require("bignumber.js");
var es6_promisify_1 = require("es6-promisify");
var wallet_manager_1 = require("@radarrelay/wallet-manager");
var web3_builder_1 = require("@radarrelay/web3-builder");
var subproviders_1 = require("@radarrelay/subproviders");
var types_1 = require("./types");
var types_2 = require("@radarrelay/wallet-manager/dist/types");
/**
 * Ethereum
 */
var Ethereum = /** @class */ (function () {
    function Ethereum() {
    }
    /**
     * Set the provider
     *
     * @param {WalletType} type The wallet type
     * @param {Config} config The wallet config
     */
    Ethereum.prototype.setProvider = function (type, config) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._config = config;
                        _a = type;
                        switch (_a) {
                            case types_1.WalletType.Local: return [3 /*break*/, 1];
                            case types_1.WalletType.Rpc: return [3 /*break*/, 3];
                            case types_1.WalletType.Injected: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this._setLightWalletProvider(this._config)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        this._setRpcWalletProvider(this._config);
                        return [3 /*break*/, 5];
                    case 4:
                        this._setInjectedWalletProvider(this._config);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(Ethereum.prototype, "defaultAccount", {
        /**
         * Default account getter
         */
        get: function () {
            return this.web3.eth.defaultAccount;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the ether balance for an account
     *
     * @param {string} address The address
     */
    Ethereum.prototype.getEthBalanceAsync = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var bal;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, es6_promisify_1.promisify(function (cb) { return _this.web3.eth.getBalance(address, cb); })()];
                    case 1:
                        bal = _a.sent();
                        return [2 /*return*/, new bignumber_js_1.default(bal)];
                }
            });
        });
    };
    /**
     * Transfer ether to another account
     *
     * @param {string} from The from address
     * @param {string} to The to address
     * @param {BigNumber} value The value to transfer
     */
    Ethereum.prototype.transferEthAsync = function (from, to, value, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = { from: from, to: to, value: this.web3.toWei(value, 'ether') };
                        if (opts.gasPrice) {
                            params.gasPrice = opts.gasPrice;
                        }
                        if (opts.gas) {
                            params.gas = opts.gas;
                        }
                        return [4 /*yield*/, es6_promisify_1.promisify(function (cb) { return _this.web3.eth.sendTransaction(params, cb); })()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get the RPC Connections networkId
     */
    Ethereum.prototype.getNetworkIdAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var networkId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, es6_promisify_1.promisify(this.web3.version.getNetwork)()];
                    case 1:
                        networkId = _a.sent();
                        this.networkId = parseInt(networkId, 10);
                        return [2 /*return*/, this.networkId];
                }
            });
        });
    };
    /**
     * Set ETH defaultAccount to a new address index or address
     *
     * @param {number|string}  account The account index or address
     */
    Ethereum.prototype.setDefaultAccount = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var accounts, found_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, es6_promisify_1.promisify(this.web3.eth.getAccounts)()];
                    case 1:
                        accounts = _a.sent();
                        if (typeof (account) === 'number') {
                            if (typeof (accounts[account]) === 'undefined')
                                throw new Error('unable to retrieve account');
                            this.web3.eth.defaultAccount = accounts[account];
                        }
                        else {
                            found_1 = false;
                            accounts.map(function (address) {
                                if (address === account) {
                                    found_1 = true;
                                    _this.web3.eth.defaultAccount = address;
                                }
                            });
                            if (!found_1)
                                throw new Error('unable to retrieve account');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set the local LightWallet Provider
     *
     * @param {config} LightWalletConfig The LightWallet configuration
     */
    Ethereum.prototype._setLightWalletProvider = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 6]);
                        return [4 /*yield*/, wallet_manager_1.LightWalletManager.loadWalletAsync(config.wallet.password)];
                    case 1:
                        wallet = _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        err_1 = _a.sent();
                        if (!(err_1.message === types_2.WalletError.NoWalletFound)) return [3 /*break*/, 4];
                        return [4 /*yield*/, wallet_manager_1.LightWalletManager.createWalletAsync(config.wallet)];
                    case 3:
                        // create a new light wallet
                        wallet = _a.sent();
                        return [3 /*break*/, 5];
                    case 4: throw new Error(err_1.message);
                    case 5: return [3 /*break*/, 6];
                    case 6:
                        this.wallet = wallet;
                        this.web3 = web3_builder_1.Web3Builder.createWeb3(new subproviders_1.EthLightwalletSubprovider(wallet.signing, wallet.keystore, wallet.pwDerivedKey), config.dataRpcUrl, true);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set injected wallet provider
     *
     * @param {config} InjectedWalletConfig The InjectedWallet config
     */
    Ethereum.prototype._setInjectedWalletProvider = function (config) {
        // Default to window.web3
        var defaultWeb3 = window.web3;
        if (!config.dataRpcUrl) {
            this.web3 = config.web3 || defaultWeb3;
        }
        else {
            this.web3 = web3_builder_1.Web3Builder.createWeb3(new subproviders_1.InjectedWeb3Subprovider(config.web3.currentProvider), config.dataRpcUrl, true);
        }
    };
    /**
     * Set the rpc wallet provider
     *
     * @param {config} RpcWalletConfig The RpcWallet config
     */
    Ethereum.prototype._setRpcWalletProvider = function (config) {
        var provider = new Web3.providers.HttpProvider(config.rpcUrl);
        this.web3 = new Web3(provider);
    };
    return Ethereum;
}());
exports.Ethereum = Ethereum;
