"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b;
var ContractWrappersError;
(function (ContractWrappersError) {
    ContractWrappersError["ExchangeContractDoesNotExist"] = "EXCHANGE_CONTRACT_DOES_NOT_EXIST";
    ContractWrappersError["ZRXContractDoesNotExist"] = "ZRX_CONTRACT_DOES_NOT_EXIST";
    ContractWrappersError["EtherTokenContractDoesNotExist"] = "ETHER_TOKEN_CONTRACT_DOES_NOT_EXIST";
    ContractWrappersError["TokenTransferProxyContractDoesNotExist"] = "TOKEN_TRANSFER_PROXY_CONTRACT_DOES_NOT_EXIST";
    ContractWrappersError["TokenRegistryContractDoesNotExist"] = "TOKEN_REGISTRY_CONTRACT_DOES_NOT_EXIST";
    ContractWrappersError["TokenContractDoesNotExist"] = "TOKEN_CONTRACT_DOES_NOT_EXIST";
    ContractWrappersError["ContractNotDeployedOnNetwork"] = "CONTRACT_NOT_DEPLOYED_ON_NETWORK";
    ContractWrappersError["InsufficientAllowanceForTransfer"] = "INSUFFICIENT_ALLOWANCE_FOR_TRANSFER";
    ContractWrappersError["InsufficientBalanceForTransfer"] = "INSUFFICIENT_BALANCE_FOR_TRANSFER";
    ContractWrappersError["InsufficientEthBalanceForDeposit"] = "INSUFFICIENT_ETH_BALANCE_FOR_DEPOSIT";
    ContractWrappersError["InsufficientWEthBalanceForWithdrawal"] = "INSUFFICIENT_WETH_BALANCE_FOR_WITHDRAWAL";
    ContractWrappersError["InvalidJump"] = "INVALID_JUMP";
    ContractWrappersError["OutOfGas"] = "OUT_OF_GAS";
    ContractWrappersError["SubscriptionNotFound"] = "SUBSCRIPTION_NOT_FOUND";
    ContractWrappersError["SubscriptionAlreadyPresent"] = "SUBSCRIPTION_ALREADY_PRESENT";
})(ContractWrappersError || (ContractWrappersError = {}));
var OrderError;
(function (OrderError) {
    OrderError["InvalidSignature"] = "INVALID_SIGNATURE";
})(OrderError || (OrderError = {}));
var BlockchainCallErrs;
(function (BlockchainCallErrs) {
    BlockchainCallErrs["ContractDoesNotExist"] = "CONTRACT_DOES_NOT_EXIST";
    BlockchainCallErrs["UserHasNoAssociatedAddresses"] = "USER_HAS_NO_ASSOCIATED_ADDRESSES";
    BlockchainCallErrs["UnhandledError"] = "UNHANDLED_ERROR";
    BlockchainCallErrs["TokenAddressIsInvalid"] = "TOKEN_ADDRESS_IS_INVALID";
})(BlockchainCallErrs || (BlockchainCallErrs = {}));
var ExchangeContractErrs;
(function (ExchangeContractErrs) {
    ExchangeContractErrs["OrderFillExpired"] = "ORDER_FILL_EXPIRED";
    ExchangeContractErrs["OrderCancelExpired"] = "ORDER_CANCEL_EXPIRED";
    ExchangeContractErrs["OrderCancelAmountZero"] = "ORDER_CANCEL_AMOUNT_ZERO";
    ExchangeContractErrs["OrderAlreadyCancelledOrFilled"] = "ORDER_ALREADY_CANCELLED_OR_FILLED";
    ExchangeContractErrs["OrderFillAmountZero"] = "ORDER_FILL_AMOUNT_ZERO";
    ExchangeContractErrs["OrderRemainingFillAmountZero"] = "ORDER_REMAINING_FILL_AMOUNT_ZERO";
    ExchangeContractErrs["OrderFillRoundingError"] = "ORDER_FILL_ROUNDING_ERROR";
    ExchangeContractErrs["FillBalanceAllowanceError"] = "FILL_BALANCE_ALLOWANCE_ERROR";
    ExchangeContractErrs["InsufficientTakerBalance"] = "INSUFFICIENT_TAKER_BALANCE";
    ExchangeContractErrs["InsufficientTakerAllowance"] = "INSUFFICIENT_TAKER_ALLOWANCE";
    ExchangeContractErrs["InsufficientMakerBalance"] = "INSUFFICIENT_MAKER_BALANCE";
    ExchangeContractErrs["InsufficientMakerAllowance"] = "INSUFFICIENT_MAKER_ALLOWANCE";
    ExchangeContractErrs["InsufficientTakerFeeBalance"] = "INSUFFICIENT_TAKER_FEE_BALANCE";
    ExchangeContractErrs["InsufficientTakerFeeAllowance"] = "INSUFFICIENT_TAKER_FEE_ALLOWANCE";
    ExchangeContractErrs["InsufficientMakerFeeBalance"] = "INSUFFICIENT_MAKER_FEE_BALANCE";
    ExchangeContractErrs["InsufficientMakerFeeAllowance"] = "INSUFFICIENT_MAKER_FEE_ALLOWANCE";
    ExchangeContractErrs["TransactionSenderIsNotFillOrderTaker"] = "TRANSACTION_SENDER_IS_NOT_FILL_ORDER_TAKER";
    ExchangeContractErrs["MultipleMakersInSingleCancelBatchDisallowed"] = "MULTIPLE_MAKERS_IN_SINGLE_CANCEL_BATCH_DISALLOWED";
    ExchangeContractErrs["InsufficientRemainingFillAmount"] = "INSUFFICIENT_REMAINING_FILL_AMOUNT";
    ExchangeContractErrs["MultipleTakerTokensInFillUpToDisallowed"] = "MULTIPLE_TAKER_TOKENS_IN_FILL_UP_TO_DISALLOWED";
    ExchangeContractErrs["BatchOrdersMustHaveSameExchangeAddress"] = "BATCH_ORDERS_MUST_HAVE_SAME_EXCHANGE_ADDRESS";
    ExchangeContractErrs["BatchOrdersMustHaveAtLeastOneItem"] = "BATCH_ORDERS_MUST_HAVE_AT_LEAST_ONE_ITEM";
})(ExchangeContractErrs || (ExchangeContractErrs = {}));
// Human Readable Çontract Wrapper Errors
exports.contractWrappersErrorToHumanReadableError = (_a = {},
    _a[ContractWrappersError.ExchangeContractDoesNotExist] = 'Exchange contract does not exist',
    _a[ContractWrappersError.EtherTokenContractDoesNotExist] = 'EtherToken contract does not exist',
    _a[ContractWrappersError.TokenTransferProxyContractDoesNotExist] = 'TokenTransferProxy contract does not exist',
    _a[ContractWrappersError.TokenRegistryContractDoesNotExist] = 'TokenRegistry contract does not exist',
    _a[ContractWrappersError.TokenContractDoesNotExist] = 'Token contract does not exist',
    _a[ContractWrappersError.ZRXContractDoesNotExist] = 'ZRX contract does not exist',
    _a[BlockchainCallErrs.UserHasNoAssociatedAddresses] = 'User has no addresses available',
    _a[OrderError.InvalidSignature] = 'Order signature is not valid',
    _a[ContractWrappersError.ContractNotDeployedOnNetwork] = 'Contract is not deployed on the detected network',
    _a[ContractWrappersError.InvalidJump] = 'Invalid jump occured while executing the transaction',
    _a[ContractWrappersError.OutOfGas] = 'Transaction ran out of gas',
    _a);
// Human Readable Exchange Çontract Errors
exports.exchangeContractErrorToHumanReadableError = (_b = {},
    _b[ExchangeContractErrs.OrderFillExpired] = 'This order has expired',
    _b[ExchangeContractErrs.OrderCancelExpired] = 'This order has expired',
    _b[ExchangeContractErrs.OrderCancelAmountZero] = 'Order cancel amount can\'t be 0',
    _b[ExchangeContractErrs.OrderAlreadyCancelledOrFilled] = 'This order has already been completely filled or cancelled',
    _b[ExchangeContractErrs.OrderFillAmountZero] = 'Order fill amount can\'t be 0',
    _b[ExchangeContractErrs.OrderRemainingFillAmountZero] = 'This order has already been completely filled or cancelled',
    _b[ExchangeContractErrs.OrderFillRoundingError] = 'Rounding error will occur when filling this order. Please try filling a different amount.',
    _b[ExchangeContractErrs.InsufficientTakerBalance] = 'Taker no longer has a sufficient balance to complete this order',
    _b[ExchangeContractErrs.InsufficientTakerAllowance] = 'Taker no longer has a sufficient allowance to complete this order',
    _b[ExchangeContractErrs.InsufficientMakerBalance] = 'Maker no longer has a sufficient balance to complete this order',
    _b[ExchangeContractErrs.InsufficientMakerAllowance] = 'Maker no longer has a sufficient allowance to complete this order',
    _b[ExchangeContractErrs.InsufficientTakerFeeBalance] = 'Taker no longer has a sufficient balance to pay fees',
    _b[ExchangeContractErrs.InsufficientTakerFeeAllowance] = 'Taker no longer has a sufficient allowance to pay fees',
    _b[ExchangeContractErrs.InsufficientMakerFeeBalance] = 'Maker no longer has a sufficient balance to pay fees',
    _b[ExchangeContractErrs.InsufficientMakerFeeAllowance] = 'Maker no longer has a sufficient allowance to pay fees',
    _b[ExchangeContractErrs.TransactionSenderIsNotFillOrderTaker] = "This order can only be filled by the specified taker",
    _b[ExchangeContractErrs.InsufficientRemainingFillAmount] = 'Insufficient remaining fill amount',
    _b);
