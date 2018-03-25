/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelaySDK} from '../src/index';

const expect = chai.expect;

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

    it('properly initializes and updates via event API lifecycle', async () => {
      rrsdk = new RadarRelaySDK();

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
      await rrsdk.initialize('http://localhost:8545', 'http://localhost:8080/v0');

      expect(accountUpdated).to.be.true;
      expect(ethereumNetworkUpdated).to.be.true;
      expect(ethereumNetworkIdUpdated).to.be.true;
      expect(zeroExUpdated).to.be.true;
      expect(marketsUpdated).to.be.true;
      expect(rrsdk.account.address).to.equal('0x5409ed021d9299bf6814279a6a1411a7e866a631');
    });

    it('reloads proper aspects of the SDK when the account is updated', async () => {
      await rrsdk.setAccount(1);
      expect(rrsdk.account.address).to.equal('0x6ecbe1db9ef729cbe972c83fb886247691fb6beb');
    });

    // it('handles reloading the lifecycle when the RPC url is updated', async () => {
    //   await rrsdk.setEthereumConnectionAsync('http://35.196.15.153:8545');
    // });

    it.skip('properly handles setting invalid connection');

    it.skip('properly handles setting invalid account');

});
