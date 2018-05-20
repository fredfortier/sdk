/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import {RadarRelay} from '../src';
import {mockRequests} from './lib/mockRequests';
import {ZeroEx, TransactionReceiptWithDecodedLogs} from '0x.js';
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as nock from 'nock';
import BigNumber from 'bignumber.js';

const expect = chai.expect;

describe('RadarRelay.Market', () => {

  let rrsdk;
  let signedOrder;
  let wethAddr;
  let zrxAddr;

  before(async () => {
    mockRequests();

    rrsdk = new RadarRelay();
    await rrsdk.initialize({
      wallet: {
        password: 'password',
        seedPhrase: 'concert load couple harbor equip island argue ramp clarify fence smart topic'
      },
      dataRpcUrl: 'http://localhost:8545',
      radarRelayEndpoint: 'http://localhost:8080/v0',
      defaultGasPrice: new BigNumber(2)
    });

    // set addr for later use
    zrxAddr = rrsdk.markets.get('ZRX-WETH').baseTokenAddress;
    wethAddr = rrsdk.markets.get('ZRX-WETH').quoteTokenAddress;

    // set allowance
    await rrsdk.account.setUnlimitedTokenAllowanceAsync(wethAddr, true);
    await rrsdk.account.setUnlimitedTokenAllowanceAsync(zrxAddr, true);
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
    signedOrder = await rrsdk.markets.get('ZRX-WETH').limitOrderAsync('BUY',
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
    await rrsdk.account.setUnlimitedTokenAllowanceAsync(
      wethAddr, true
    );
    const receipt = await rrsdk.markets.get('ZRX-WETH').marketOrderAsync('BUY',
      new BigNumber(0.001), true // awaitTxMined
    );
    expect(receipt.status).to.be.eq(1);
  });

  it('cancelOrderAsync', async () => {
      const receipt = await rrsdk.markets.get('ZRX-WETH').cancelOrderAsync(
        signedOrder, true // awaitTxMined
      );
      expect(receipt.status).to.be.eq(1);
      await rrsdk.zeroEx.exchange.validateOrderFillableOrThrowAsync(signedOrder)
      // try {
      //   await rrsdk.zeroEx.exchange.validateOrderFillableOrThrowAsync(signedOrder)
      // } catch (err) {
      //   console.log(err);
      // }
  });

});
