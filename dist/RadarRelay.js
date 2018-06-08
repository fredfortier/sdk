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
var events_1 = require("events");
var types_1 = require("./types");
var bignumber_js_1 = require("bignumber.js");
var request = require("request-promise");
var typescript_map_1 = require("typescript-map");
// SDK Classes
var SDKInitLifeCycle_1 = require("./SDKInitLifeCycle");
var ethereum_1 = require("./ethereum");
var market_1 = require("./market");
var trade_1 = require("./trade");
var LocalAccount_1 = require("./accounts/LocalAccount");
var RpcAccount_1 = require("./accounts/RpcAccount");
var InjectedAccount_1 = require("./accounts/InjectedAccount");
bignumber_js_1.default.config({ EXPONENTIAL_AT: 1e+9 });
/**
 * RadarRelay main SDK singleton
 */
var RadarRelay = /** @class */ (function () {
    /**
     * SDK instance
     *
     * @param {RadarRelayConfig}  config  sdk config
     */
    function RadarRelay(config) {
        /**
         * The load priority list maintains the function call
         * priority for each init method in the RadarRelaySDK class.
         * It is utilized by the SDKInitLifeCycle
         *
         * This list is configurable if additional init methods are necessary
         */
        this.loadPriorityList = [
            {
                event: 'ethereumInitialized',
                func: this.initEthereumNetworkIdAsync
            }, {
                event: 'ethereumNetworkIdInitialized',
                func: this.initZeroEx
            }, {
                event: 'zeroExInitialized',
                func: this.initTokensAsync
            }, {
                event: 'tokensInitialized',
                func: this.initAccountAsync,
                args: [0] // pass default account of 0 to setAccount
            }, {
                event: 'accountInitialized',
                func: this.initTrade
            }, {
                event: 'tradeInitialized',
                func: this.initMarketsAsync
            }, {
                event: 'marketsInitialized',
                func: undefined
            }
        ];
        // set the api/ws endpoint outside
        // of the init _lifecycle
        this._apiEndpoint = config.endpoint;
        this._wsEndpoint = config.websocketEndpoint;
        // instantiate event handler
        this.events = new events_1.EventEmitter();
        // instantiate ethereum class
        this._ethereum = new ethereum_1.Ethereum();
        // setup the _lifecycle
        this._lifecycle = new SDKInitLifeCycle_1.SDKInitLifeCycle(this.events, this.loadPriorityList, config.sdkInitializationTimeout);
        this._lifecycle.setup(this);
    }
    /**
     * Initialize the SDK
     *
     * @param {LightWalletConfig|RpcWalletConfig|InjectedWalletConfig}  config  wallet config
     */
    RadarRelay.prototype.initialize = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // local
                        if (config.wallet) {
                            this.activeWalletType = types_1.WalletType.Local;
                        }
                        // rpc
                        if (config.rpcUrl) {
                            this.activeWalletType = types_1.WalletType.Rpc;
                        }
                        // injected
                        if (config.type !== undefined) {
                            this.activeWalletType = types_1.WalletType.Injected;
                        }
                        return [4 /*yield*/, this._ethereum.setProvider(this.activeWalletType, config)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getCallback('ethereumInitialized', this._ethereum)];
                }
            });
        });
    };
    // --- not user configurable below this line --- //
    RadarRelay.prototype.initAccountAsync = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ethereum.setDefaultAccount(account)];
                    case 1:
                        _a.sent();
                        switch (this.activeWalletType) {
                            case types_1.WalletType.Local:
                                this.account = new LocalAccount_1.LocalAccount(this._ethereum, this.zeroEx, this._apiEndpoint, this.tokens);
                                break;
                            case types_1.WalletType.Rpc:
                                this.account = new RpcAccount_1.RpcAccount(this._ethereum, this.zeroEx, this._apiEndpoint, this.tokens);
                                break;
                            case types_1.WalletType.Injected:
                                this.account = new InjectedAccount_1.InjectedAccount(this._ethereum, this.zeroEx, this._apiEndpoint, this.tokens);
                                break;
                        }
                        return [2 /*return*/, this.getCallback('accountInitialized', this.account)];
                }
            });
        });
    };
    RadarRelay.prototype.initEthereumNetworkIdAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this._ethereum.getNetworkIdAsync.apply(this._ethereum)];
                    case 1:
                        _a._networkId = _b.sent();
                        return [2 /*return*/, this.getCallback('ethereumNetworkIdInitialized', this._networkId)];
                }
            });
        });
    };
    RadarRelay.prototype.initZeroEx = function () {
        this.zeroEx = new _0x_js_1.ZeroEx(this._ethereum.web3.currentProvider, {
            networkId: this._networkId
        });
        return this.getCallback('zeroExInitialized', this.zeroEx);
    };
    RadarRelay.prototype.initTrade = function () {
        this._trade = new trade_1.Trade(this.zeroEx, this._apiEndpoint, this.account, this.events, this.tokens);
        return this.getCallback('tradeInitialized', this._trade);
    };
    RadarRelay.prototype.initTokensAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this._prevApiEndpoint !== this._apiEndpoint)) return [3 /*break*/, 2];
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, request.get(this._apiEndpoint + "/tokens")];
                    case 1:
                        tokens = _b.apply(_a, [_c.sent()]);
                        this.tokens = new typescript_map_1.TSMap();
                        tokens.map(function (token) {
                            _this.tokens.set(token.address, token);
                        });
                        _c.label = 2;
                    case 2: 
                    // todo index by address
                    return [2 /*return*/, this.getCallback('tokensInitialized', this.tokens)];
                }
            });
        });
    };
    RadarRelay.prototype.initMarketsAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(this._prevApiEndpoint !== this._apiEndpoint)) return [3 /*break*/, 2];
                        _a = this;
                        _c = (_b = JSON).parse;
                        return [4 /*yield*/, request.get(this._apiEndpoint + "/markets")];
                    case 1:
                        _a._markets = _c.apply(_b, [_d.sent()]);
                        _d.label = 2;
                    case 2:
                        // TODO probably not the best place for this
                        this._prevApiEndpoint = this._apiEndpoint;
                        this.markets = new typescript_map_1.TSMap();
                        this._markets.map(function (market) {
                            _this.markets.set(market.id, new market_1.Market(market, _this._apiEndpoint, _this._wsEndpoint, _this._trade));
                        });
                        return [2 /*return*/, this.getCallback('marketsInitialized', this.markets)];
                }
            });
        });
    };
    RadarRelay.prototype.getCallback = function (event, data) {
        var callback = this._lifecycle.promise(event);
        this.events.emit(event, data);
        return callback;
    };
    return RadarRelay;
}());
exports.RadarRelay = RadarRelay;
