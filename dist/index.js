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
const events_1 = require("events");
const _0x_js_1 = require("0x.js");
const request = require("request-promise");
// SDK Classes
const sdk_event_lifecycle_1 = require("./sdk-event-lifecycle");
const ethereum_connection_1 = require("./ethereum-connection");
const account_1 = require("./account");
const market_1 = require("./market");
const trade_executer_1 = require("./trade-executer");
/**
 * RadarRelaySDK
 */
class RadarRelaySDK {
    constructor() {
        this.events = new events_1.EventEmitter();
        this.lifecycle = new sdk_event_lifecycle_1.SDKEventLifeCycle(this.events);
    }
    initialize(ethereumRpcUrl, radarRelayEndpoint = 'https://api.radarrelay.com/v0') {
        return __awaiter(this, void 0, void 0, function* () {
            // don't user setter on initialize, because the event
            // lifecycle will trigger updates of the tradeExecutor
            this.apiEndpoint = radarRelayEndpoint;
            // initialize lifecycle eventloop
            this.events.on('tradeExecutorUpdated', this.updateMarketsAsync.bind(this));
            this.events.on('accountUpdated', this.updateTradeExecutor.bind(this));
            this.events.on('apiEndpointUpdated', this.updateTradeExecutor.bind(this));
            this.events.on('zeroExUpdated', this.setAccount.bind(this, 0)); // default to account 0
            this.events.on('ethereumNetworkIdUpdated', this.updateZeroEx.bind(this));
            this.events.on('ethereumNetworkUpdated', this.updateEthereumNetworkIdAsync.bind(this));
            // set connection
            yield this.setEthereumConnectionAsync(ethereumRpcUrl);
        });
    }
    // --- user configurable --- //
    setEthereumConnectionAsync(ethereumRpcUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // same rpcUrl
            if (this.ethereum && ethereumRpcUrl === this.ethereum.provider.host)
                return;
            this.ethereum = new ethereum_connection_1.EthereumConnection(ethereumRpcUrl);
            this.events.emit('ethereumNetworkUpdated', this.ethereum);
            return this.lifecycle.promise('ethereumNetworkUpdated');
        });
    }
    setAccount(account) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ethereum.setDefaultAccount(account);
            this.account = new account_1.Account(this.ethereum, this.zeroEx);
            this.events.emit('accountUpdated', this.account);
            return this.lifecycle.promise('accountUpdated');
        });
    }
    setApiEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            this.apiEndpoint = endpoint;
            this.events.emit('apiEndpointUpdated', this.apiEndpoint);
            return this.lifecycle.promise('apiEndpointUpdated');
        });
    }
    // --- not user configurable below this line --- //
    updateEthereumNetworkIdAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            this.networkId = yield this.ethereum.getNetworkIdAsync.apply(this.ethereum);
            this.events.emit('ethereumNetworkIdUpdated', this.networkId);
            return this.lifecycle.promise('ethereumNetworkIdUpdated');
        });
    }
    updateZeroEx() {
        return __awaiter(this, void 0, void 0, function* () {
            this.zeroEx = new _0x_js_1.ZeroEx(this.ethereum.provider, {
                networkId: this.networkId
            });
            this.events.emit('zeroExUpdated', this.zeroEx);
            return this.lifecycle.promise('zeroExUpdated');
        });
    }
    updateTradeExecutor() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tradeExecuter = new trade_executer_1.TradeExecuter(this.zeroEx, this.apiEndpoint, this.account, this.events);
            this.events.emit('tradeExecutorUpdated', this.zeroEx);
            return this.lifecycle.promise('tradeExecutorUpdated');
        });
    }
    updateMarketsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const markets = JSON.parse(yield request.get(`${this.apiEndpoint}/markets`));
                this.markets = new Map(markets.map(market => [market.id, new market_1.Market(market, this.tradeExecuter)]));
                this.events.emit('marketsUpdated', this.markets);
            }
            catch (err) {
                console.warn(err);
            }
            return this.lifecycle.promise('marketsUpdated');
        });
    }
}
exports.RadarRelaySDK = RadarRelaySDK;
