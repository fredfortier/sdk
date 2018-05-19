import Web3ProviderEngine = require('web3-provider-engine');
import RPCSubprovider = require('web3-provider-engine/subproviders/rpc');
import Web3 = require('web3');
import BigNumber from 'bignumber.js';
import {EventEmitter} from 'events';
import {promisify} from 'es6-promisify';
import {Web3Builder, WalletManager} from 'vault-manager';
import {InjectedWeb3Subprovider, NonceTrackerSubprovider} from '@0xproject/subproviders';
import { TransactionManager, Signer, PartialTxParams,
    UnsignedPayload, Wallet } from './types';

/**
 * Ethereum
 */
 export class Ethereum implements TransactionManager {

     public wallet: Wallet;
     public provider: Web3.Provider;
     public networkId: number;
     public web3: Web3;

     private _events: EventEmitter;
     private _gasPrice: BigNumber;
     private _defaultGasPrice: string;

     constructor(
       wallet: string | Wallet,
       rpcUrl: string = '',
       gasPrice?: BigNumber) {
         if (!wallet) throw new Error('Wallet RPC URL or class instance not set.');
         if (!rpcUrl) throw new Error('Data RPC URL not set.');

         this._gasPrice = gasPrice;
         this._setProvider(wallet, rpcUrl);
     }

     public get defaultAccount(): string {
       return this.web3.eth.defaultAccount;
     }

     /**
      * Get accounts from the connected wallet
      */
      public getAccounts(): string[] {
        return this.wallet.getAccounts();
      }

      /**
       * Entry method for signing a message
       */
       public signMessageAsync(unsignedMsg: UnsignedPayload): Promise<string> {
         return this.wallet.signer.signPersonalMessageHashAsync(
           unsignedMsg.params.from, unsignedMsg.params.data
         );
       }

     /**
      * Entry method for signing/sending a transaction
      */
      public async signTransactionAsync(unsignedTx: UnsignedPayload): Promise<string> {
          // set default params if not defined
          if ((unsignedTx.params as PartialTxParams).gasPrice === undefined) {
            (unsignedTx.params as PartialTxParams).gasPrice = await this._getDefaultGasPrice();
          }
          if ((unsignedTx.params as PartialTxParams).gas === undefined) {
            (unsignedTx.params as PartialTxParams).gas = await this._getGasLimit(unsignedTx);
          }
          if ((unsignedTx.params as PartialTxParams).nonce === undefined) {
            (unsignedTx.params as PartialTxParams).nonce = await this._getTxNonce(unsignedTx);
          }

          return this.wallet.signer.signTransactionAsync(unsignedTx.params as PartialTxParams);
      }

     /**
      * get the ether balance for an account
      */
     public async getEthBalanceAsync(address: string): Promise<BigNumber> {
       const bal = await promisify(cb => this.web3.eth.getBalance(address, cb))();
       return new BigNumber(bal);
     }

     /**
      * transfer ether to another account
      */
     public async transferEthAsync(from: string, to: string, value: BigNumber): Promise<string> {
       const params = { from, to, value: this.web3.toWei(value, 'ether') };
       return await promisify(cb => this.web3.eth.sendTransaction(params, cb))();
     }

     /**
      * get the RPC Connections networkId
      */
     public async getNetworkIdAsync(): Promise<number> {
       const networkId: string = await promisify(this.web3.version.getNetwork)();
       this.networkId = parseInt(networkId, 10);
       return this.networkId;
     }

     /**
      * set eth defaultAccount to a
      * new address index or address
      */
     public async setDefaultAccount(account: number | string): Promise<void> {
       const accounts = await promisify(this.web3.eth.getAccounts)();
       if (typeof(account) === 'number') {
         if (typeof(accounts[account]) === 'undefined') throw new Error('unable to retrieve account');
         this.web3.eth.defaultAccount = accounts[account];
       } else {
         let found = false;
         accounts.map(address => {
           if (address === account) {
             found = true;
             this.web3.eth.defaultAccount = address;
           }
         });
         if (!found) throw new Error('unable to retrieve account');
       }
     }

     /**
      * Set the rpc providers
      */
     private _setProvider(wallet: string | Wallet, rpcUrl: string): void {
       if (wallet instanceof Object) {
         this.wallet = (wallet as Wallet);
         // --- Use vault-manager ---//
         // Instantiate the Web3Builder
         const web3Builder = new Web3Builder();

         // Set web3
         //  To avoid passing a static instance of the Web3 object around
         //  this class implements `TransactionManager` and is passed
         //  in to the `setSignerAndRpcConnection` to init Web3
         this.web3 = web3Builder.setSignerAndRpcConnection(this, rpcUrl, new NonceTrackerSubprovider());
         this.provider = this.web3.currentProvider;
       } else {
          // --- Use unlocked node --- //
          const providerEngine = new Web3ProviderEngine();

          // Add nonce subprovider tracker
          // providerEngine.addProvider(new NonceTrackerSubprovider());

          // Init wallet InjectedWeb3Subprovider provider (for signing, accounts, and transactions)
          const walletProvider = new Web3.providers.HttpProvider(wallet);
          this.web3 = new Web3(walletProvider);
          providerEngine.addProvider(new InjectedWeb3Subprovider(walletProvider));

          // Init RPCProvider for Ethereum data
          providerEngine.addProvider(new RPCSubprovider({ rpcUrl }));
          providerEngine.start();

          this.provider = providerEngine;
       }

     }

     /*
      * Set the default gas price
      */
     private async _setDefaultGasPrice(gasPrice?: BigNumber): Promise<void> {
       if (gasPrice) {
         const priceInWei = this.web3.toWei(gasPrice, 'gwei');
         this._defaultGasPrice = `0x${priceInWei.toString(16)}`;
       } else {
         const defaultGasPrice = await promisify(this.web3.eth.getGasPrice.bind(this))();
         this._defaultGasPrice = `0x${defaultGasPrice.toString(16)}`;
       }
     }

      /*
       * Get default gas price
       */
      private async _getDefaultGasPrice(): Promise<string> {
        if (this._defaultGasPrice) {
          return this._defaultGasPrice;
        }
        await this._setDefaultGasPrice(this._gasPrice);
        return this._defaultGasPrice;
      }

      /*
       * Get a tx gas limit estimate
       */
      private async _getGasLimit(unsignedPayload: UnsignedPayload): Promise<string> {
        const gasLimit = await promisify(this.web3.eth.estimateGas.bind(this))(unsignedPayload.params);
        return `0x${gasLimit.toString(16)}`;
      }

      /*
       * Get a tx nonce
       */
      private async _getTxNonce(unsignedPayload: UnsignedPayload): Promise<string> {
        const nonce = await promisify(this.web3.eth.getTransactionCount.bind(this))(
          unsignedPayload.params.from, 'pending'
        );
        return `0x${nonce.toString(16)}`;
      }

 }
