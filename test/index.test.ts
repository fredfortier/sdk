
/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelaySDK} from '../src/index';

const expect = chai.expect;

// TODO use testrpc
describe('RadarRelaySDK', () => {

    let rrsdk;
    let networkUpdatedEventFired = false;
    let accountUpdatedEventFired = false;

    it('properly sets ethereum connection and fires event', async () => {
      rrsdk = new RadarRelaySDK();

      rrsdk.events.on('networkUpdated', () => {
        networkUpdatedEventFired = true;
      });
      await rrsdk.setEthereumConnectionAsync('http://35.196.15.153:8545');

      expect(rrsdk.networkId).is.not.undefined;
      expect(networkUpdatedEventFired).to.be.true;
    });

    it.skip('properly handles setting invalid connection');

    it('properly sets account and fires event', () => {
      rrsdk.events.on('accountUpdated', () => {
        accountUpdatedEventFired = true;
      });
      rrsdk.setAccount(0);
      expect(rrsdk.account.address).is.not.undefined;
      expect(accountUpdatedEventFired).to.be.true;
    });

    it.skip('properly handles setting invalid account');

    it('initializes ZeroEx', () => {
      const exchangeAddress = rrsdk.zeroEx.exchange.getContractAddress();
      expect(exchangeAddress).is.not.undefined;
    });

});
