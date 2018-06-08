import Web3 = require('web3');
import BigNumber from 'bignumber.js';
import { promisify } from 'es6-promisify';
import { LightWalletManager } from '@radarrelay/wallet-manager';
import { Web3Builder } from '@radarrelay/web3-builder';
import { EthLightwalletSubprovider, InjectedWeb3Subprovider } from '@radarrelay/subproviders';
import {
  WalletType,
  LightWalletConfig,
  RpcWalletConfig,
  InjectedWalletConfig,
} from './types';
import { WalletError } from '@radarrelay/wallet-manager/dist/types';
import { LightWallet } from '@radarrelay/wallet-manager/dist/wallets/lightwallet';

/**
 * Ethereum
 */
export class Ethereum {

  public wallet: LightWallet;
  public walletType: WalletType;
  public networkId: number;
  public web3: Web3;

  private _config: LightWalletConfig | InjectedWalletConfig | RpcWalletConfig;

  /**
   * Set the provider
   *
   * @param {WalletType}  type  type of wallet
   * @param {LightWalletConfig|InjectedWalletConfig|RpcWalletConfig}  config  wallet config params
   */
  public async setProvider(
    type: WalletType,
    config: LightWalletConfig | InjectedWalletConfig | RpcWalletConfig
  ) {
    this._config = config;

    switch (type) {
      case WalletType.Local:
        await this._setLightWalletProvider(this._config as LightWalletConfig);
        break;
      case WalletType.Rpc:
        this._setRpcWalletProvider(this._config as RpcWalletConfig);
        break;
      case WalletType.Injected:
        this._setInjectedWalletProvider(this._config as InjectedWalletConfig);
        break;
    }
  }

  /**
   * Default account getter
   */
  public get defaultAccount(): string {
    return this.web3.eth.defaultAccount;
  }

  /**
   * get the ether balance for an account
   *
   * @param {string} address
   */
  public async getEthBalanceAsync(address: string): Promise<BigNumber> {
    const bal = await promisify(cb => this.web3.eth.getBalance(address, cb))();
    return new BigNumber(bal);
  }

  /**
   * transfer ether to another account
   *
   * @param {string} from
   * @param {string} to
   * @param {BigNumber} value
   */
  public async transferEthAsync(
    from: string, to: string, value: BigNumber, opts?: { gasPrice: BigNumber, gas: number }
  ): Promise<string> {
    const params: Web3.TxData = { from, to, value: this.web3.toWei(value, 'ether') };
    if (opts.gasPrice) {
      params.gasPrice = opts.gasPrice;
    }
    if (opts.gas) {
      params.gas = opts.gas;
    }
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
   *
   * @param {number|string}  account  account index or address
   */
  public async setDefaultAccount(account: number | string): Promise<void> {
    const accounts = await promisify(this.web3.eth.getAccounts)();
    if (typeof (account) === 'number') {
      if (typeof (accounts[account]) === 'undefined') throw new Error('unable to retrieve account');
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
   * Set the local LightWallet Providers
   *
   * @param {config} LightWalletConfig
   */
  private async _setLightWalletProvider(config: LightWalletConfig) {
    // attempt to load existing light wallet
    let wallet: LightWallet;
    try {
      wallet = await LightWalletManager.loadWalletAsync(config.wallet.password);
    } catch (err) {
      if (err.message === WalletError.NoWalletFound) {
        // create a new light wallet
        wallet = await LightWalletManager.createWalletAsync(config.wallet);
      } else {
        throw new Error(err.message);
      }
    }

    this.wallet = wallet;
    this.web3 = Web3Builder.createWeb3(new EthLightwalletSubprovider(
      wallet.signing, wallet.keystore, wallet.pwDerivedKey
    ), config.dataRpcUrl, true);
  }

  /**
   * Set injected wallet provider
   *
   * @param {config} InjectedWalletConfig
   */
  private _setInjectedWalletProvider(config: InjectedWalletConfig) {
    if (!config.web3) {
      // Default to window.web3
      config.web3 = (window as any).web3;
    }

    if (!config.dataRpcUrl) {
      this.web3 = config.web3;
    } else {
      this.web3 = Web3Builder.createWeb3(
        new InjectedWeb3Subprovider(config.web3.currentProvider),
        config.dataRpcUrl, true);
    }
  }

  /**
   * Set the rpc wallet provider
   *
   * @param {config} RpcWalletConfig
   */
  private _setRpcWalletProvider(config: RpcWalletConfig): void {
    const provider = new Web3.providers.HttpProvider(config.rpcUrl);
    this.web3 = new Web3(provider);
  }
}
