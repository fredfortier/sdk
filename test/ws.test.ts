/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import {ZeroEx} from '0x.js';
import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelaySDK} from '../src/index';
import BigNumber from 'bignumber.js';
import socket = require('socket.io-client');

const expect = chai.expect;

describe('RadarRelaySDK.Ws', () => {

  let rrsdk;
  let order;

  before(async () => {
    rrsdk = new RadarRelaySDK();
    await rrsdk.initialize({
      password: 'password',
      // walletRpcUrl: 'http://35.196.15.153:8100',
      dataRpcUrl: 'http://35.196.15.153:8100',
      radarRelayEndpoint: 'http://localhost:8080/v0'
    });
  });

  it('fires event on order create', async () => {

    await new Promise(async (resolve, reject) => {
      const sock = socket('http://localhost:8080');
      const market = rrsdk.markets.get('ZRX-WETH');

      sock.on(`${market.quoteTokenAddress}:${market.baseTokenAddress}`, message => {
        console.log(message);
        resolve(true);
      });

      order = await rrsdk.markets.get('ZRX-WETH').limitOrderAsync('buy',
        new BigNumber(String(Math.random() * 10)),
        new BigNumber('0.0015'),
        new BigNumber((new Date().getTime() / 1000) + 43200).floor()
      );
    });

  });

});
