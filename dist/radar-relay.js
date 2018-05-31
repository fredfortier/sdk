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
const bignumber_js_1 = require("bignumber.js");
const request = require("request-promise");
// SDK Classes
const sdk_init_lifecycle_1 = require("./sdk-init-lifecycle");
const ethereum_1 = require("./ethereum");
const account_1 = require("./account");
const market_1 = require("./market");
const trade_1 = require("./trade");
bignumber_js_1.default.config({ EXPONENTIAL_AT: 1e+9 });
/**
 * RadarRelay
 */
class RadarRelay {
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
        this.events = new events_1.EventEmitter();
        this._lifecycle = new sdk_init_lifecycle_1.SDKInitLifeCycle(this.events, this.loadPriorityList);
    }
    initialize(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // set the api endpoint outside
            // of the init _lifecycle
            this._apiEndpoint = config.endpoint;
            // setup the _lifecycle function bindings
            this._lifecycle.setup(this);
            // setup ethereum class
            return yield this.setEthereumAsync(config);
        });
    }
    // --- user configurable --- //
    setEthereumAsync(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // init wallet as unlocked rpc node
            let wallet = config.rpcWallet;
            // if a password is passed in
            // instantiate the WalletManager
            if (config.wallet) {
                const walletManager = new vault_manager_1.WalletManager();
                // attempt to load existing core wallet
                try {
                    wallet = yield walletManager.core.loadWalletAsync(config.wallet.password);
                }
                catch (err) {
                    // create a new core wallet
                    wallet = yield walletManager.core.createWalletAsync(config.wallet);
                }
            }
            this._ethereum = new ethereum_1.Ethereum(wallet, config.dataRpcUrl, config.defaultGasPrice);
            return this.getCallback('ethereumNetworkUpdated', this._ethereum);
        });
    }
    // --- not user configurable below this line --- //
    initAccountAsync(account) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._ethereum.setDefaultAccount(account);
            this.account = new account_1.Account(this._ethereum, this.zeroEx, this._apiEndpoint, this.tokens);
            return this.getCallback('accountInitialized', this.account);
        });
    }
    initEthereumNetworkIdAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            this._networkId = yield this._ethereum.getNetworkIdAsync.apply(this._ethereum);
            return this.getCallback('ethereumNetworkIdInitialized', this._networkId);
        });
    }
    initZeroEx() {
        this.zeroEx = new _0x_js_1.ZeroEx(this._ethereum.provider, {
            networkId: this._networkId
        });
        return this.getCallback('zeroExInitialized', this.zeroEx);
    }
    initTrade() {
        this._trade = new trade_1.Trade(this.zeroEx, this._apiEndpoint, this.account, this.events, this.tokens);
        return this.getCallback('tradeInitialized', this._trade);
    }
    initTokensAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            // only fetch if not already fetched
            if (this._prevApiEndpoint !== this._apiEndpoint) {
                const tokens = JSON.parse(yield request.get(`${this._apiEndpoint}/tokens`));
                this.tokens = new Map();
                tokens.map(token => {
                    this.tokens.set(token.address, token);
                });
            }
            // todo index by address
            return this.getCallback('tokensInitialized', this.tokens);
        });
    }
    initMarketsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            // only fetch if not already fetched
            if (this._prevApiEndpoint !== this._apiEndpoint) {
                this._markets = JSON.parse(yield request.get(`${this._apiEndpoint}/markets`));
            }
            // TODO probably not the best place for this
            this._prevApiEndpoint = this._apiEndpoint;
            this.markets = new Map();
            this._markets.map(market => {
                this.markets.set(market.id, new market_1.Market(market, this._apiEndpoint, this._trade));
            });
            return this.getCallback('marketsInitialized', this.markets);
        });
    }
    getCallback(event, data) {
        const callback = this._lifecycle.promise(event);
        this.events.emit(event, data);
        return callback;
    }
}
exports.RadarRelay = RadarRelay;
