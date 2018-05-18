/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

// TODO https://github.com/thoov/mock-socket

import {ZeroEx} from '0x.js';
import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelay} from '../src/index';
import {mockRequests} from './lib/mockRequests';
import BigNumber from 'bignumber.js';
import socket = require('socket.io-client');

const expect = chai.expect;

describe.skip('RadarRelay.Ws', () => {

  let rrsdk;
  let order;

  before(async () => {
    mockRequests();

    rrsdk = new RadarRelay();
    await rrsdk.initialize({
      password: 'password',
      // walletRpcUrl: 'http://35.196.15.153:8100',
      dataRpcUrl: 'http://localhost:8545',
      radarRelayEndpoint: 'http://localhost:8080/v0'
    });
  });

  it('fires event on order create', async () => {

    await new Promise(async (resolve, reject) => {
      const sock = socket('http://localhost:8080/');
      const zrxWethMarket = rrsdk.markets.get('ZRX-WETH');

      sock.on(`${zrxWethMarket.quoteTokenAddress}:${zrxWethMarket.baseTokenAddress}`, message => {
        console.log(message);
        resolve(true);
      });

      order = await zrxWethMarket.limitOrderAsync('buy',
        new BigNumber(String(Math.random() * 10)),
        new BigNumber('0.0015'),
        new BigNumber((new Date().getTime() / 1000) + 43200).floor()
      );
    });

  });

});
