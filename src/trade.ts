import {EthereumConnection} from './ethereum-connection';
import {Market} from './market';
import {Account} from './account';
import {EventEmitter} from 'events';
import {ZeroEx, ZeroExConfig, Order, SignedOrder, ECSignature} from '0x.js';
import {RelaySignedOrder} from '0x-relay-types';
import BigNumber from 'bignumber.js';
import request = require('request-promise');

// TODO move into config file
const feeRecipientAddress = '0xa258b39954cef5cb142fd567a46cddb31a670124';

export class Trade {

    public endpoint: string;
    private zeroEx: ZeroEx;
    private account: Account;
    private events: EventEmitter;

    constructor(
      zeroEx: ZeroEx,
      apiEndpoint: string,
      account: Account,
      events: EventEmitter) {
        this.zeroEx = zeroEx;
        this.endpoint = apiEndpoint;
        this.account = account;
        this.events = events;
    }

    public async marketOrder(
      market: Market,
      type: string = 'buy',
      amount: BigNumber = null
    ) {

      const side = (type === 'buy') ? 'bids' : 'asks';
      const orders = await market.getBookAsync()[side];
      const signedOrders = [];
      let current = new BigNumber(0);

      const decimals = (type === 'buy') ? market.baseTokenDecimals : market.quoteTokenDecimals;

      for (const order of orders) {
        if (current.gte(amount)) break;
        if (order.signedOrder.maker === this.account.address) continue;

        const orderAmount = (type === 'buy') ? order.remainingQuoteTokenAmount : order.remainingBaseTokenAmount;
        current = current.plus(order.remainingQuoteTokenAmount);
        signedOrders.push(order.signedOrder);
      }

      const txHash = await this.zeroEx.exchange.fillOrdersUpToAsync(
        signedOrders,
        amount,
        true,
        this.account.address);

      const receipt = await this.zeroEx.awaitTransactionMinedAsync(txHash);
      this.events.emit('transactionMined', receipt);
      return receipt;
    }

    // sign and post order to book
    public async limitOrder(
      market: Market = null,
      type: string = 'buy',
      baseTokenAmount: BigNumber,
      quoteTokenAmount: BigNumber,
      expiration: BigNumber) {

      // TODO fees
      const makerFee = new BigNumber(0);
      const takerFee = new BigNumber(0);

      const order: Order = {
        exchangeContractAddress: this.zeroEx.exchange.getContractAddress(),
        expirationUnixTimestampSec: expiration,
        feeRecipient: feeRecipientAddress,
        maker: this.account.address,
        makerFee,
        makerTokenAddress: (type === 'buy') ? market.quoteTokenAddress : market.baseTokenAddress,
        makerTokenAmount: (type === 'buy') ? quoteTokenAmount : baseTokenAmount,
        salt: ZeroEx.generatePseudoRandomSalt(),
        taker: ZeroEx.NULL_ADDRESS,
        takerFee,
        takerTokenAddress: (type === 'buy') ? market.baseTokenAddress : market.quoteTokenAddress,
        takerTokenAmount: (type === 'buy') ? baseTokenAmount : quoteTokenAmount,
      };

      const orderHash = ZeroEx.getOrderHashHex(order);
      const ecSignature: ECSignature = await this.zeroEx.signOrderHashAsync(orderHash, this.account.address, false);
      (order as SignedOrder).ecSignature = ecSignature;

      // TODO missing this endpoint
      await request.post(`${this.endpoint}/markets/${market.id}/order/limit`, order);
      // await request.post(`http://localhost:8080/0x/v0/order`, { json: order });

      return order;
    }

    // TODO fill individual order

    // cancel a signed order
    // TODO cancel partial?
    public async cancelOrderAsync(order: SignedOrder) {
      const txHash = await this.zeroEx.exchange.cancelOrderAsync(order, order.takerTokenAmount);
      this.events.emit('transactionPending', txHash);
      // const receipt = await this.zeroEx.awaitTransactionMinedAsync(txHash);
      return txHash;
    }

}
