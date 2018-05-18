/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelay} from '../src';
import {mockRequests} from './lib/mockRequests';
import BigNumber from 'bignumber.js';

const expect = chai.expect;

describe('RadarRelay.Account', () => {

    let rrsdk;

    before(async () => {
      mockRequests();

      rrsdk = new RadarRelay();
      await rrsdk.initialize({
        password: 'password',
        dataRpcUrl: 'http://localhost:8545',
        radarRelayEndpoint: 'http://localhost:8080/v0'
      });
      console.log('address:', rrsdk.account.address);
    });

    it('getEthBalanceAsync', async () => {
      const balance = await rrsdk.account.getEthBalanceAsync();
      expect(balance.toNumber()).to.be.gt(0);
    });

    it.skip('transferEthAsync', async () => {
      // TODO
    });

    it('wrapEthAsync', async () => {
      const receipt = await rrsdk.account.wrapEthAsync(
        new BigNumber('0.1'), true // wait for tx to mine
      );
      expect(receipt.logs.length).to.be.gt(0);
    });

    it('unwrapEthAsync', async () => {
      const hash = await rrsdk.account.unwrapEthAsync(
        new BigNumber('0.1')
      );
      expect(hash);
    });

    it('getTokenBalanceAsync', async () => {
      const balance = await rrsdk.account.getTokenBalanceAsync(rrsdk.markets.get('ZRX-WETH').baseTokenAddress);
      expect(balance.toNumber()).to.be.gt(0);
    });

    it.skip('transferTokenAsync', async () => {
      // TODO
    });

    it('getTokenAllowanceAsync', async () => {
      const allowance = await rrsdk.account.getTokenAllowanceAsync(
        rrsdk.markets.get('ZRX-WETH').baseTokenAddress
      );
      expect(allowance.toNumber()).to.be.gt(0);
    });

    it.skip('setTokenAllowanceAsync', async () => {
      // TODO
    });

    it('setUnlimitedTokenAllowanceAsync', async () => {
      const hash = await rrsdk.account.setUnlimitedTokenAllowanceAsync(
        rrsdk.markets.get('ZRX-WETH').baseTokenAddress
      );
      expect(hash);
    });

    it('getOrdersAsync', async () => {
      const orders = await rrsdk.account.getOrdersAsync();
      expect(orders.length).to.be.gt(0);
    });

    it('getFillsAsync', async () => {
      const fills = await rrsdk.account.getFillsAsync();
      expect(fills.length).to.be.gt(0);
    });

});