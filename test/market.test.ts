/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import {RadarRelay} from '../src';
import {mockRequests} from './lib/mockRequests';
import {ZeroEx, TransactionReceiptWithDecodedLogs} from '0x.js';
import * as mocha from 'mocha';
import * as chai from 'chai';
import BigNumber from 'bignumber.js';

const expect = chai.expect;

describe('RadarRelay.Market', () => {

  let rrsdk;
  let signedOrder;

  before(async () => {
    // TODO mock and testrpc
    // mockRequests();

    rrsdk = new RadarRelay();
    await rrsdk.initialize({
      password: 'password',
      // walletRpcUrl: 'http://35.196.15.153:8100',
      dataRpcUrl: 'http://35.196.15.153:8100',
      radarRelayEndpoint: 'http://35.190.74.75/v0',
      defaultGasPrice: new BigNumber(2)
    });

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

    signedOrder = await rrsdk.markets.get('ZRX-WETH').limitOrderAsync('buy',
      new BigNumber(String(0.01)),
      new BigNumber('0.007'),
      new BigNumber((new Date().getTime() / 1000) + 43200).floor()
    );

    // add BigNumber back
    signedOrder.takerTokenAmount = new BigNumber(signedOrder.takerTokenAmount);
    signedOrder.makerTokenAmount = new BigNumber(signedOrder.makerTokenAmount);
    signedOrder.expirationUnixTimestampSec = new BigNumber(signedOrder.expirationUnixTimestampSec);

    // verify valid signedOrder
    await rrsdk.zeroEx.exchange.validateOrderFillableOrThrowAsync(signedOrder);
  });

  it('marketOrderAsync', async () => {
    const receipt = await rrsdk.markets.get('ZRX-WETH').marketOrderAsync('buy',
      new BigNumber(1), true // awaitTxMined
    );
    expect((receipt as TransactionReceiptWithDecodedLogs).logs.length).to.be.gt(0);
  });

  it('cancelOrderAsync', async () => {
      const receipt = await rrsdk.markets.get('ZRX-WETH').cancelOrderAsync(
        signedOrder, true // awaitTxMined
      );
      expect((receipt as TransactionReceiptWithDecodedLogs).logs.length).to.be.gt(0);
  });

});
