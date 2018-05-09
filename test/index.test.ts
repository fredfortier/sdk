/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

// TODO test is dependent on local running API
// Create MOCK API endpoints

import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelaySDK} from '../src/index';

const expect = chai.expect;

describe('RadarRelaySDK', () => {

    const rrsdk = new RadarRelaySDK();

    rrsdk.events.on('loading', data => {
      // console.log(data);
    });

    let ethereumNetworkUpdated = false;
    let accountInitialized = false;
    let ethereumNetworkIdInitialized = false;
    let zeroExInitialized = false;
    let tokensInitialized = false;
    let marketsInitialized = false;
    let tradeInitialized = false;

    rrsdk.events.on('ethereumNetworkUpdated', network => {
      ethereumNetworkUpdated = true;
    });
    rrsdk.events.on('ethereumNetworkIdInitialized', networkId => {
      ethereumNetworkIdInitialized = true;
    });
    rrsdk.events.on('tokensInitialized', account => {
      tokensInitialized = true;
    });
    rrsdk.events.on('accountInitialized', account => {
      accountInitialized = true;
    });
    rrsdk.events.on('zeroExInitialized', zeroEx => {
      zeroExInitialized = true;
    });
    rrsdk.events.on('tradeInitialized', trade => {
      tradeInitialized = true;
    });
    rrsdk.events.on('marketsInitialized', markets => {
      marketsInitialized = true;
    });

    beforeEach(() => {
      ethereumNetworkUpdated = false;
      tokensInitialized = false;
      accountInitialized = false;
      ethereumNetworkIdInitialized = false;
      zeroExInitialized = false;
      marketsInitialized = false;
      tradeInitialized = false;
    });

    it('properly initializes and updates via event API lifecycle', async () => {

      await rrsdk.initialize({
        password: 'password',
        dataRpcUrl: 'http://35.196.15.153:8100',
        radarRelayEndpoint: 'http://localhost:8080/v0'
      });

      expect(accountInitialized).to.be.true;
      expect(ethereumNetworkUpdated).to.be.true;
      expect(tokensInitialized).to.be.true;
      expect(accountInitialized).to.be.true;
      expect(zeroExInitialized).to.be.true;
      expect(tradeInitialized).to.be.true;
      expect(marketsInitialized).to.be.true;
    });

    it('SDK reloads properly when an account address is changed', async () => {
      const addresses = await rrsdk.account.getAvailableAddressesAsync();
      await rrsdk.account.setAddressAsync(addresses[1]);
      expect(rrsdk.account.address).to.be.eq(addresses[1]);
      // check nested dependency
      expect((rrsdk.trade as any)._account.address).to.be.eq(addresses[1]);
    });

    // TODO may not be necessary
    it('SDK reloads properly when using walletRpcUrl is updated', async () => {

      await rrsdk.setEthereumAsync({
        walletRpcUrl: 'http://35.196.15.153:8100',
        dataRpcUrl: 'http://35.196.15.153:8100'
      });

      expect(accountInitialized).to.be.true;
      expect(ethereumNetworkUpdated).to.be.true;
      expect(tokensInitialized).to.be.true;
      expect(accountInitialized).to.be.true;
      expect(zeroExInitialized).to.be.true;
      expect(tradeInitialized).to.be.true;
      expect(marketsInitialized).to.be.true;
    });

    it.skip('properly handles setting invalid connection');

    it.skip('properly handles setting invalid account');

});
