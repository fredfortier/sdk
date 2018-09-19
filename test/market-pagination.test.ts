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

  it('getPage', async () => {
    const markets = await rrsdk.marketsPagination.getPage(1, 3);
    expect(markets.size).to.be.eq(3);
  });

  it('getNextPage', async () => {
    rrsdk.marketsPagination.perPage = 3;

    const firstPageMarkets = await rrsdk.marketsPagination.getNextPage();
    expect(firstPageMarkets.size).to.be.eq(3);

    const secondPageMarkets = await rrsdk.marketsPagination.getNextPage();
    expect(secondPageMarkets.size).to.be.eq(3);

    expect(rrsdk.marketsPagination.markets.size).to.be.eq(6);
  });

});
