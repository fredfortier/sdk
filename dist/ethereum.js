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
const Web3ProviderEngine = require("web3-provider-engine");
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3 = require("web3");
const bignumber_js_1 = require("bignumber.js");
const es6_promisify_1 = require("es6-promisify");
const vault_manager_1 = require("vault-manager");
const subproviders_1 = require("@0xproject/subproviders");
/**
 * Ethereum
 */
class Ethereum {
    constructor(wallet, rpcUrl = '', gasPrice) {
        if (!wallet)
            throw new Error('Wallet RPC URL or class instance not set.');
        if (!rpcUrl)
            throw new Error('Data RPC URL not set.');
        this._gasPrice = gasPrice;
        this._setProvider(wallet, rpcUrl);
    }
    get defaultAccount() {
        return this.web3.eth.defaultAccount;
    }
    /**
     * Get accounts from the connected wallet
     */
    getAccounts() {
        return this.wallet.getAccounts();
    }
    /**
     * Entry method for signing a message
     */
    signMessageAsync(unsignedMsg) {
        return this.wallet.signer.signPersonalMessageHashAsync(unsignedMsg.params.from, unsignedMsg.params.data);
    }
    /**
     * Entry method for signing/sending a transaction
     */
    signTransactionAsync(unsignedTx) {
        return __awaiter(this, void 0, void 0, function* () {
            // set default params if not defined
            if (unsignedTx.params.gasPrice === undefined) {
                unsignedTx.params.gasPrice = yield this._getDefaultGasPrice();
            }
            if (unsignedTx.params.gas === undefined) {
                unsignedTx.params.gas = yield this._getGasLimit(unsignedTx);
            }
            if (unsignedTx.params.nonce === undefined) {
                unsignedTx.params.nonce = yield this._getTxNonce(unsignedTx);
            }
            return this.wallet.signer.signTransactionAsync(unsignedTx.params);
        });
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
     * transfer ether to another account
     */
    transferEthAsync(from, to, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield es6_promisify_1.promisify(this.web3.eth.sendTransaction)({
                from,
                to,
                value: this.web3.toWei(value, 'ether')
            });
        });
    }
    /**
     * get the RPC Connections networkId
     */
    getNetworkIdAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const networkId = yield es6_promisify_1.promisify(this.web3.version.getNetwork)();
            this.networkId = parseInt(networkId, 10);
            return this.networkId;
        });
    }
    /**
     * set eth defaultAccount to a
     * new address index or address
     */
    setDefaultAccount(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield es6_promisify_1.promisify(this.web3.eth.getAccounts)();
            if (typeof (account) === 'number') {
                if (typeof (accounts[account]) === 'undefined')
                    throw new Error('unable to retrieve account');
                this.web3.eth.defaultAccount = accounts[account];
            }
            else {
                let found = false;
                accounts.map(address => {
                    if (address === account) {
                        found = true;
                        this.web3.eth.defaultAccount = address;
                    }
                });
                if (!found)
                    throw new Error('unable to retrieve account');
            }
        });
    }
    /**
     * Set the rpc providers
     */
    _setProvider(wallet, rpcUrl) {
        if (wallet instanceof Object) {
            this.wallet = wallet;
            // --- Use vault-manager ---//
            // Instantiate the Web3Builder
            const web3Builder = new vault_manager_1.Web3Builder();
            // Set web3
            //  To avoid passing a static instance of the Web3 object around
            //  this class implements `TransactionManager` and is passed
            //  in to the `setSignerAndRpcConnection` to init Web3
            this.web3 = web3Builder.setSignerAndRpcConnection(this, rpcUrl, new subproviders_1.NonceTrackerSubprovider());
            this.provider = this.web3.currentProvider;
        }
        else {
            // --- Use unlocked node --- //
            const providerEngine = new Web3ProviderEngine();
            // Init wallet InjectedWeb3Subprovider provider (for signing, accounts, and transactions)
            const walletProvider = new Web3.providers.HttpProvider(wallet);
            this.web3 = new Web3(walletProvider);
            providerEngine.addProvider(new subproviders_1.InjectedWeb3Subprovider(walletProvider));
            // Init RPCProvider for Ethereum data
            providerEngine.addProvider(new RPCSubprovider({ rpcUrl }));
            providerEngine.start();
            this.provider = providerEngine;
        }
    }
    /*
     * Set the default gas price
     */
    _setDefaultGasPrice(gasPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            if (gasPrice) {
                const priceInWei = this.web3.toWei(gasPrice, 'gwei');
                this._defaultGasPrice = `0x${priceInWei.toString(16)}`;
            }
            else {
                const defaultGasPrice = yield es6_promisify_1.promisify(this.web3.eth.getGasPrice.bind(this))();
                this._defaultGasPrice = `0x${defaultGasPrice.toString(16)}`;
            }
        });
    }
    /*
     * Get default gas price
     */
    _getDefaultGasPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._defaultGasPrice) {
                return this._defaultGasPrice;
            }
            yield this._setDefaultGasPrice(this._gasPrice);
            return this._defaultGasPrice;
        });
    }
    /*
     * Get a tx gas limit estimate
     */
    _getGasLimit(unsignedPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const gasLimit = yield es6_promisify_1.promisify(this.web3.eth.estimateGas.bind(this))(unsignedPayload.params);
            return `0x${gasLimit.toString(16)}`;
        });
    }
    /*
     * Get a tx nonce
     */
    _getTxNonce(unsignedPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const nonce = yield es6_promisify_1.promisify(this.web3.eth.getTransactionCount.bind(this))(unsignedPayload.params.from, 'pending');
            return `0x${nonce.toString(16)}`;
        });
    }
}
exports.Ethereum = Ethereum;
