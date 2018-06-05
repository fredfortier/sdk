import { RadarError } from './RadarError';
import { ContractWrappersError,
  OrderError,
  BlockchainCallErrs,
  ExchangeContractErrs } from './ZeroExErrors';

export const ErrorFormatter = {
  formatRadarError(error: Error) {
    const radarErrorMessage =
      contractWrappersErrorToHumanReadableError[error.message] ||
      exchangeContractErrorToHumanReadableError[error.message];

    if (radarErrorMessage) {
      throw new RadarError(radarErrorMessage);
    }
   throw error;
  }
};

// ZeroEx Çontract Wrapper Errors
const contractWrappersErrorToHumanReadableError: { [error: string]: string } = {
  [ContractWrappersError.ExchangeContractDoesNotExist]: 'Exchange contract does not exist',
  [ContractWrappersError.EtherTokenContractDoesNotExist]: 'EtherToken contract does not exist',
  [ContractWrappersError.TokenTransferProxyContractDoesNotExist]:
      'TokenTransferProxy contract does not exist',
  [ContractWrappersError.TokenRegistryContractDoesNotExist]: 'TokenRegistry contract does not exist',
  [ContractWrappersError.TokenContractDoesNotExist]: 'Token contract does not exist',
  [ContractWrappersError.ZRXContractDoesNotExist]: 'ZRX contract does not exist',
  [BlockchainCallErrs.UserHasNoAssociatedAddresses]: 'User has no addresses available',
  [OrderError.InvalidSignature]: 'Order signature is not valid',
  [ContractWrappersError.ContractNotDeployedOnNetwork]: 'Contract is not deployed on the detected network',
  [ContractWrappersError.InvalidJump]: 'Invalid jump occured while executing the transaction',
  [ContractWrappersError.OutOfGas]: 'Transaction ran out of gas',
};

// ZeroEx Exchange Contract Errors
const exchangeContractErrorToHumanReadableError: { [error: string]: string } = {
  [ExchangeContractErrs.OrderFillExpired]: 'This order has expired',
  [ExchangeContractErrs.OrderCancelExpired]: 'This order has expired',
  [ExchangeContractErrs.OrderCancelAmountZero]: 'Order cancel amount can\'t be 0',
  [ExchangeContractErrs.OrderAlreadyCancelledOrFilled]: 'This order has already been completely filled or cancelled',
  [ExchangeContractErrs.OrderFillAmountZero]: 'Order fill amount can\'t be 0',
  [ExchangeContractErrs.OrderRemainingFillAmountZero]: 'This order has already been completely filled or cancelled',
  [ExchangeContractErrs.OrderFillRoundingError]:
    'Rounding error will occur when filling this order. Please try filling a different amount.',
  [ExchangeContractErrs.InsufficientTakerBalance]: 'Taker no longer has a sufficient balance to complete this order',
  [ExchangeContractErrs.InsufficientTakerAllowance]:
    'Taker no longer has a sufficient allowance to complete this order',
  [ExchangeContractErrs.InsufficientMakerBalance]:
    'Maker no longer has a sufficient balance to complete this order',
  [ExchangeContractErrs.InsufficientMakerAllowance]:
    'Maker no longer has a sufficient allowance to complete this order',
  [ExchangeContractErrs.InsufficientTakerFeeBalance]: 'Taker no longer has a sufficient balance to pay fees',
  [ExchangeContractErrs.InsufficientTakerFeeAllowance]:
    'Taker no longer has a sufficient allowance to pay fees',
  [ExchangeContractErrs.InsufficientMakerFeeBalance]: 'Maker no longer has a sufficient balance to pay fees',
  [ExchangeContractErrs.InsufficientMakerFeeAllowance]:
    'Maker no longer has a sufficient allowance to pay fees',
  [ExchangeContractErrs.TransactionSenderIsNotFillOrderTaker]: `This order can only be filled by the specified taker`,
  [ExchangeContractErrs.InsufficientRemainingFillAmount]: 'Insufficient remaining fill amount',
};
