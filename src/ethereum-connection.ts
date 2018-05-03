import Web3 = require('web3');
import BigNumber from 'bignumber.js';
import {EventEmitter} from 'events';
import {promisify} from 'es6-promisify';
import {InjectedWeb3Subprovider} from '@0xproject/subproviders';
import * as Web3ProviderEngine from 'web3-provider-engine';
import * as RPCSubprovider from 'web3-provider-engine/subproviders/rpc';

/**
 * EthereumConnection
 */
 export class EthereumConnection {

     public provider: Web3.Provider;
     private web3: Web3;
     private events: EventEmitter;

     constructor(walletRPCUrl: string = '', dataRPCUrl: string = '') {
       this.setProvider(walletRPCUrl, dataRPCUrl);
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
      * Set the rpc providers
      */
     private setProvider(walletRPCUrl: string, dataRPCUrl: string) {
       const providerEngine = new Web3ProviderEngine();

       // Init wallet provider (for signing, accounts, and transactions)
       const walletProvider = new Web3.providers.HttpProvider(walletRPCUrl);
       this.web3 = new Web3(walletProvider);
       providerEngine.addProvider(new InjectedWeb3Subprovider(walletProvider));

       // Init provider for Ethereum data
       providerEngine.addProvider(new RPCSubprovider({ rpcUrl: dataRPCUrl }));
       providerEngine.start();

       this.provider = providerEngine;
     }

 }
