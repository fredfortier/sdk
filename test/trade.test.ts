/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelaySDK} from '../src/index';

const expect = chai.expect;

// TODO use testrpc
describe('RadarRelaySDK.Trade', () => {

  let rrsdk;

  it('executes a market order', async () => {
    rrsdk = new RadarRelaySDK();
    await rrsdk.initialize('http://35.196.15.153:8545');

    await rrsdk.trade.marketOrder();
  });

});