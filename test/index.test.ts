/* tslint:disable:no-unused-expression */
/* tslint:disable:no-implicit-dependencies */

// TODO test is dependent on local running API
// Create MOCK API endpoints

import * as chai from 'chai';
import { SdkManager, EventName } from '../src/index';
import { mockRequests, RADAR_ENPOINT, RADAR_WS_ENPOINT } from './lib/mockRequests';

const expect = chai.expect;

describe('RadarRelay', async () => {

  let rrsdk;
  let ethereumInitialized = false;
  let ethereumNetworkIdInitialized = false;
  let tokensInitialized = false;
  let accountInitialized = false;
  let zeroExInitialized = false;
  let tradeInitialized = false;

  before(async () => {
    mockRequests();

    rrsdk = await SdkManager.Setup({
        wallet: {
          password: 'password',
          seedPhrase: 'concert load couple harbor equip island argue ramp clarify fence smart topic'
        },
        dataRpcUrl: 'http://localhost:8545',
        radarRestEndpoint: RADAR_ENPOINT,
        radarWebsocketEndpoint: RADAR_WS_ENPOINT
      });

    rrsdk.events.on(EventName.EthereumInitialized, () => {
      ethereumInitialized = true;
    });
    rrsdk.events.on(EventName.EthereumNetworkIdInitialized, () => {
      ethereumNetworkIdInitialized = true;
    });
    rrsdk.events.on(EventName.TokensInitialized, () => {
      tokensInitialized = true;
    });
    rrsdk.events.on(EventName.AccountInitialized, () => {
      accountInitialized = true;
    });
    rrsdk.events.on(EventName.ZeroExInitialized, () => {
      zeroExInitialized = true;
    });
    rrsdk.events.on(EventName.TradeInitialized, () => {
      tradeInitialized = true;
    });
  });

  beforeEach(() => {
    ethereumInitialized = false;
    ethereumNetworkIdInitialized = false;
    tokensInitialized = false;
    accountInitialized = false;
    zeroExInitialized = false;
    tradeInitialized = false;
  });

  it('properly initializes and updates via init lifecycle', async () => {

    await SdkManager.InitializeAsync(rrsdk);

    expect(ethereumInitialized).to.be.true;
    expect(ethereumNetworkIdInitialized).to.be.true;
    expect(accountInitialized).to.be.true;
    expect(tokensInitialized).to.be.true;
    expect(accountInitialized).to.be.true;
    expect(zeroExInitialized).to.be.true;
    expect(tradeInitialized).to.be.true;
  });

  it('SDK reloads properly when an account address is changed', async () => {
    let addresses = await rrsdk.account.getAvailableAddressesAsync();
    if (addresses.length === 1) {
      rrsdk.account.addNewAddresses(1);
      addresses = await rrsdk.account.getAvailableAddressesAsync();
    }

    await rrsdk.account.setAddressAsync(addresses[1]);
    expect(rrsdk.account.address).to.be.eq(addresses[1]);
    // check nested dependency (NOTE: private vars)
    expect(((rrsdk as any)._trade as any)._account.address).to.be.eq(addresses[1]);
  });

  it('fetchMarket', async () => {
    const market = await rrsdk.fetchMarket('ZRX-WETH');
    expect(market.id).to.be.eq('ZRX-WETH');
  });

  it('fetchMarkets', async () => {
    const markets = await rrsdk.fetchMarkets(['ZRX-WETH', 'DAI-WETH']);
    expect(markets[0].id).to.be.eq('ZRX-WETH');
    expect(markets[1].id).to.be.eq('DAI-WETH');
  });

  it.skip('properly handles setting invalid connection');

  it.skip('properly handles setting invalid account');

});
