/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import {ZeroEx} from '0x.js';
import * as mocha from 'mocha';
import * as chai from 'chai';
import {RadarRelaySDK} from '../src/index';
import BigNumber from 'bignumber.js';

const expect = chai.expect;

describe('RadarRelaySDK.Market', () => {

  let rrsdk;
  let order;

  before(async () => {
    rrsdk = new RadarRelaySDK();
    await rrsdk.initialize('http://35.196.15.153:8545', 'http://localhost:8080/v0');
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
    const ticker = await rrsdk.markets.get('ZRX-WETH').getTickerAsync();
    expect(ticker).to.not.be.empty;
  });

  it.skip('marketOrderAsync', async () => {
      // TODO
  });

  it('limitOrderAsync', async () => {

    order = await rrsdk.markets.get('ZRX-WETH').limitOrderAsync('buy',
      new BigNumber('10').pow(20),
      new BigNumber('10').pow(17),
      new BigNumber((new Date().getTime() / 1000) + 43200).floor()
    );

    // verify valid order
    await rrsdk.zeroEx.exchange.validateOrderFillableOrThrowAsync(order);

  });

  it.skip('cancelOrderAsync', async () => {

      // const hash = await rrsdk.markets.get('ZRX-WETH').cancelOrderAsync({
      //     exchangeContractAddress: '0x90fe2af704b34e0224bf2299c838e04d4dcf1364',
      //     expirationUnixTimestampSec: new BigNumber('1522001866'),
      //     feeRecipient: '0xa258b39954cef5cb142fd567a46cddb31a670124',
      //     maker: '0x9d94d5c4dcf7784023afc5826059ba8c0f17657f',
      //     makerFee: new BigNumber('0'),
      //     makerTokenAddress: '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570',
      //     makerTokenAmount: new BigNumber('100000000000000000000'),
      //     salt: new BigNumber('97066406854566707731631784946984160426282407258067085270432604169571205990947'),
      //     taker: '0x0000000000000000000000000000000000000000',
      //     takerFee: new BigNumber('0'),
      //     takerTokenAddress: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
      //     takerTokenAmount: new BigNumber('1000000000000000000'),
      //     ecSignature: {
      //       v: 28,
      //       r: '0xc431084fac181345a4f411379c48e3e8b72918f1a40224b9d141e2dfb6835ddd',
      //       s: '0x442b8675cff5dddc2dc07b85524d6408aa2be744d404a53193c5efd8fbc838d7'
      //     }
      //   });

      const hash = await rrsdk.markets.get('ZRX-WETH').cancelOrderAsync(order);
      console.log(hash);
  });

});
