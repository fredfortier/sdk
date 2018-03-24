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
const ethereum_connection_1 = require("./ethereum-connection");
const account_1 = require("./account");
const trade_1 = require("./trade");
/**
 * RadarRelaySDK
 */
class RadarRelaySDK {
    constructor() {
        this.events = new events_1.EventEmitter();
    }
    initialize(ethereumRpcUrl, radarRelayEndpoint = 'https://api.radarrelay.com/v0') {
        return __awaiter(this, void 0, void 0, function* () {
            this.setApiEndpoint(radarRelayEndpoint); // set API endpoint
            yield this.setEthereumConnectionAsync(ethereumRpcUrl);
            this.setAccount(0); // default to account 0
            yield this.updateEthereumNetworkIdAsync(); // retrieve the current networkID
            this.updateZeroEx(); // instantiate the ZeroEx class
            yield this.updateMarketsAsync();
            // setup trade functionality
            this.trade = new trade_1.Trade(this.zeroEx, this.apiEndpoint, this.account, this.events);
        });
    }
    updateMarketsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            // const markets = await request.get(`${this.apiEndpoint}/markets`);
            // this.markets = new Map(markets.map(market => new Market(market)));
            this.events.emit('marketsUpdated', this.markets);
        });
    }
    updateEthereumNetworkIdAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            this.networkId = yield this.ethereum.getNetworkIdAsync.apply(this.ethereum);
            this.events.emit('ethereumNetworkIdUpdated', this.networkId);
        });
    }
    updateZeroEx() {
        this.zeroEx = new _0x_js_1.ZeroEx(this.ethereum.provider, {
            networkId: this.networkId
        });
        this.events.emit('zeroExUpdated', this.zeroEx);
    }
    setEthereumConnectionAsync(ethereumRpcUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // same rpcUrl
            if (this.ethereum && ethereumRpcUrl === this.ethereum.provider.host)
                return;
            this.ethereum = new ethereum_connection_1.EthereumConnection(ethereumRpcUrl);
            this.events.emit('ethereumNetworkUpdated', this.ethereum);
        });
    }
    setAccount(account) {
        this.ethereum.setDefaultAccount(account);
        this.account = new account_1.Account(this.ethereum);
        this.events.emit('accountUpdated', this.account);
    }
    setApiEndpoint(endpoint) {
        this.apiEndpoint = endpoint;
        this.events.emit('apiEndpointUpdated', this.apiEndpoint);
    }
}
exports.RadarRelaySDK = RadarRelaySDK;
