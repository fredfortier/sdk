import * as nock from 'nock';
import { Server } from 'mock-socket';
import {WebsocketEvent, RadarEvent, RadarNewOrder, RadarSignedOrder} from 'radar-types';

let mockServer;

// TODO more robust data + factories
export function mockRequestsKovan() {

  if (!mockServer) {
    mockServer = new Server('ws://ws.radarrelay.com');
  }

  nock('http://localhost:8080')
              .get('/v0/tokens')
              .reply(200, [
                {
                  address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
                  symbol: 'WETH',
                  decimals: 18,
                  name: 'Wrapped Ether',
                  zeroex_official: 1,
                  active: 1,
                  quote: 1,
                  deprecated: 0,
                  createdDate: '2018-03-19T23:16:50.000Z'
                },
                {
                  address: '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570',
                  symbol: 'ZRX',
                  decimals: 18,
                  name: '0x Protocol Token',
                  zeroex_official: 1,
                  active: 1,
                  quote: 0,
                  deprecated: 0,
                  createdDate: '2018-03-19T23:16:50.000Z'
                }
              ]);

  nock('http://localhost:8080')
              .get('/v0/markets')
              .reply(200, [{
                id: 'ZRX-WETH',
                baseTokenAddress: '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570',
                quoteTokenAddress: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
                baseTokenDecimals: 18,
                quoteTokenDecimals: 18,
                displayName: 'ZRX/WETH',
                quoteIncrement: '0.00000001',
                minOrderSize: '1',
                maxOrderSize: '1'
              }]);

  nock('http://localhost:8080')
              .get('/v0/markets/ZRX-WETH/book')
              .reply(200, {
                  baseTokenAddress: '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570',
                  quoteTokenAddress: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
                  bids: [{}],
                  asks: [{}]
                });

  nock('http://localhost:8080')
              .get('/v0/markets/ZRX-WETH/fills')
              .reply(200, [{}]);

  nock('http://localhost:8080')
              .get('/v0/markets/ZRX-WETH/candles')
              .reply(200, [{}]);

  nock('http://localhost:8080')
              .get('/v0/markets/ZRX-WETH/ticker')
              .reply(200, {});

  // TODO reply with accurate data
  nock('http://localhost:8080')
              .post('/v0/markets/ZRX-WETH/order/limit')
              .reply(200, { exchangeContractAddress: 'SET',
                            expirationUnixTimestampSec: '1525693701',
                            maker: 'SET',
                            ecSignature: 'SET',
                            feeRecipient: '0xa258b39954cef5cb142fd567a46cddb31a670124',
                            makerFee: '0',
                            makerTokenAddress: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
                            makerTokenAmount: '7070217932691948',
                            salt: '50383144753900994556920531501252803163709013513245472190540889193319785504083',
                            taker: '0x0000000000000000000000000000000000000000',
                            takerFee: '0',
                            takerTokenAddress: '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570',
                            takerTokenAmount: '9426957243589264000' });

  nock('http://localhost:8080')
              .get('/v0/accounts/0xeecf1adcfebd51290ba78a0c0341d4a5e2dd3dcd/fills')
              .reply(200, [{}]);

  nock('http://localhost:8080')
              .get('/v0/accounts/0xeecf1adcfebd51290ba78a0c0341d4a5e2dd3dcd/orders')
              .reply(200, [{}]);

  nock('http://localhost:8080')
              .post('/v0/orders', order => {
                // Send websocket event
                const newOrder: RadarNewOrder = {
                  baseTokenAddress: '',
                  quoteTokenAddress: '',
                  order: order as RadarSignedOrder
                };
                const ev: WebsocketEvent = {
                  action: 'NEW',
                  event : newOrder
                };
                mockServer.send(JSON.stringify(ev));

                return true;
              }).reply(201);

  nock('http://localhost:8080')
              .post('/v0/markets/ZRX-WETH/order/market')
              .reply(200, {
                orders: []
              });

}
