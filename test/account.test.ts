/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelay} from '../src';
import {mockRequestsKovan} from './lib/mockRequests';
import BigNumber from 'bignumber.js';

const expect = chai.expect;

describe('RadarRelay.Account', () => {

    let rrsdk;
    let wethAddr;
    let zrxAddr;

    before(async () => {
      mockRequestsKovan();

      rrsdk = new RadarRelay();
      await rrsdk.initialize({
        password: 'password',
        // walletRpcUrl: 'http://35.196.15.153:8100',
        dataRpcUrl: 'https://kovan.infura.io/radar',
        // walletRpcUrl: 'http://localhost:8545',
        // dataRpcUrl: 'http://localhost:8545',
        radarRelayEndpoint: 'http://localhost:8080/v0'
      });

      // set addr for later use
      zrxAddr = rrsdk.markets.get('ZRX-WETH').baseTokenAddress;
      wethAddr = rrsdk.markets.get('ZRX-WETH').quoteTokenAddress;

      console.log('address:', rrsdk.account.address);
    });
    
    it('getOrdersAsync', async () => {
      const orders = await rrsdk.account.getOrdersAsync();
      expect(orders.length).to.be.gt(0);
    });

    it('getFillsAsync', async () => {
      const fills = await rrsdk.account.getFillsAsync();
      expect(fills.length).to.be.gt(0);
    });

    it('getEthBalanceAsync', async () => {
      const balance = await rrsdk.account.getEthBalanceAsync();
      console.log('[eth balance]', balance.toNumber());
      expect(balance.toNumber()).to.be.gt(0);
    });

    it('transferEthAsync', async () => {
      const addresses = await rrsdk.account.getAvailableAddressesAsync();
      const receipt = await rrsdk.account.transferEthAsync(
        addresses[1], new BigNumber('0.01'), true
      );
      expect(receipt.status).to.be.eq(1);
      await rrsdk.account.setAddressAsync(addresses[1]);
      const balance = await rrsdk.account.getEthBalanceAsync();
      expect(balance.toNumber()).to.be.gt(0);
    });

    it('wrapEthAsync', async () => {
      const receipt = await rrsdk.account.wrapEthAsync(
        new BigNumber('0.01'), true // await
      );
      expect(receipt.status).to.be.eq(1);
      expect(receipt.logs.length).to.be.gt(0);
      const wethBal = await rrsdk.account.getTokenBalanceAsync(wethAddr);
      expect(wethBal.toNumber()).to.be.gt(0);
    });

    it('unwrapEthAsync', async () => {
      const wethBal = await rrsdk.account.getTokenBalanceAsync(wethAddr);
      const receipt = await rrsdk.account.unwrapEthAsync(
        wethBal.minus(new BigNumber('0.01')), true // await
      );
      expect(receipt.status).to.be.eq(1);
      expect(receipt.logs.length).to.be.gt(0);
      const wethBalAfter = await rrsdk.account.getTokenBalanceAsync(wethAddr);
      expect(wethBalAfter.toString()).to.be.equal('0.01');
    });

    it('getTokenBalanceAsync', async () => {
      // TODO mint zrx tokens for this address
      const balance = await rrsdk.account.getTokenBalanceAsync(wethAddr);
      expect(balance.toNumber()).to.be.gt(0);
    });

    it('transferTokenAsync', async () => {
      const addresses = await rrsdk.account.getAvailableAddressesAsync();
      const hash = await rrsdk.account.transferTokenAsync(
        wethAddr,
        addresses[1],
        new BigNumber('0.01'),
        true // await
      );

      await rrsdk.account.setAddressAsync(addresses[1]);
      const balance = await rrsdk.account.getTokenBalanceAsync();
      expect(balance.toNumber()).to.be.gt(0);
    });

    it.skip('setTokenAllowanceAsync', async () => {
      // TODO
    });

    it('setUnlimitedTokenAllowanceAsync', async () => {
      const receipt = await rrsdk.account.setUnlimitedTokenAllowanceAsync(
        wethAddr, true
      );
      expect(receipt.status).to.be.eq(1);
    });
    
    it('getTokenAllowanceAsync', async () => {
      const allowance = await rrsdk.account.getTokenAllowanceAsync(
        wethAddr
      );
      expect(allowance.toNumber()).to.be.gt(0);
    });

});