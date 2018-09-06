/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import { ZeroEx } from '../src/zero-ex';
import * as mocha from 'mocha';
import * as chai from 'chai';
import { SdkManager } from '../src/index';
import { mockRequests } from './lib/mockRequests';
import BigNumber from 'bignumber.js';
import { WebSocket } from 'mock-socket';

const expect = chai.expect;

describe.skip('RadarRelay.Ws', () => {

  let rrsdk;
  let order;

  before(async () => {
    mockRequests();

    rrsdk = await SdkManager.SetupAndInitializeAsync({
      wallet: {
        password: 'password'
      },
      dataRpcUrl: 'https://kovan.infura.io',
      radarRestEndpoint: 'https://api.kovan.radarrelay.com/v0',
      radarWebsocketEndpoint: 'wss://ws.kovan.radarrelay.com/ws'
    });
  });

  // TODO need to overwrite socket with mock-socket
  it('fires event on order create', async () => {

    await new Promise(async (resolve, reject) => {

      const zrxWethMarket = rrsdk.markets.get('ZRX-WETH');

      const subscription = await zrxWethMarket.subscribeAsync('BOOK', mssg => {
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
