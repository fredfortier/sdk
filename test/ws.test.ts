/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

// TODO https://github.com/thoov/mock-socket

import {ZeroEx} from '0x.js';
import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelay} from '../src/index';
import {mockRequestsKovan} from './lib/mockRequests';
import BigNumber from 'bignumber.js';
import { WebSocket } from 'mock-socket';

const expect = chai.expect;

describe('RadarRelay.Ws', () => {

  let rrsdk;
  let order;

  before(async () => {
    mockRequestsKovan();

    rrsdk = new RadarRelay();
    await rrsdk.initialize({
      password: 'password',
      // walletRpcUrl: 'http://localhost:8545',
      // dataRpcUrl: 'http://localhost:8545',
      // walletRpcUrl: 'http://35.196.15.153:8100',
      dataRpcUrl: 'https://kovan.infura.io/radar',
      radarRelayEndpoint: 'http://localhost:8080/v0'
    });
  });

  it('fires event on order create', async () => {

    await new Promise(async (resolve, reject) => {
      const sock = new WebSocket('ws://ws.radarrelay.com');
      const zrxWethMarket = rrsdk.markets.get('ZRX-WETH');

        // `${zrxWethMarket.quoteTokenAddress}:${zrxWethMarket.baseTokenAddress}`
      sock.onmessage = ev => {
        expect(ev.data);
        resolve();
      };

      order = await zrxWethMarket.limitOrderAsync('buy',
        new BigNumber(String(Math.random() * 10)),
        new BigNumber('0.0015'),
        new BigNumber((new Date().getTime() / 1000) + 43200).floor()
      );

    });

  });

});
