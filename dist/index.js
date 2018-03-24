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
    /**
     * Initialize the SDK
     */
    initialize(ethereumRpcUrl, radarRelayEndpoint = 'https://api.radarrelay.com/v0') {
        return __awaiter(this, void 0, void 0, function* () {
            this.setApiEndpoint(radarRelayEndpoint);
            yield this.setEthereumConnectionAsync(ethereumRpcUrl);
            yield this.fetchMarketsAsync(radarRelayEndpoint);
            // setup trade functionality
            this.trade = new trade_1.Trade(this.ethereum, this.networkId, this.apiEndpoint, this.account, this.events);
        });
    }
    /**
     * Fetch our markets from the API
     */
    fetchMarketsAsync(radarRelayEndpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            // const markets = await request.get(`${radarRelayEndpoint}/markets`);
            // this.markets = new Map(markets.map(market => new Market(market)));
            this.events.emit('marketsUpdated', this.markets);
        });
    }
    /**
     * Set the Ethereum RPC connection
     */
    setEthereumConnectionAsync(ethereumRpcUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // same rpcUrl
            if (this.ethereum && ethereumRpcUrl === this.ethereum.provider.host)
                return;
            this.ethereum = new ethereum_connection_1.EthereumConnection(ethereumRpcUrl);
            this.networkId = yield this.ethereum.getNetworkIdAsync.apply(this.ethereum);
            this.events.emit('networkUpdated', this.ethereum);
            // default to account 0
            this.setAccount(0);
        });
    }
    setAccount(account) {
        this.ethereum.setDefaultAccount(account);
        this.account = new account_1.Account(this.ethereum);
        this.events.emit('accountUpdated', this.account);
    }
    setApiEndpoint(endpoint) {
        this.apiEndpoint = endpoint;
    }
}
exports.RadarRelaySDK = RadarRelaySDK;
