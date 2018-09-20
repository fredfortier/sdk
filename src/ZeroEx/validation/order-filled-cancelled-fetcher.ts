import { BlockParamLiteral, ExchangeWrapper } from '@0xproject/contract-wrappers';
import { AbstractOrderFilledCancelledFetcher } from '@0xproject/order-utils';
import { BigNumber } from 'bignumber.js';

export class OrderFilledCancelledFetcher implements AbstractOrderFilledCancelledFetcher {

  // --- Properties --- //

  private readonly _exchange: ExchangeWrapper;
  private readonly _stateLayer: BlockParamLiteral;

  // --- Constructor --- //

  constructor(exchange: ExchangeWrapper, stateLayer: BlockParamLiteral) {
    this._exchange = exchange;
    this._stateLayer = stateLayer;
  }

  // --- Business logic --- //

  public async getFilledTakerAmountAsync(orderHash: string): Promise<BigNumber> {
    return this._exchange.getFilledTakerAssetAmountAsync(orderHash, {
      defaultBlock: this._stateLayer,
    });
  }

  public async isOrderCancelledAsync(orderHash: string): Promise<boolean> {
    return this._exchange.isCancelledAsync(orderHash);
  }

  public getZRXAssetData(): string {
    return this._exchange.getZRXAssetData();
  }

}
