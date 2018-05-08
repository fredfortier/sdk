import * as nock from 'nock';

// TODO more robust data
export function mockRequests() {

  nock('http://localhost:8080')
              .get('/v0/tokens')
              .reply(200, [
                
              ]);

  nock('http://localhost:8080')
              .get('/v0/markets')
              .reply(200, [{
                id: 'ZRX-WETH',
                baseTokenAddress: '0x1d7022f5b17d2f8b695918fb48fa1089c9f85401',
                quoteTokenAddress: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
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
                  baseTokenAddress: '0x1d7022f5b17d2f8b695918fb48fa1089c9f85401',
                  quoteTokenAddress: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
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
  
  nock('http://localhost:8080')
              .post('/v0/markets/ZRX-WETH/order/limit')
              .reply(200, { exchangeContractAddress: 'SET',
                            expirationUnixTimestampSec: '1525693701',
                            maker: 'SET',
                            ecSignature: 'SET',
                            feeRecipient: '0xa258b39954cef5cb142fd567a46cddb31a670124',
                            makerFee: '0',
                            makerTokenAddress: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
                            makerTokenAmount: '7070217932691948',
                            salt: '50383144753900994556920531501252803163709013513245472190540889193319785504083',
                            taker: '0x0000000000000000000000000000000000000000',
                            takerFee: '0',
                            takerTokenAddress: '0x1d7022f5b17d2f8b695918fb48fa1089c9f85401',
                            takerTokenAmount: '9426957243589264000' });
    
  nock('http://localhost:8080')
              .post('/v0/orders')
              .reply(200);

}
