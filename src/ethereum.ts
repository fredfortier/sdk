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

     public wallet: Wallet;
     public provider: Web3.Provider;
     public networkId: number;
     public web3: Web3;

     private _events: EventEmitter;

     constructor(wallet: string | Wallet, rpcUrl: string = '') {
       this.setProvider(wallet, rpcUrl);
     }

     /**
      * Get accounts from the connected wallet
      */
      public getAccounts() {
        return this.wallet.getAccounts();
      }

      /**
       * Entry method for signing a message
       */
       public signMessageAsync(unsignedMsg: UnsignedPayload) {
         return this.wallet.signer.signPersonalMessageAsync(unsignedMsg.params.from, unsignedMsg.params.data);
       }

     /**
      * Entry method for signing/sending a transaction
      */
      public async signTransactionAsync(unsignedTx: UnsignedPayload) {
        // Populate the missing tx params
        unsignedTx.params = await this.populateMissingTxParams(unsignedTx);
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
     public async transferEthAsync(from: string, to: string, value: BigNumber): Promise<BigNumber> {
       return await promisify(this.web3.eth.sendTransaction)({
          from,
          to,
          value: this.web3.toWei(value, 'ether')
        });
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
     public async setDefaultAccount(account: number | string) {
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
     private setProvider(wallet: string | Wallet, rpcUrl: string) {
       if (wallet instanceof Object) {
         this.wallet = (wallet as Wallet);
         // --- Use vault-manager ---//
         // Instantiate the Web3Builder
         const web3Builder = new Web3Builder();

         // Set web3
         this.web3 = web3Builder.setSignerAndRpcConnection(this, rpcUrl);
         this.provider = this.web3.currentProvider;
       } else {
          // --- Use unlocked node --- //
          const providerEngine = new Web3ProviderEngine();

          // Init wallet provider (for signing, accounts, and transactions)
          const walletProvider = new Web3.providers.HttpProvider(wallet);
          this.web3 = new Web3(walletProvider);
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
        const defaultGasPrice = await promisify<BigNumber>(this.web3.eth.getGasPrice)();
        const gasLimit = await promisify<number>(this.web3.eth.estimateGas)(unsignedPayload.params);

        const nonce = await promisify<number>(
          this.web3.eth.getTransactionCount
        )(unsignedPayload.params.from, 'pending');

        const filledParams = unsignedPayload.params as PartialTxParams;

        // Fill Params
        filledParams.gasPrice = `0x${defaultGasPrice.toString(16)}`;
        filledParams.gas = `0x${gasLimit.toString(16)}`;
        filledParams.nonce = `0x${nonce.toString(16)}`;

        return filledParams;
      }

     get defaultAccount(): string {
       return this.web3.eth.defaultAccount;
     }

 }
