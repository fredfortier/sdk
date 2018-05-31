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
const wallet_manager_1 = require("@radarrelay/wallet-manager");
const web3_builder_1 = require("@radarrelay/web3-builder");
const subproviders_1 = require("@radarrelay/subproviders");
const types_1 = require("./types");
/**
 * Ethereum
 */
class Ethereum {
    setProvider(type, config) {
        return __awaiter(this, void 0, void 0, function* () {
            this._config = config;
            switch (type) {
                case types_1.WalletType.Local:
                    yield this._setLightWalletProvider(this._config);
                    break;
                case types_1.WalletType.Rpc:
                    this._setRpcWalletProvider(this._config);
                    break;
                case types_1.WalletType.Injected:
                    this._setInjectedWalletProvider(this._config);
                    break;
            }
        });
    }
    get defaultAccount() {
        return this.web3.eth.defaultAccount;
    }
    /**
     * get the ether balance for an account
     *
     * @param {string} address
     */
    getEthBalanceAsync(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const bal = yield es6_promisify_1.promisify(cb => this.web3.eth.getBalance(address, cb))();
            return new bignumber_js_1.default(bal);
        });
    }
    /**
     * transfer ether to another account
     *
     * @param {string} from
     * @param {string} to
     * @param {BigNumber} value
     */
    transferEthAsync(from, to, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { from, to, value: this.web3.toWei(value, 'ether') };
            return yield es6_promisify_1.promisify(cb => this.web3.eth.sendTransaction(params, cb))();
        });
    }
    /**
     * get the RPC Connections networkId
     */
    getNetworkIdAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getNetworkIdAsync');
            const networkId = yield es6_promisify_1.promisify(this.web3.version.getNetwork)();
            console.log(networkId);
            this.networkId = parseInt(networkId, 10);
            return this.networkId;
        });
    }
    /**
     * set eth defaultAccount to a
     * new address index or address
     *
     * @param {number|string}  account  account index or address
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
     * Set the local LightWallet Providers
     *
     * @param {config} LightWalletConfig
     */
    _setLightWalletProvider(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletManager = new wallet_manager_1.WalletManager();
            // attempt to load existing core wallet
            let wallet;
            try {
                wallet = yield walletManager.core.loadWalletAsync(config.wallet.password);
            }
            catch (err) {
                if (err.message === 'NO_WALLET_FOUND') {
                    // create a new core wallet
                    wallet = yield walletManager.core.createWalletAsync(config.wallet);
                }
                else {
                    throw new Error(err.message);
                }
            }
            this.wallet = wallet;
            // --- Use vault-manager ---//
            // Instantiate the Web3Builder
            const web3Builder = new web3_builder_1.Web3Builder();
            // Set web3
            //  To avoid passing a static instance of the Web3 object around
            //  this class implements `TransactionManager` and is passed
            //  in to the `setSignerAndRpcConnection` to init Web3
            this.web3 = web3Builder.createWeb3(new subproviders_1.EthLightwalletSubprovider(wallet._signing, wallet._keystore, wallet._pwDerivedKey), config.dataRpcUrl, true);
            this.provider = this.web3.currentProvider;
        });
    }
    /**
     * Set injected wallet provider
     *
     * @param {config} InjectedWalletConfig
     */
    _setInjectedWalletProvider(config) {
        // TODO Metamask / Parity Signer
    }
    /**
     * Set the rpc wallet providers
     * TODO use Web3Builder
     *
     * @param {config} RpcWalletConfig
     */
    _setRpcWalletProvider(config) {
        // --- Use unlocked node --- //
        const providerEngine = new Web3ProviderEngine();
        // Add nonce subprovider tracker
        // providerEngine.addProvider(new NonceTrackerSubprovider());
        // Init wallet InjectedWeb3Subprovider provider (for signing, accounts, and transactions)
        const walletProvider = new Web3.providers.HttpProvider(config.walletRpcUrl);
        this.web3 = new Web3(walletProvider);
        providerEngine.addProvider(new subproviders_1.InjectedWeb3Subprovider(walletProvider));
        // Init RPCProvider for Ethereum data
        providerEngine.addProvider(new RPCSubprovider({ rpcUrl: config.dataRpcUrl }));
        providerEngine.start();
        this.provider = providerEngine;
    }
}
exports.Ethereum = Ethereum;
