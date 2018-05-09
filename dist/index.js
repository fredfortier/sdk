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
const vault_manager_1 = require("vault-manager");
const events_1 = require("events");
const request = require("request-promise");
// SDK Classes
const sdk_init_lifecycle_1 = require("./sdk-init-lifecycle");
const ethereum_1 = require("./ethereum");
const account_1 = require("./account");
const market_1 = require("./market");
const trade_1 = require("./trade");
/**
 * RadarRelaySDK
 */
class RadarRelaySDK {
    constructor() {
        /**
         * The load priority list maintains the function call
         * priority for each init method in the RadarRelaySDK class.
         * It is utilized by the SDKInitLifeCycle
         *
         * This list is configurable if additional init methods are necessary
         */
        this.loadPriorityList = [
            {
                event: 'ethereumNetworkUpdated',
                func: this.initEthereumNetworkIdAsync
            }, {
                event: 'ethereumNetworkIdInitialized',
                func: this.initZeroEx
            }, {
                event: 'zeroExInitialized',
                func: this.initTokensAsync
            }, {
                event: 'apiEndpointUpdated',
                func: this.initTokensAsync
            }, {
                event: 'tokensInitialized',
                func: this.setAccount,
                args: [0] // pass default account of 0 to setAccount
            }, {
                event: 'accountUpdated',
                func: this.initTrade
            }, {
                event: 'tradeInitialized',
                func: this.initMarketsAsync
            }, {
                event: 'marketsInitialized',
                func: undefined
            }
        ];
        this.events = new events_1.EventEmitter();
        this.lifecycle = new sdk_init_lifecycle_1.SDKInitLifeCycle(this.events, this.loadPriorityList);
    }
    initialize(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // setting the API endpoint outside of the lifecycle
            // prevents the TradeExecuter class from loading twice
            this.apiEndpoint = config.radarRelayEndpoint;
            // setup the lifecycle function bindings
            this.lifecycle.setup(this);
            let wallet = config.walletRpcUrl;
            if (config.password) {
                // Instantiate the WalletManager
                const walletManager = new vault_manager_1.WalletManager();
                // Create a new core wallet
                wallet = yield walletManager.core.createWalletAsync({ password: config.password });
            }
            // set connection
            return yield this.setEthereumAsync(wallet, config.dataRpcUrl);
        });
    }
    // --- user configurable --- //
    setEthereumAsync(wallet, rpcUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // same rpcUrl
            if (this.ethereum && rpcUrl === this.ethereum.provider.host)
                return;
            this.ethereum = new ethereum_1.Ethereum(wallet, rpcUrl);
            return this.getCallback('ethereumNetworkUpdated', this.ethereum);
        });
    }
    setAccount(account) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ethereum.setDefaultAccount(account);
            this.account = new account_1.Account(this.ethereum, this.zeroEx, this.apiEndpoint, this.tokens);
            return this.getCallback('accountUpdated', this.account);
        });
    }
    setApiEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            this.apiEndpoint = endpoint;
            return this.getCallback('apiEndpointUpdated', this.apiEndpoint);
        });
    }
    // --- not user configurable below this line --- //
    initEthereumNetworkIdAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            this._networkId = yield this.ethereum.getNetworkIdAsync.apply(this.ethereum);
            return this.getCallback('ethereumNetworkIdInitialized', this._networkId);
        });
    }
    initZeroEx() {
        this.zeroEx = new _0x_js_1.ZeroEx(this.ethereum.provider, {
            networkId: this._networkId
        });
        return this.getCallback('zeroExInitialized', this.zeroEx);
    }
    initTrade() {
        this.trade = new trade_1.Trade(this.zeroEx, this.apiEndpoint, this.account, this.events);
        return this.getCallback('tradeInitialized', this.trade);
    }
    initTokensAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            // only fetch if not already fetched
            if (this._prevApiEndpoint !== this.apiEndpoint) {
                this.tokens = JSON.parse(yield request.get(`${this.apiEndpoint}/tokens`));
            }
            // todo index by address
            return this.getCallback('tokensInitialized', this.tokens);
        });
    }
    initMarketsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            // only fetch if not already fetched
            if (this._prevApiEndpoint !== this.apiEndpoint) {
                this._markets = JSON.parse(yield request.get(`${this.apiEndpoint}/markets`));
            }
            // TODO probably not the best place for this
            this._prevApiEndpoint = this.apiEndpoint;
            this.markets = new Map(this._markets.map(market => [market.id, new market_1.Market(market, this.apiEndpoint, this.trade)]));
            return this.getCallback('marketsInitialized', this.markets);
        });
    }
    getCallback(event, data) {
        const callback = this.lifecycle.promise(event);
        this.events.emit(event, data);
        return callback;
    }
}
exports.RadarRelaySDK = RadarRelaySDK;
