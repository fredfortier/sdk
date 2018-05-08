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
const vault_manager_1 = require("vault-manager");
const subproviders_1 = require("@0xproject/subproviders");
const Web3ProviderEngine = require("web3-provider-engine");
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
/**
 * Ethereum
 */
class Ethereum {
    constructor(wallet, rpcUrl = '') {
        this.setProvider(wallet, rpcUrl);
    }
    /**
     * Get the first account from the connected wallet
     *
     */
    getAccounts() {
        return [this._wallet.getAccounts()[0]];
    }
    /**
     * Entry method for signing a message
     */
    signMessageAsync(unsignedMsg) {
        return this._wallet.signer.signPersonalMessageAsync(unsignedMsg.params.from, unsignedMsg.params.data);
    }
    /**
     * Entry method for signing/sending a transaction
     *
     */
    signTransactionAsync(unsignedTx) {
        return __awaiter(this, void 0, void 0, function* () {
            // Populate the missing tx params
            unsignedTx.params = yield this.populateMissingTxParams(unsignedTx);
            return this._wallet.signer.signTransactionAsync(unsignedTx.params);
        });
    }
    /**
     * get the ether balance for an account
     */
    getEthBalanceAsync(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const bal = yield es6_promisify_1.promisify(cb => this._web3.eth.getBalance(address, cb))();
            return new bignumber_js_1.default(bal);
        });
    }
    /**
     * get the RPC Connections networkId
     */
    getNetworkIdAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this._web3.version.getNetwork((err, id) => {
                    console.log(err, id);
                    resolve(parseInt(id, 10));
                });
            });
            // const networkId: string = await promisify(this._web3.version.getNetwork)();
            // this.networkId = parseInt(networkId, 10);
            // return this.networkId;
        });
    }
    /**
     * set eth defaultAccount to a
     * new address index or address
     */
    setDefaultAccount(account) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (account) === 'number') {
                if (typeof (this._web3.eth.accounts[account]) === 'undefined')
                    throw new Error('unable to retrieve account');
                this._web3.eth.defaultAccount = this._web3.eth.accounts[account];
            }
            else {
                let found = false;
                this._web3.eth.accounts.map(address => {
                    if (address === account) {
                        found = true;
                        this._web3.eth.defaultAccount = address;
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
    setProvider(wallet, rpcUrl) {
        if (wallet instanceof Object) {
            // --- Use vault-manager ---//
            // Instantiate the Web3Builder
            const web3Builder = new vault_manager_1.Web3Builder();
            // Set web3
            this._web3 = web3Builder.setSignerAndRpcConnection(this, rpcUrl);
            this.provider = this._web3.currentProvider;
        }
        else {
            // --- Use unlocked node --- //
            const providerEngine = new Web3ProviderEngine();
            // Init wallet provider (for signing, accounts, and transactions)
            const walletProvider = new Web3.providers.HttpProvider(wallet);
            this._web3 = new Web3(walletProvider);
            providerEngine.addProvider(new subproviders_1.InjectedWeb3Subprovider(walletProvider));
            // Init provider for Ethereum data
            providerEngine.addProvider(new RPCSubprovider({ rpcUrl }));
            providerEngine.start();
            this.provider = providerEngine;
        }
    }
    /**
     * Populates the missing tx params
     */
    populateMissingTxParams(unsignedPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultGasPrice = yield es6_promisify_1.promisify(this._web3.eth.getGasPrice)();
            const gasLimit = yield es6_promisify_1.promisify(this._web3.eth.estimateGas)(unsignedPayload.params);
            const nonce = yield es6_promisify_1.promisify(this._web3.eth.getTransactionCount)(unsignedPayload.params.from, 'pending');
            const filledParams = unsignedPayload.params;
            // Fill Params
            filledParams.gasPrice = `0x${defaultGasPrice.toString(16)}`;
            filledParams.gas = `0x${gasLimit.toString(16)}`;
            filledParams.nonce = `0x${nonce.toString(16)}`;
            return filledParams;
        });
    }
    get defaultAccount() {
        return this._web3.eth.defaultAccount;
    }
}
exports.Ethereum = Ethereum;
