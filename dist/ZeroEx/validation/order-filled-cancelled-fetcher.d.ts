import { BlockParamLiteral, ExchangeWrapper } from '@0xproject/contract-wrappers';
import { AbstractOrderFilledCancelledFetcher } from '@0xproject/order-utils';
import { BigNumber } from 'bignumber.js';
export declare class OrderFilledCancelledFetcher implements AbstractOrderFilledCancelledFetcher {
    private readonly _exchange;
    private readonly _stateLayer;
    constructor(exchange: ExchangeWrapper, stateLayer: BlockParamLiteral);
    getFilledTakerAmountAsync(orderHash: string): Promise<BigNumber>;
    isOrderCancelledAsync(orderHash: string): Promise<boolean>;
    getZRXAssetData(): string;
}
