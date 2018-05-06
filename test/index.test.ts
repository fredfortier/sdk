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

    // rrsdk.events.on('loading', data => {
    //   console.log(data);
    // });

    let apiEndpointUpdated = false;
    let ethereumNetworkUpdated = false;
    let accountUpdated = false;
    let ethereumNetworkIdInitialized = false;
    let zeroExInitialized = false;
    let tokensInitialized = false;
    let marketsInitialized = false;
    let tradeInitialized = false;

    beforeEach(() => {
      apiEndpointUpdated = false;
      ethereumNetworkUpdated = false;
      tokensInitialized = false;
      accountUpdated = false;
      ethereumNetworkIdInitialized = false;
      zeroExInitialized = false;
      marketsInitialized = false;
      tradeInitialized = false;
    });

    it.only('properly initializes and updates via event API lifecycle', async () => {
      rrsdk.events.on('ethereumNetworkUpdated', network => {
        ethereumNetworkUpdated = true;
      });
      rrsdk.events.on('ethereumNetworkIdInitialized', networkId => {
        ethereumNetworkIdInitialized = true;
      });
      rrsdk.events.on('tokensInitialized', account => {
        tokensInitialized = true;
      });
      rrsdk.events.on('accountUpdated', account => {
        accountUpdated = true;
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
      await rrsdk.initialize(
        'http://localhost:8545',
        'http://localhost:8545',
        'http://localhost:8080/v0');

      expect(accountUpdated).to.be.true;
      expect(ethereumNetworkUpdated).to.be.true;
      expect(tokensInitialized).to.be.true;
      expect(accountUpdated).to.be.true;
      expect(zeroExInitialized).to.be.true;
      expect(tradeInitialized).to.be.true;
      expect(marketsInitialized).to.be.true;
      expect(rrsdk.account.address).to.equal('0x5409ed021d9299bf6814279a6a1411a7e866a631');
    });

    it.only('SDK reloads properly when the account is updated', async () => {
      rrsdk.events.on('accountUpdated', account => {
        accountUpdated = true;
      });
      rrsdk.events.on('tradeInitialized', trade => {
        tradeInitialized = true;
      });
      rrsdk.events.on('marketsInitialized', markets => {
        marketsInitialized = true;
      });

      await rrsdk.setAccount(1);

      expect(tokensInitialized).to.be.false;
      expect(accountUpdated).to.be.true;
      expect(tradeInitialized).to.be.true;
      expect(marketsInitialized).to.be.true;
      expect(rrsdk.account.address).to.equal('0x6ecbe1db9ef729cbe972c83fb886247691fb6beb');
    });

    it.skip('properly handles setting invalid connection');

    it.skip('properly handles setting invalid account');

});
