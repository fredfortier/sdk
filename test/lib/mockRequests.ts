import * as nock from 'nock';
import { Server } from 'mock-socket';
import { WebsocketEvent, WebsocketAction, RadarNewOrder, RadarSignedOrder } from '@radarrelay/types';
import BigNumber from 'bignumber.js';

let mockServer;

// TODO more robust data + factories
export function mockRequests() {

  if (!mockServer) {
    mockServer = new Server('ws://ws.radarrelay.com');
  }

  nock('http://localhost:8080')
    .get('/v0/tokens')
    .reply(200, [
      {
        address: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
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
        address: '0x34d402f14d58e001d8efbe6585051bf9706aa064',
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
    .get('/v0/markets?per_page=500')
    .reply(200, [{
      id: 'ZRX-WETH',
      baseTokenAddress: '0x34d402f14d58e001d8efbe6585051bf9706aa064',
      quoteTokenAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
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
      baseTokenAddress: '0x34d402f14d58e001d8efbe6585051bf9706aa064',
      quoteTokenAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
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
    .reply(200, {
      transactionHash: '0xd78e7edb5e4feaf1b0236006d6918dc1f1167eeb842a3a3a044088416d475b1a', // last trade tx hash
      price: new BigNumber('0.0007'), // last trade price
      size: new BigNumber('10'), // last trade size (in quote)
      bid: new BigNumber('0.0007'), // best bid
      ask: new BigNumber('0.00069'), // best ask
      volume: new BigNumber('100'), // 24hr volume of market in quote
      timestamp: new BigNumber('0.0007') // last trade time in unix time (seconds)
    });

  nock('http://localhost:8080')
    .post('/v0/markets/ZRX-WETH/order/limit', order => {
      return true;
    })
    .reply(200, {
      exchangeContractAddress: 'SET',
      expirationUnixTimestampSec: String(Math.floor((new Date().getTime() / 1000) + 31536000)),
      maker: 'SET',
      ecSignature: 'SET',
      feeRecipient: '0xa258b39954cef5cb142fd567a46cddb31a670124',
      makerFee: '0',
      makerTokenAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
      makerTokenAmount: new BigNumber(10).pow(14),
      salt: '50383144753900994556920531501252803163709013513245472190540889193319785504083',
      taker: '0x0000000000000000000000000000000000000000',
      takerFee: '0',
      takerTokenAddress: '0x34d402f14d58e001d8efbe6585051bf9706aa064',
      takerTokenAmount: new BigNumber(10).pow(14)
    });

  nock('http://localhost:8080')
    .get('/v0/accounts/0x5409ed021d9299bf6814279a6a1411a7e866a631/fills?page=1&per_page=100')
    .reply(200, [{}]);

  nock('http://localhost:8080')
    .get('/v0/accounts/0x5409ed021d9299bf6814279a6a1411a7e866a631/orders?page=1&per_page=100')
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
        action: WebsocketAction.NEW,
        event: newOrder
      };
      mockServer.send(JSON.stringify(ev));

      return true;
    }).reply(201);

  nock('http://localhost:8080')
    .post('/v0/markets/ZRX-WETH/order/market')
    .reply(200, {
      orders: [{
        exchangeContractAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
        expirationUnixTimestampSec: '1558313428',
        maker: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
        ecSignature: {
          v: 28,
          r: '0xb5e7bab5e352bf36bc9f224db23b768edd4c48dacfa6a5ab521976eb64f97de6',
          s: '0x442cd0dfb745d77eacc81f08d0651ad9dc804717484465d1c0172f094d5a52dc'
        },
        feeRecipient: '0xa258b39954cef5cb142fd567a46cddb31a670124',
        makerFee: '0',
        makerTokenAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
        makerTokenAmount: '100000000000000',
        salt: '50383144753900994556920531501252803163709013513245472190540889193319785504083',
        taker: '0x0000000000000000000000000000000000000000',
        takerFee: '0',
        takerTokenAddress: '0x34d402f14d58e001d8efbe6585051bf9706aa064',
        takerTokenAmount: '100000000000000'
      }]
    });

}
