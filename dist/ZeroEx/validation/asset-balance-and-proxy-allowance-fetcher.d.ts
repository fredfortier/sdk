import { BlockParamLiteral, ERC20TokenWrapper, ERC721TokenWrapper } from '@0xproject/contract-wrappers';
import { AbstractBalanceAndProxyAllowanceFetcher } from '@0xproject/order-utils';
import { BigNumber } from 'bignumber.js';
export declare class AssetBalanceAndProxyAllowanceFetcher implements AbstractBalanceAndProxyAllowanceFetcher {
    private readonly _erc20Token;
    private readonly _erc721Token;
    private readonly _stateLayer;
    constructor(erc20Token: ERC20TokenWrapper, erc721Token: ERC721TokenWrapper, stateLayer: BlockParamLiteral);
    getBalanceAsync(assetData: string, userAddress: string): Promise<BigNumber>;
    getProxyAllowanceAsync(assetData: string, userAddress: string): Promise<BigNumber>;
}
