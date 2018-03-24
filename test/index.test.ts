/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelaySDK} from '../src/index';

const expect = chai.expect;

// TODO use testrpc
describe('RadarRelaySDK', () => {

    let rrsdk;
    let apiEndpointUpdated = false;
    let ethereumNetworkUpdated = false;
    let accountUpdated = false;
    let ethereumNetworkIdUpdated = false;
    let zeroExUpdated = false;
    let marketsUpdated = false;

    beforeEach(() => {
      apiEndpointUpdated = false;
      ethereumNetworkUpdated = false;
      accountUpdated = false;
      ethereumNetworkIdUpdated = false;
      zeroExUpdated = false;
      marketsUpdated = false;
    });

    it('properly initializes and fires all events', async () => {
      rrsdk = new RadarRelaySDK();

      rrsdk.events.on('apiEndpointUpdated', endpoint => {
        apiEndpointUpdated = true;
      });
      rrsdk.events.on('ethereumNetworkUpdated', network => {
        ethereumNetworkUpdated = true;
      });
      rrsdk.events.on('accountUpdated', account => {
        accountUpdated = true;
      });
      rrsdk.events.on('ethereumNetworkIdUpdated', networkId => {
        ethereumNetworkIdUpdated = true;
      });
      rrsdk.events.on('zeroExUpdated', zeroEx => {
        zeroExUpdated = true;
      });
      rrsdk.events.on('marketsUpdated', markets => {
        marketsUpdated = true;
      });
      await rrsdk.initialize('http://35.196.15.153:8545');

      expect(apiEndpointUpdated).to.be.true;
      expect(ethereumNetworkUpdated).to.be.true;
      expect(ethereumNetworkIdUpdated).to.be.true;
      expect(zeroExUpdated).to.be.true;
      expect(marketsUpdated).to.be.true;
    });

    it.skip('properly handles setting invalid connection');

    it.skip('properly handles setting invalid account');

});
