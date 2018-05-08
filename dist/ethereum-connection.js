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
const subproviders_1 = require("@0xproject/subproviders");
const Web3ProviderEngine = require("web3-provider-engine");
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
/**
 * Ethereum
 */
<<<<<<< Updated upstream
class EthereumConnection {
    constructor(walletRPCUrl = '', dataRPCUrl = '') {
        this.setProvider(walletRPCUrl, dataRPCUrl);
=======
class Ethereum {
    constructor(ethereumRPCUrl = '') {
        this.setProvider(ethereumRPCUrl);
>>>>>>> Stashed changes
    }
    get defaultAccount() {
        return this.web3.eth.defaultAccount;
    }
    /**
     * get the ether balance for an account
     */
    getEthBalanceAsync(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const bal = yield es6_promisify_1.promisify(cb => this.web3.eth.getBalance(address, cb))();
            return new bignumber_js_1.default(bal);
        });
    }
    /**
     * get the RPC Connections networkId
     */
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
                throw new Error('unable to retrieve account');
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
                throw new Error('unable to retrieve account');
        }
    }
    /**
     * Set the rpc providers
     */
    setProvider(walletRPCUrl, dataRPCUrl) {
        const providerEngine = new Web3ProviderEngine();
        // Init wallet provider (for signing, accounts, and transactions)
        const walletProvider = new Web3.providers.HttpProvider(walletRPCUrl);
        this.web3 = new Web3(walletProvider);
        providerEngine.addProvider(new subproviders_1.InjectedWeb3Subprovider(walletProvider));
        // Init provider for Ethereum data
        providerEngine.addProvider(new RPCSubprovider({ rpcUrl: dataRPCUrl }));
        providerEngine.start();
        this.provider = providerEngine;
    }
}
exports.Ethereum = Ethereum;
