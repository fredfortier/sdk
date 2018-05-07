import Web3 = require('web3');
import BigNumber from 'bignumber.js';
import {EventEmitter} from 'events';
import {promisify} from 'es6-promisify';
import {Web3Builder, WalletManager} from 'vault-manager';
import {InfuraNetwork} from '../node_modules/vault-manager/src/types';
import {CoreTransactionManager} from './lib/TransactionManager';
import { Web3 as Web3Instance } from './lib/Web3';
/**
 * Ethereum
 */
 export class Ethereum {

     public provider: Web3.Provider;
     public networkId: number;
     private web3: Web3;
     private events: EventEmitter;

     constructor(wallet: string | WalletManager, rpcUrl: string = '') {
       this.setProvider(wallet, rpcUrl);
     }

     get defaultAccount(): string {
       return this.web3.eth.defaultAccount;
     }

     /**
      * get the ether balance for an account
      */
     public async getEthBalanceAsync(address: string): Promise<BigNumber> {
       const bal = await promisify(cb => this.web3.eth.getBalance(address, cb))();
       return new BigNumber(bal);
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
     public setDefaultAccount(account: number | string) {
       if (typeof(account) === 'number') {
         if (typeof(this.web3.eth.accounts[account]) === 'undefined') throw new Error('unable to retrieve account');
         this.web3.eth.defaultAccount = this.web3.eth.accounts[account];
       } else {
         let found = false;
         this.web3.eth.accounts.map(address => {
           if (address === account) {
             found = true;
             this.web3.eth.defaultAccount = address;
           }
         });
         if (!found) throw new Error('unable to retrieve account');
       }
     }

     /**
      * Set the rpc provider
      *
      * TODO eventually this can be more sophisticated
      * than simply using an unlocked HTTPProvider
      */
     private async setProvider(wallet: string | WalletManager, rpcUrl: string) {

       if (wallet instanceof WalletManager) {
         // Instantiate the Web3Builder
         const web3Builder = new Web3Builder();

         // Instantiate the TransactionManager. Pass the core wallet instance into the constructor.
         const transactionManager = new CoreTransactionManager(wallet);

         // Set web3
         Web3Instance.Instance = web3Builder.setSignerAndRpcConnection(transactionManager, InfuraNetwork.Kovan);
         this.web3 = Web3Instance.Instance;
         this.provider = this.web3.currentProvider;
       } else {
         const provider = new Web3.providers.HttpProvider(rpcUrl);
         this.web3 = new Web3(provider);
         this.provider = this.web3.currentProvider;
       }

     }

 }
