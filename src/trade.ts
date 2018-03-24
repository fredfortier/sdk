import BigNumber from 'bignumber.js';
import {EthereumConnection} from './ethereum-connection';
import {Market} from './market';
import {Account} from './account';
import {EventEmitter} from 'events';
import {ZeroEx, ZeroExConfig, SignedOrder} from '0x.js';

export class Trade {

    private zeroEx: ZeroEx;
    private endpoint: string;
    private account: Account;
    private events: EventEmitter;

    constructor(
      ethereum: EthereumConnection,
      networkId: number,
      apiEndpoint: string,
      account: Account,
      events: EventEmitter) {

      this.account = account;
      this.events = events;
      this.zeroEx = new ZeroEx(ethereum.provider, {
        networkId
      });
    }

    // TODO this is a test
    public async marketOrder(
      market: Market = null,
      type: string = 'buy',
      amount: BigNumber = null
    ) {
      const signedOrder: SignedOrder = JSON.parse(`{
        "exchangeContractAddress": "0x90fe2af704b34e0224bf2299c838e04d4dcf1364",
        "maker": "0x9d94d5c4dcf7784023afc5826059ba8c0f17657f",
        "taker": "0x0000000000000000000000000000000000000000",
        "makerTokenAmount": "5144082533960915",
        "takerTokenAmount": "5000000000000000000",
        "makerTokenAddress": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
        "takerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
        "makerFee": "0",
        "takerFee": "0",
        "feeRecipient": "0xa258b39954cef5cb142fd567a46cddb31a670124",
        "expirationUnixTimestampSec": "1521891891",
        "salt": "86821865937684789548136301908081798977199604636974649680523686200827244608231",
        "ecSignature": {
          "v": 27,
          "r": "0xd04bbab1529a1bfd389fd97d7b3b754a92311d179632248848dc6af8c14ab910",
          "s": "0x6d2d88e333a874a5cdbb56248f59a3a576c1465cda3fcdb3cb6f69167c990c6b"
          }
        }`);

       signedOrder.makerTokenAmount = new BigNumber(signedOrder.makerTokenAmount);
       signedOrder.takerTokenAmount = new BigNumber(signedOrder.takerTokenAmount);
       signedOrder.makerFee = new BigNumber(signedOrder.makerFee);
       signedOrder.takerFee = new BigNumber(signedOrder.takerFee);
       signedOrder.salt = new BigNumber(signedOrder.salt);
       signedOrder.expirationUnixTimestampSec = new BigNumber(signedOrder.expirationUnixTimestampSec);

       const txHash = await this.zeroEx.exchange.fillOrderAsync(
         signedOrder,
         new BigNumber('100000000000000000'),
         true,
         this.account.address,
         {
           shouldValidate: true
         }
       );

       console.log(txHash);

       const results = await this.zeroEx.awaitTransactionMinedAsync(
         txHash,
         1000
       );

       console.log(results);
    }

    // sign and post order to book
    public async limitOrder(
      market: Market = null,
      type: string = 'buy',
      amount: BigNumber = null) {
      // TODO
    }

}
