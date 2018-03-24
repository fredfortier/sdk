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
const Web3 = require("web3");
const bignumber_js_1 = require("bignumber.js");
const es6_promisify_1 = require("es6-promisify");
/**
 * EthereumConnection
 */
class EthereumConnection {
    constructor(ethereumRPCUrl = '') {
        this.setProvider(ethereumRPCUrl);
    }
    get defaultAccount() {
        return this.web3.eth.defaultAccount;
    }
    getEthBalanceAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const bal = yield es6_promisify_1.promisify(cb => this.web3.eth.getBalance(this.defaultAccount, cb))();
            return new bignumber_js_1.default(bal);
        });
    }
    getNetworkIdAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const networkId = yield es6_promisify_1.promisify(this.web3.version.getNetwork)();
            return parseInt(networkId, 10);
        });
    }
    /**
     * set eth defaultAccount to a
     * new address index or address
     */
    setDefaultAccount(account) {
        if (typeof (account) === 'number') {
            if (typeof (this.web3.eth.accounts[account]) === 'undefined')
                throw new Error('invalid account');
            this.web3.eth.defaultAccount = this.web3.eth.accounts[account];
        }
        else {
            let found = false;
            this.web3.eth.accounts.map(address => {
                if (address === account) {
                    found = true;
                    this.web3.eth.defaultAccount = address;
                }
            });
            if (!found)
                throw new Error('invalid account');
        }
    }
    /**
     * Set the rpc provider
     *
     * TODO eventually this can be more sophisticated
     * than simply using an unlocked HTTPProvider
     */
    setProvider(ethereumRPCUrl) {
        // init ethereum network provider
        const provider = new Web3.providers.HttpProvider(ethereumRPCUrl);
        this.web3 = new Web3(provider);
        this.provider = this.web3.currentProvider;
    }
}
exports.EthereumConnection = EthereumConnection;
