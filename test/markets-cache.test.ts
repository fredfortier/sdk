/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

import { SdkManager, RadarRelay, LocalAccount, Market } from '../src';
import { mockRequests, RADAR_ENPOINT, RADAR_WS_ENPOINT } from './lib/mockRequests';
import * as chai from 'chai';
import BigNumber from 'bignumber.js';
import { UserOrderType, SignedOrder } from '@radarrelay/types';
import { TransactionReceiptWithDecodedLogs } from 'ethereum-types';

const expect = chai.expect;

describe('RadarRelay.Market', () => {

  let rrsdk: RadarRelay<LocalAccount>;

  before(async () => {
    mockRequests();

    rrsdk = await SdkManager.SetupAndInitializeAsync({
      wallet: {
        password: 'password',
        seedPhrase: 'concert load couple harbor equip island argue ramp clarify fence smart topic'
      },
      dataRpcUrl: 'http://localhost:8545',
      radarRestEndpoint: RADAR_ENPOINT,
      radarWebsocketEndpoint: RADAR_WS_ENPOINT
    });

  });

  it('getAsync with string', async () => {
    const market = await rrsdk.markets.getAsync('ZRX-WETH');
    expect(market.id).to.be.eq('ZRX-WETH');
  });

  it('getAsync with string[]', async () => {
    const markets = await rrsdk.markets.getAsync(['ZRX-WETH', 'DAI-WETH']);
    expect(markets.size).to.be.eq(2);
    expect(markets.get('ZRX-WETH').id).to.be.eq('ZRX-WETH');
    expect(markets.get('DAI-WETH').id).to.be.eq('DAI-WETH');
  });

  it('getPageAsync', async () => {
    const markets = await rrsdk.markets.getPageAsync(1, 100);
    console.log(markets);
    expect(markets.size).to.be.eq(3);
  });

  it('getNextPageAsync', async () => {
    const firstPageMarkets = await rrsdk.markets.getNextPageAsync();
    expect(firstPageMarkets.size).to.be.eq(3);

    const secondPageMarkets = await rrsdk.markets.getNextPageAsync();
    expect(secondPageMarkets.size).to.be.eq(3);

    expect(rrsdk.markets.size).to.be.eq(9);
  });

});
