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
var ZeroEx_1 = require("./ZeroEx");
var events_1 = require("events");
var types_1 = require("./types");
var bignumber_js_1 = require("bignumber.js");
var request = require("request-promise");
var typescript_map_1 = require("typescript-map");
// SDK Classes
var SdkInitLifeCycle_1 = require("./SdkInitLifeCycle");
var Ethereum_1 = require("./Ethereum");
var Market_1 = require("./Market");
var Trade_1 = require("./Trade");
var constants_1 = require("./constants");
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
    function RadarRelay(wallet, walletType, config) {
        /**
         * The load priority list maintains the function call
         * priority for each init method in the RadarRelaySDK class.
         * It is utilized by the SdkInitLifeCycle
         *
         * This list is configurable if additional init methods are necessary
         */
        this.loadPriorityList = [
            {
                event: types_1.EventName.EthereumInitialized,
                func: this.initEthereumNetworkIdAsync
            }, {
                event: types_1.EventName.EthereumNetworkIdInitialized,
                func: this.initZeroEx
            }, {
                event: types_1.EventName.ZeroExInitialized,
                func: this.initTokensAsync
            }, {
                event: types_1.EventName.TokensInitialized,
                func: this.initAccountAsync,
                args: [0] // pass default account of 0 to setAccount
            }, {
                event: types_1.EventName.AccountInitialized,
                func: this.initTrade
            }, {
                event: types_1.EventName.TradeInitialized,
                func: this.initMarketsAsync
            }, {
                event: types_1.EventName.MarketsInitialized,
                func: undefined
            }
        ];
        this._wallet = wallet;
        this._walletType = walletType;
        this._config = config;
        // instantiate event handler
        this.events = new events_1.EventEmitter();
        // instantiate ethereum class
        this._ethereum = new Ethereum_1.Ethereum();
        // setup the _lifecycle
        this._lifecycle = new SdkInitLifeCycle_1.SdkInitLifeCycle(this.events, this.loadPriorityList, config.sdkInitializationTimeoutMs);
        this._lifecycle.setup(this);
    }
    /**
     * Initialize the SDK
     *
     * @param {Config}  config  The wallet configuration
     */
    RadarRelay.prototype.initializeAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ethereum.setProvider(this._walletType, this._config)];
                    case 1:
                        _a.sent();
                        // Allow access to web3 object
                        this.web3 = this._ethereum.web3;
                        return [4 /*yield*/, this.setEndpointOrThrowAsync()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getCallback(types_1.EventName.EthereumInitialized, this._ethereum)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    // --- not user configurable below this line --- //
    RadarRelay.prototype.initAccountAsync = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ethereum.setDefaultAccount(address)];
                    case 1:
                        _a.sent();
                        this.account = new this._wallet({
                            ethereum: this._ethereum,
                            events: this.events,
                            zeroEx: this.zeroEx,
                            endpoint: this._config.radarRestEndpoint,
                            tokens: this.tokens
                        });
                        return [2 /*return*/, this.getCallback(types_1.EventName.AccountInitialized, this.account)];
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
                        return [2 /*return*/, this.getCallback(types_1.EventName.EthereumNetworkIdInitialized, this._networkId)];
                }
            });
        });
    };
    RadarRelay.prototype.initZeroEx = function () {
        this.zeroEx = new ZeroEx_1.ZeroEx(this._ethereum.web3.currentProvider, {
            networkId: this._networkId
        });
        return this.getCallback(types_1.EventName.ZeroExInitialized, this.zeroEx);
    };
    RadarRelay.prototype.initTrade = function () {
        this._trade = new Trade_1.Trade(this.zeroEx, this._config.radarRestEndpoint, this.account, this.events, this.tokens);
        return this.getCallback(types_1.EventName.TradeInitialized, this._trade);
    };
    RadarRelay.prototype.initTokensAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this._prevApiEndpoint !== this._config.radarRestEndpoint)) return [3 /*break*/, 2];
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, request.get(this._config.radarRestEndpoint + "/tokens")];
                    case 1:
                        tokens = _b.apply(_a, [_c.sent()]);
                        this.tokens = new typescript_map_1.TSMap();
                        tokens.map(function (token) {
                            _this.tokens.set(token.address, token);
                        });
                        _c.label = 2;
                    case 2: 
                    // todo index by address
                    return [2 /*return*/, this.getCallback(types_1.EventName.TokensInitialized, this.tokens)];
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
                        if (!(this._prevApiEndpoint !== this._config.radarRestEndpoint)) return [3 /*break*/, 2];
                        // TODO lazy load these!
                        _a = this;
                        _c = (_b = JSON).parse;
                        return [4 /*yield*/, request.get(this._config.radarRestEndpoint + "/markets?per_page=500")];
                    case 1:
                        // TODO lazy load these!
                        _a._markets = _c.apply(_b, [_d.sent()]);
                        _d.label = 2;
                    case 2:
                        // TODO probably not the best place for this
                        this._prevApiEndpoint = this._config.radarRestEndpoint;
                        this.markets = new typescript_map_1.TSMap();
                        this._markets.map(function (market) {
                            _this.markets.set(market.id, new Market_1.Market(market, _this._config.radarRestEndpoint, _this._config.radarWebsocketEndpoint, _this._trade));
                        });
                        return [2 /*return*/, this.getCallback(types_1.EventName.MarketsInitialized, this.markets)];
                }
            });
        });
    };
    RadarRelay.prototype.getCallback = function (event, data) {
        var callback = this._lifecycle.promise(event);
        this.events.emit(event, data);
        return callback;
    };
    RadarRelay.prototype.setEndpointOrThrowAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var walletConfig, _a, radarRestEndpoint, radarWebsocketEndpoint, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        walletConfig = this._config;
                        if (!(this._walletType === types_1.WalletType.Injected && !walletConfig.dataRpcUrl)) return [3 /*break*/, 2];
                        _b = constants_1.RADAR_RELAY_ENDPOINTS;
                        return [4 /*yield*/, this._ethereum.getNetworkIdAsync()];
                    case 1:
                        _a = _b.apply(void 0, [_c.sent()]), radarRestEndpoint = _a.radarRestEndpoint, radarWebsocketEndpoint = _a.radarWebsocketEndpoint;
                        this._config.radarRestEndpoint = radarRestEndpoint;
                        this._config.radarWebsocketEndpoint = radarWebsocketEndpoint;
                        _c.label = 2;
                    case 2:
                        if (!this._config.radarRestEndpoint || !this._config.radarWebsocketEndpoint) {
                            throw new Error(types_1.SdkError.InvalidOrMissingEndpoints);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return RadarRelay;
}());
exports.RadarRelay = RadarRelay;
