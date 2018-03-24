import Web3 = require('web3');
import BigNumber from 'bignumber.js';
import {EventEmitter} from 'events';
import {promisify} from 'es6-promisify';

/**
 * EthereumConnection
 */
 export class EthereumConnection {

     public provider: Web3.Provider;
     private web3: Web3;
     private events: EventEmitter;

     constructor(ethereumRPCUrl: string = '') {
       this.setProvider(ethereumRPCUrl);
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
       return parseInt(networkId, 10);
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
     private setProvider(ethereumRPCUrl: string) {
       // init ethereum network provider
       const provider = new Web3.providers.HttpProvider(ethereumRPCUrl);
       this.web3 = new Web3(provider);
       this.provider = this.web3.currentProvider;
     }

 }
