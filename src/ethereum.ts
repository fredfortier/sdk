import * as Web3ProviderEngine from 'web3-provider-engine';
import * as RPCSubprovider from 'web3-provider-engine/subproviders/rpc';
import Web3 = require('web3');
import BigNumber from 'bignumber.js';
import {EventEmitter} from 'events';
import {promisify} from 'es6-promisify';
import {Web3Builder, WalletManager} from 'vault-manager';
import {InjectedWeb3Subprovider} from '@0xproject/subproviders';
import { TransactionManager, Signer, PartialTxParams,
  UnsignedPayload, Wallet } from './types';

/**
 * Ethereum
 */
 export class Ethereum implements TransactionManager {

     public provider: Web3.Provider;
     public networkId: number;

     private _web3: Web3;
     private _wallet: Wallet;
     private _events: EventEmitter;

     constructor(wallet: string | Wallet, rpcUrl: string = '') {
       this.setProvider(wallet, rpcUrl);
     }

     /**
      * Get the first account from the connected wallet
      *
      */
      public getAccounts() {
        return [this._wallet.getAccounts()[0]];
      }

      /**
       * Entry method for signing a message
       */
       public signMessageAsync(unsignedMsg: UnsignedPayload) {
         return this._wallet.signer.signPersonalMessageAsync(unsignedMsg.params.from, unsignedMsg.params.data);
       }

     /**
      * Entry method for signing/sending a transaction
      *
      */
      public async signTransactionAsync(unsignedTx: UnsignedPayload) {
        // Populate the missing tx params
        unsignedTx.params = await this.populateMissingTxParams(unsignedTx);

        return this._wallet.signer.signTransactionAsync(unsignedTx.params as PartialTxParams);
      }

     /**
      * get the ether balance for an account
      */
     public async getEthBalanceAsync(address: string): Promise<BigNumber> {
       const bal = await promisify(cb => this._web3.eth.getBalance(address, cb))();
       return new BigNumber(bal);
     }

     /**
      * get the RPC Connections networkId
      */
     public async getNetworkIdAsync(): Promise<number> {

       return new Promise<number>((resolve, reject) => {
         this._web3.version.getNetwork((err, id) => {
           console.log(err, id);
           resolve(parseInt(id, 10));
         });
       });

       // const networkId: string = await promisify(this._web3.version.getNetwork)();
       // this.networkId = parseInt(networkId, 10);
       // return this.networkId;
     }

     /**
      * set eth defaultAccount to a
      * new address index or address
      */
     public async setDefaultAccount(account: number | string) {
       if (typeof(account) === 'number') {
         if (typeof(this._web3.eth.accounts[account]) === 'undefined') throw new Error('unable to retrieve account');
         this._web3.eth.defaultAccount = this._web3.eth.accounts[account];
       } else {
         let found = false;
         this._web3.eth.accounts.map(address => {
           if (address === account) {
             found = true;
             this._web3.eth.defaultAccount = address;
           }
         });
         if (!found) throw new Error('unable to retrieve account');
       }
     }

     /**
      * Set the rpc providers
      */
     private setProvider(wallet: string | Wallet, rpcUrl: string) {
       if (wallet instanceof Object) {
         // --- Use vault-manager ---//
         // Instantiate the Web3Builder
         const web3Builder = new Web3Builder();

         // Set web3
         this._web3 = web3Builder.setSignerAndRpcConnection(this, rpcUrl);
         this.provider = this._web3.currentProvider;
       } else {
          // --- Use unlocked node --- //
          const providerEngine = new Web3ProviderEngine();

          // Init wallet provider (for signing, accounts, and transactions)
          const walletProvider = new Web3.providers.HttpProvider(wallet);
          this._web3 = new Web3(walletProvider);
          providerEngine.addProvider(new InjectedWeb3Subprovider(walletProvider));

          // Init provider for Ethereum data
          providerEngine.addProvider(new RPCSubprovider({ rpcUrl }));
          providerEngine.start();

          this.provider = providerEngine;
       }

     }

     /**
      * Populates the missing tx params
      */
      private async populateMissingTxParams(unsignedPayload: UnsignedPayload): Promise<PartialTxParams> {
        const defaultGasPrice = await promisify<BigNumber>(this._web3.eth.getGasPrice)();
        const gasLimit = await promisify<number>(this._web3.eth.estimateGas)(unsignedPayload.params);

        const nonce = await promisify<number>(
          this._web3.eth.getTransactionCount
        )(unsignedPayload.params.from, 'pending');

        const filledParams = unsignedPayload.params as PartialTxParams;

        // Fill Params
        filledParams.gasPrice = `0x${defaultGasPrice.toString(16)}`;
        filledParams.gas = `0x${gasLimit.toString(16)}`;
        filledParams.nonce = `0x${nonce.toString(16)}`;

        return filledParams;
      }

     get defaultAccount(): string {
       return this._web3.eth.defaultAccount;
     }

 }
