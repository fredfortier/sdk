import {Ethereum} from './ethereum';
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

    private _endpoint: string;
    private _account: Account;
    private _zeroEx: ZeroEx;
    private _events: EventEmitter;

    constructor(
      zeroEx: ZeroEx,
      apiEndpoint: string,
      account: Account,
      events: EventEmitter) {
        this._zeroEx = zeroEx;
        this._endpoint = apiEndpoint;
        this._account = account;
        this._events = events;
    }

    public async marketOrder(
      market: Market,
      type: string = 'buy',
      quantity: BigNumber = null
    ) {

      const marketResponse = await request.post({
          url: `${this._endpoint}/markets/${market.id}/order/market`,
          json : {
            type,
            quantity: quantity.toString(), // base token in unit amounts, which is what our interfaces use
          }
      });

      marketResponse.orders.forEach((order, i) => {
        marketResponse.orders[i].takerTokenAmount = new BigNumber(order.takerTokenAmount);
        marketResponse.orders[i].makerTokenAmount = new BigNumber(order.makerTokenAmount);
        marketResponse.orders[i].expirationUnixTimestampSec = new BigNumber(order.expirationUnixTimestampSec);
      });

      const txHash = await this._zeroEx.exchange.fillOrdersUpToAsync(
        marketResponse.orders,
        quantity.times(10).pow(market.baseTokenDecimals.toNumber()),
        true,
        this._account.address);

      this._events.emit('transactionPending', txHash);
      const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
      this._events.emit('transactionMined', receipt);

      return receipt;
    }

    // sign and post order to book
    public async limitOrder(
      market: Market = null,
      type: string = 'buy', // ask == sell, bid == buy
      quantity: BigNumber, // base token quantity
      price: BigNumber, // price (in quote)
      expiration: BigNumber // expiration in seconds from now
    ) {

      const order = await request.post({
          url: `${this._endpoint}/markets/${market.id}/order/limit`,
          json : {
            type,
            quantity: quantity.toString(), // base token in unit amounts, which is what our interfaces use
            price: price.toString(),
            expiration: expiration.toString()
          }
      });

      // TODO this appears to be
      // broken, remove once fixed
      if (type === 'sell') {
        order.takerTokenAmount = new BigNumber(order.makerTokenAmount).times(price).floor().toString();
      } else {
        order.makerTokenAmount = new BigNumber(order.takerTokenAmount).times(price).floor().toString();
      }

      // add missing data
      order.exchangeContractAddress = this._zeroEx.exchange.getContractAddress();
      order.maker = this._account.address;

      // sign order
      const orderHash = ZeroEx.getOrderHashHex(order);
      const ecSignature: ECSignature = await this._zeroEx.signOrderHashAsync(orderHash, this._account.address, false);
      (order as SignedOrder).ecSignature = ecSignature;

      // POST order to API
      await request.post({
          url: `${this._endpoint}/orders`,
          json : order
      });

      return order;
    }

    // TODO fill individual order

    // cancel a signed order
    // TODO cancel partial?
    public async cancelOrderAsync(order: SignedOrder) {
      const txHash = await this._zeroEx.exchange.cancelOrderAsync(order, order.takerTokenAmount);
      this._events.emit('transactionPending', txHash);
      const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
      this._events.emit('transactionMined', receipt);
      return receipt;
    }

}
