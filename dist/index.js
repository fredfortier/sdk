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
// 'http://35.196.15.153:8545'
/**
 * RadarRelaySDK
 */
class RadarRelaySDK {
    constructor() {
        this.events = new events_1.EventEmitter();
    }
    setEthereumConnectionAsync(ethereumRpcUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ethereum = new ethereum_connection_1.EthereumConnection(ethereumRpcUrl);
            this.networkId = yield this.ethereum.getNetworkIdAsync.apply(this.ethereum);
            this.zeroEx = new _0x_js_1.ZeroEx(this.ethereum.provider, {
                networkId: this.networkId
            });
            this.events.emit('networkUpdated', this.ethereum, this.zeroEx);
            // default to account 0
            this.setAccount(0);
        });
    }
    setAccount(account) {
        this.ethereum.setDefaultAccount(account);
        this.account = new account_1.Account(this.ethereum);
        this.events.emit('accountUpdated', this.account);
    }
}
exports.RadarRelaySDK = RadarRelaySDK;
