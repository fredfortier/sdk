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
var Web3ProviderEngine = require("web3-provider-engine");
var RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
var Web3 = require("web3");
var bignumber_js_1 = require("bignumber.js");
var es6_promisify_1 = require("es6-promisify");
var wallet_manager_1 = require("@radarrelay/wallet-manager");
var web3_builder_1 = require("@radarrelay/web3-builder");
var subproviders_1 = require("@radarrelay/subproviders");
var types_1 = require("./types");
/**
 * Ethereum
 */
var Ethereum = /** @class */ (function () {
    function Ethereum() {
    }
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
        get: function () {
            return this.web3.eth.defaultAccount;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * get the ether balance for an account
     *
     * @param {string} address
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
     * transfer ether to another account
     *
     * @param {string} from
     * @param {string} to
     * @param {BigNumber} value
     */
    Ethereum.prototype.transferEthAsync = function (from, to, value) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = { from: from, to: to, value: this.web3.toWei(value, 'ether') };
                        return [4 /*yield*/, es6_promisify_1.promisify(function (cb) { return _this.web3.eth.sendTransaction(params, cb); })()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * get the RPC Connections networkId
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
     * set eth defaultAccount to a
     * new address index or address
     *
     * @param {number|string}  account  account index or address
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
     * Set the local LightWallet Providers
     *
     * @param {config} LightWalletConfig
     */
    Ethereum.prototype._setLightWalletProvider = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var walletManager, wallet, err_1, web3Builder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletManager = new wallet_manager_1.LightWalletManager();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 7]);
                        return [4 /*yield*/, walletManager.loadWalletAsync(config.wallet.password)];
                    case 2:
                        wallet = _a.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        err_1 = _a.sent();
                        if (!(err_1.message === 'NO_WALLET_FOUND')) return [3 /*break*/, 5];
                        return [4 /*yield*/, walletManager.createWalletAsync(config.wallet)];
                    case 4:
                        // create a new light wallet
                        wallet = _a.sent();
                        return [3 /*break*/, 6];
                    case 5: throw new Error(err_1.message);
                    case 6: return [3 /*break*/, 7];
                    case 7:
                        this.wallet = wallet;
                        web3Builder = new web3_builder_1.Web3Builder();
                        this.web3 = web3Builder.createWeb3(new subproviders_1.EthLightwalletSubprovider(wallet._signing, wallet._keystore, wallet._pwDerivedKey), config.dataRpcUrl, true);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set injected wallet provider
     *
     * @param {config} InjectedWalletConfig
     */
    Ethereum.prototype._setInjectedWalletProvider = function (config) {
        var web3Builder = new web3_builder_1.Web3Builder();
        this.web3 = web3Builder.createWeb3(new subproviders_1.InjectedWeb3Subprovider(config.web3.currentProvider), config.dataRpcUrl, true);
    };
    /**
     * Set the rpc wallet providers
     * TODO use Web3Builder
     *
     * @param {config} RpcWalletConfig
     */
    Ethereum.prototype._setRpcWalletProvider = function (config) {
        // --- Use unlocked node --- //
        var providerEngine = new Web3ProviderEngine();
        // Add nonce subprovider tracker
        // providerEngine.addProvider(new NonceTrackerSubprovider());
        // Init wallet InjectedWeb3Subprovider provider (for signing, accounts, and transactions)
        var walletProvider = new Web3.providers.HttpProvider(config.walletRpcUrl);
        this.web3 = new Web3(walletProvider);
        providerEngine.addProvider(new subproviders_1.InjectedWeb3Subprovider(walletProvider));
        // Init RPCProvider for Ethereum data
        providerEngine.addProvider(new RPCSubprovider({ rpcUrl: config.dataRpcUrl }));
        providerEngine.start();
    };
    return Ethereum;
}());
exports.Ethereum = Ethereum;
