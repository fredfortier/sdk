/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import {ZeroEx} from '0x.js';
import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelaySDK} from '../src/index';
import BigNumber from 'bignumber.js';
import {mockRequests} from './lib/mockRequests';

const expect = chai.expect;

describe('RadarRelaySDK.Market', () => {

  let rrsdk;
  let signedOrder;

  before(async () => {
    // TODO mock and testrpc
    // mockRequests();

    rrsdk = new RadarRelaySDK();
    await rrsdk.initialize(
      // 'http://localhost:8545',
      'http://35.196.15.153:8100',
      'http://localhost:8080/v0');
  });

  it('getBookAsync', async () => {
    const book = await rrsdk.markets.get('ZRX-WETH').getBookAsync();

    expect(book.bids.length).to.be.gt(0);
    expect(book.asks.length).to.be.gt(0);
  });

  it('getFillsAsync', async () => {
    const fills = await rrsdk.markets.get('ZRX-WETH').getFillsAsync();
    expect(fills.length).to.be.gt(0);
  });

  it('getCandlesAsync', async () => {
    const candles = await rrsdk.markets.get('ZRX-WETH').getCandlesAsync();
    expect(candles.length).to.be.gt(0);
  });

  it('getTickerAsync', async () => {
    // TODO local API returning 400
    const ticker = await rrsdk.markets.get('ZRX-WETH').getTickerAsync();
    expect(ticker).to.not.be.empty;
  });

  it('limitOrderAsync', async () => {

    signedOrder = await rrsdk.markets.get('ZRX-WETH').limitOrderAsync('sell',
      new BigNumber(String(Math.random() * 10)),
      new BigNumber('0.0015'),
      new BigNumber((new Date().getTime() / 1000) + 43200).floor()
    );

    // add BigNumber back
    signedOrder.takerTokenAmount = new BigNumber(signedOrder.takerTokenAmount);
    signedOrder.makerTokenAmount = new BigNumber(signedOrder.makerTokenAmount);
    signedOrder.expirationUnixTimestampSec = new BigNumber(signedOrder.expirationUnixTimestampSec);

    // verify valid signedOrder
    await rrsdk.zeroEx.exchange.validateOrderFillableOrThrowAsync(signedOrder);
  });
  
  it.skip('marketOrderAsync', async () => {
      // TODO
  });

  it.skip('cancelOrderAsync', async () => {
      
      const hash = await rrsdk.markets.get('ZRX-WETH').cancelOrderAsync(signedOrder);
      console.log(hash);
  });

});
