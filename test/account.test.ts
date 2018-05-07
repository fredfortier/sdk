/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelaySDK} from '../src/index';

const expect = chai.expect;

describe('RadarRelaySDK.Account', () => {

    let rrsdk;

    before(async () => {
      rrsdk = new RadarRelaySDK();
      await rrsdk.initialize('http://35.196.15.153:8100', 'http://localhost:8080/v0');
    });

    it('getEthBalanceAsync', async () => {
      const balance = await rrsdk.account.getEthBalanceAsync();
      expect(balance.toNumber()).to.be.gt(0);
    });

    it.skip('transferEthAsync', async () => {
      // TODO
    });

    it.skip('wrapEthAsync', async () => {
      // TODO
    });

    it.skip('unwrapEthAsync', async () => {
      // TODO
    });

    it('getTokenBalanceAsync', async () => {
      const balance = await rrsdk.account.getTokenBalanceAsync(rrsdk.markets.get('ZRX-WETH').baseTokenAddress);
      expect(balance.toNumber()).to.be.gt(0);
    });

    it.skip('transferTokenAsync', async () => {
      // TODO
    });

    it('getTokenAllowanceAsync', async () => {
      const allowance = await rrsdk.account.getTokenAllowanceAsync(rrsdk.markets.get('ZRX-WETH').baseTokenAddress);
      expect(allowance.toNumber()).to.be.gt(0);
    });

    it.skip('setTokenAllowanceAsync', async () => {
      // TODO
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