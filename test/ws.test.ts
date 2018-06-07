/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import {ZeroEx} from '0x.js';
import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelay} from '../src/index';
import {mockRequests} from './lib/mockRequests';
import BigNumber from 'bignumber.js';
import { WebSocket } from 'mock-socket';

const expect = chai.expect;

describe('RadarRelay.Ws', () => {

  let rrsdk;
  let order;

  before(async () => {
    mockRequests();

    rrsdk = new RadarRelay({
      endpoint: 'https://api-beta.rrdev.io/v0',
      websocketEndpoint: 'https://ws-beta.rrdev.io/ws'
    });
    await rrsdk.initialize({
      wallet: {
        password: 'password' // ,
        // seedPhrase: 'concert load couple harbor equip island argue ramp clarify fence smart topic'
      },
      dataRpcUrl: 'https://kovan.infura.io'
    });

    // TODO use websocket mock
    // rrsdk = new RadarRelay({
    //   endpoint: 'http://localhost:8080/v0',
    //   websocketEndpoint: 'ws://ws.radarrelay.com'
    // });
    // await rrsdk.initialize({
    //   wallet: {
    //     password: 'password' // ,
    //     seedPhrase: 'concert load couple harbor equip island argue ramp clarify fence smart topic'
    //   },
    //   dataRpcUrl: 'http://localhost:8545'
    // });
  });

  it.skip('fires event on order create', async () => {

    await new Promise(async (resolve, reject) => {

      const zrxWethMarket = rrsdk.markets.get('ZRX-WETH');
      // TODO overwrite socket with mock-socket

      const subscription = await zrxWethMarket.subscribe('BOOK', mssg => {
        console.log(mssg);
        if (mssg.action === 'NEW') {
          resolve();
        }
      });

      order = await zrxWethMarket.limitOrderAsync('BUY',
        new BigNumber(String(Math.random() * 10)),
        new BigNumber('0.0015'),
        new BigNumber((new Date().getTime() / 1000) + 43200).floor()
      );

      // subscription.unsubscribe();

    });

  });

});
