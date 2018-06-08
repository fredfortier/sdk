import { Ethereum } from './ethereum';
import { Market } from './market';
import { Account } from './account';
import { EventEmitter } from 'events';
import { WalletType, Opts } from './types';
import { ZeroEx, ZeroExConfig, Order, SignedOrder, ECSignature, TransactionReceiptWithDecodedLogs } from '0x.js';
import { RadarToken, UserOrderType } from 'radar-types';
import BigNumber from 'bignumber.js';
import request = require('request-promise');
import { TSMap } from 'typescript-map';

export class Trade {

  private _endpoint: string;
  private _account: Account;
  private _zeroEx: ZeroEx;
  private _events: EventEmitter;
  private _tokens: TSMap<string, RadarToken>;

  constructor(
    zeroEx: ZeroEx,
    apiEndpoint: string,
    account: Account,
    events: EventEmitter,
    tokens: TSMap<string, RadarToken>) {
    this._zeroEx = zeroEx;
    this._endpoint = apiEndpoint;
    this._account = account;
    this._events = events;
    this._tokens = tokens;
  }

  public async marketOrder(
    market: Market,
    type: UserOrderType,
    quantity: BigNumber,
    opts?: Opts
  ): Promise<TransactionReceiptWithDecodedLogs | string> {

    const marketResponse = await request.post({
      url: `${this._endpoint}/markets/${market.id}/order/market`,
      json: {
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
      ZeroEx.toBaseUnitAmount(quantity, market.baseTokenDecimals.toNumber()),
      true,
      this._account.address,
      opts.transactionOpts);

    this._events.emit('transactionPending', txHash);

    if (!opts.awaitTransactionMined) {
      return txHash;
    }

    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    this._events.emit('transactionComplete', receipt);
    return receipt;
  }

  // sign and post order to book
  public async limitOrder(
    market: Market = null,
    type: UserOrderType, // ask == sell, bid == buy
    quantity: BigNumber, // base token quantity
    price: BigNumber, // price (in quote)
    expiration: BigNumber // expiration in seconds from now
  ): Promise<Order> {

    const order = await request.post({
      url: `${this._endpoint}/markets/${market.id}/order/limit`,
      json: {
        type,
        quantity: quantity.toString(), // base token in unit amounts, which is what our interfaces use
        price: price.toString(),
        expiration: expiration.toString()
      }
    });

    // add missing data
    order.exchangeContractAddress = this._zeroEx.exchange.getContractAddress();
    order.maker = this._account.address;

    // sign order
    const prefix = (this._account.walletType === WalletType.Local);
    const orderHash = ZeroEx.getOrderHashHex(order);
    const ecSignature: ECSignature = await this._zeroEx.signOrderHashAsync(orderHash, this._account.address, prefix);
    (order as SignedOrder).ecSignature = ecSignature;

    // POST order to API
    // HACK for local dev order seeding
    const orderPostURL = process.env.RADAR_SDK_ORDER_URL
      ? process.env.RADAR_SDK_ORDER_URL
      : `${this._endpoint}/orders`;

    await request.post({
      url: orderPostURL,
      json: order
    });

    return order;
  }

  // TODO fill individual order

  // cancel a signed order
  // TODO cancel partial?
  public async cancelOrderAsync(
    order: SignedOrder, opts?: Opts
  ): Promise<TransactionReceiptWithDecodedLogs | string> {
    const txHash = await this._zeroEx.exchange.cancelOrderAsync(order, order.takerTokenAmount, opts.transactionOpts);
    this._events.emit('transactionPending', txHash);

    if (!opts.awaitTransactionMined) {
      return txHash;
    }

    const receipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
    this._events.emit('transactionComplete', receipt);
    return receipt;
  }

}
