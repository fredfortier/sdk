export enum ContractWrappersError {
  ExchangeContractDoesNotExist = 'EXCHANGE_CONTRACT_DOES_NOT_EXIST',
  ZRXContractDoesNotExist = 'ZRX_CONTRACT_DOES_NOT_EXIST',
  EtherTokenContractDoesNotExist = 'ETHER_TOKEN_CONTRACT_DOES_NOT_EXIST',
  TokenTransferProxyContractDoesNotExist = 'TOKEN_TRANSFER_PROXY_CONTRACT_DOES_NOT_EXIST',
  TokenRegistryContractDoesNotExist = 'TOKEN_REGISTRY_CONTRACT_DOES_NOT_EXIST',
  TokenContractDoesNotExist = 'TOKEN_CONTRACT_DOES_NOT_EXIST',
  ContractNotDeployedOnNetwork = 'CONTRACT_NOT_DEPLOYED_ON_NETWORK',
  InsufficientAllowanceForTransfer = 'INSUFFICIENT_ALLOWANCE_FOR_TRANSFER',
  InsufficientBalanceForTransfer = 'INSUFFICIENT_BALANCE_FOR_TRANSFER',
  InsufficientEthBalanceForDeposit = 'INSUFFICIENT_ETH_BALANCE_FOR_DEPOSIT',
  InsufficientWEthBalanceForWithdrawal = 'INSUFFICIENT_WETH_BALANCE_FOR_WITHDRAWAL',
  InvalidJump = 'INVALID_JUMP',
  OutOfGas = 'OUT_OF_GAS',
  SubscriptionNotFound = 'SUBSCRIPTION_NOT_FOUND',
  SubscriptionAlreadyPresent = 'SUBSCRIPTION_ALREADY_PRESENT',
}

export enum OrderError {
  InvalidSignature = 'INVALID_SIGNATURE',
}

export enum BlockchainCallErrs {
  ContractDoesNotExist = 'CONTRACT_DOES_NOT_EXIST',
  UserHasNoAssociatedAddresses = 'USER_HAS_NO_ASSOCIATED_ADDRESSES',
  UnhandledError = 'UNHANDLED_ERROR',
  TokenAddressIsInvalid = 'TOKEN_ADDRESS_IS_INVALID',
}

export enum ExchangeContractErrs {
  OrderFillExpired = 'ORDER_FILL_EXPIRED',
  OrderCancelExpired = 'ORDER_CANCEL_EXPIRED',
  OrderCancelAmountZero = 'ORDER_CANCEL_AMOUNT_ZERO',
  OrderAlreadyCancelledOrFilled = 'ORDER_ALREADY_CANCELLED_OR_FILLED',
  OrderFillAmountZero = 'ORDER_FILL_AMOUNT_ZERO',
  OrderRemainingFillAmountZero = 'ORDER_REMAINING_FILL_AMOUNT_ZERO',
  OrderFillRoundingError = 'ORDER_FILL_ROUNDING_ERROR',
  FillBalanceAllowanceError = 'FILL_BALANCE_ALLOWANCE_ERROR',
  InsufficientTakerBalance = 'INSUFFICIENT_TAKER_BALANCE',
  InsufficientTakerAllowance = 'INSUFFICIENT_TAKER_ALLOWANCE',
  InsufficientMakerBalance = 'INSUFFICIENT_MAKER_BALANCE',
  InsufficientMakerAllowance = 'INSUFFICIENT_MAKER_ALLOWANCE',
  InsufficientTakerFeeBalance = 'INSUFFICIENT_TAKER_FEE_BALANCE',
  InsufficientTakerFeeAllowance = 'INSUFFICIENT_TAKER_FEE_ALLOWANCE',
  InsufficientMakerFeeBalance = 'INSUFFICIENT_MAKER_FEE_BALANCE',
  InsufficientMakerFeeAllowance = 'INSUFFICIENT_MAKER_FEE_ALLOWANCE',
  TransactionSenderIsNotFillOrderTaker = 'TRANSACTION_SENDER_IS_NOT_FILL_ORDER_TAKER',
  MultipleMakersInSingleCancelBatchDisallowed = 'MULTIPLE_MAKERS_IN_SINGLE_CANCEL_BATCH_DISALLOWED',
  InsufficientRemainingFillAmount = 'INSUFFICIENT_REMAINING_FILL_AMOUNT',
  MultipleTakerTokensInFillUpToDisallowed = 'MULTIPLE_TAKER_TOKENS_IN_FILL_UP_TO_DISALLOWED',
  BatchOrdersMustHaveSameExchangeAddress = 'BATCH_ORDERS_MUST_HAVE_SAME_EXCHANGE_ADDRESS',
  BatchOrdersMustHaveAtLeastOneItem = 'BATCH_ORDERS_MUST_HAVE_AT_LEAST_ONE_ITEM',
}
