"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_wrapper_1 = require("@0xproject/web3-wrapper");
var _0x_js_1 = require("0x.js");
var order_utils_1 = require("@0xproject/order-utils");
var bignumber_js_1 = require("bignumber.js");
var order_filled_cancelled_fetcher_1 = require("./validation/order-filled-cancelled-fetcher");
var asset_balance_and_proxy_allowance_fetcher_1 = require("./validation/asset-balance-and-proxy-allowance-fetcher");
/**
 * This class includes all the functionality related to 0x packages instantiation
 */
var ZeroEx = /** @class */ (function () {
    /**
     * Instantiate ZeroEx
     * @public
     * @param Provider  provider  Web3 Provider instance to use
     * @param ContractWrappersConfig  config  Should contain for example desired networkId
     */
    function ZeroEx(provider, config) {
        this._initialized = false;
        if (this._initialized) {
            return this;
        }
        this._initialized = true;
        this._provider = provider;
        this._web3WrapperInstance = new web3_wrapper_1.Web3Wrapper(provider);
        this._contractWrappers = new _0x_js_1.ContractWrappers(provider, config);
        this.exchange = this._contractWrappers.exchange;
        this.erc20Proxy = this._contractWrappers.erc20Proxy;
        this.erc20Token = this._contractWrappers.erc20Token;
        this.erc721Token = this._contractWrappers.erc721Token;
        this.etherToken = this._contractWrappers.etherToken;
        // Set contract address
        this._exchangeContractAddress = this.exchange.getContractAddress();
        // Create order validation utils
        this._zrxAssetData = this.exchange.getZRXAssetData();
        var simpleOrderFilledCancelledFetcher = new order_filled_cancelled_fetcher_1.OrderFilledCancelledFetcher(this.exchange, _0x_js_1.BlockParamLiteral.Latest);
        this._orderValidationUtils = new order_utils_1.OrderValidationUtils(simpleOrderFilledCancelledFetcher);
        var assetBalanceAndProxyAllowanceFetcher = new asset_balance_and_proxy_allowance_fetcher_1.AssetBalanceAndProxyAllowanceFetcher(this.erc20Token, this.erc721Token, _0x_js_1.BlockParamLiteral.Latest);
        var balanceAndProxyAllowanceLazyStore = new order_utils_1.BalanceAndProxyAllowanceLazyStore(assetBalanceAndProxyAllowanceFetcher);
        this._exchangeTransferSimulator = new order_utils_1.ExchangeTransferSimulator(balanceAndProxyAllowanceLazyStore);
        return this;
    }
    /**
     * Get exchange contract address
     * @public
     * @return string  The exchange contract address
     */
    ZeroEx.prototype.getExchangeContractAddress = function () {
        return this._exchangeContractAddress;
    };
    /**
     * A unit amount is defined as the amount of a token above the specified decimal places (integer part).
     * E.g: If a currency has 18 decimal places, 1e18 or one quintillion of the currency is equivalent
     * to 1 unit.
     * @param   amount      The amount in baseUnits that you would like converted to units.
     * @param   decimals    The number of decimal places the unit amount has.
     * @return  The amount in units.
     */
    ZeroEx.toUnitAmount = function (amount, decimals) {
        var unitAmount = web3_wrapper_1.Web3Wrapper.toUnitAmount(amount, decimals);
        return unitAmount;
    };
    /**
     * Convert to Base Unit Amount
     * A baseUnit is defined as the smallest denomination of a token. An amount expressed in baseUnits
     * is the amount expressed in the smallest denomination.
     * E.g: 1 unit of a token with 18 decimal places is expressed in baseUnits as 1000000000000000000
     * @param   amount      The amount of units that you would like converted to baseUnits.
     * @param   decimals    The number of decimal places the unit amount has.
     * @return  The amount in baseUnits.
     */
    ZeroEx.toBaseUnitAmount = function (amount, decimals) {
        return web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(amount, decimals);
    };
    /**
     * Computes the orderHash for a supplied order.
     * @param   order   An object that conforms to the Order or SignedOrder interface definitions.
     * @return  The resulting orderHash from hashing the supplied order.
     */
    ZeroEx.getOrderHashHex = function (order) {
        return _0x_js_1.orderHashUtils.getOrderHashHex(order);
    };
    /**
     * Returns the current timestamp in milliseconds, which is used for the salt.
     * The salt can be included in a 0x order. This ensures that the order generates
     * a unique orderHash and allows orders to be canceled using CancelUpTo.
     */
    ZeroEx.generateSaltTimestamp = function () {
        return new bignumber_js_1.default(Date.now());
    };
    /**
     * Waits for a transaction to be mined and returns the transaction receipt.
     * Note that just because a transaction was mined does not mean it was
     * successful. You need to check the status code of the transaction receipt
     * to find out if it was successful, or use the helper method
     * awaitTransactionSuccessAsync.
     * @param   txHash            Transaction hash
     * @param   pollingIntervalMs How often (in ms) should we check if the transaction is mined.
     * @param   timeoutMs         How long (in ms) to poll for transaction mined until aborting.
     * @return  Transaction receipt with decoded log args.
     */
    ZeroEx.prototype.awaitTransactionMinedAsync = function (txHash, pollingInterval, timeoutMs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._web3WrapperInstance.awaitTransactionMinedAsync(txHash, pollingInterval, timeoutMs)];
            });
        });
    };
    /**
     * Retrieves the transaction receipt for a given transaction hash
     * @param txHash Transaction hash
     * @returns The transaction receipt, including it's status (0: failed, 1: succeeded or undefined: not found)
     */
    ZeroEx.prototype.getTransactionReceiptAsync = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._web3WrapperInstance.getTransactionReceiptAsync(txHash)];
            });
        });
    };
    /**
     * Signs an orderHash and returns it's elliptic curve signature and signature type.
     * This method currently supports TestRPC, Geth and Parity above and below V1.6.6
     * @param   orderHash       Hex encoded orderHash to sign.
     * @param   signerAddress   The hex encoded Ethereum address you wish to sign it with. This address
     *          must be available via the Provider supplied to 0x.js.
     * @param   signerType Different signers add/require different prefixes to be prepended to the message being signed.
     *          Since we cannot know ahead of time which signer you are using, you must supply a SignerType.
     * @return  A hex encoded string containing the Elliptic curve signature generated by signing the orderHash and the Signature Type.
     */
    ZeroEx.prototype.ecSignOrderHashAsync = function (orderHash, signerAddress, signerType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, _0x_js_1.signatureUtils.ecSignOrderHashAsync(this._provider, orderHash, signerAddress, signerType)];
            });
        });
    };
    /**
     * Validate that a signed order is fillable or throw
     * @param signedOrder The signed order to validate
     */
    ZeroEx.prototype.validateOrderFillableOrThrowAsync = function (signedOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._orderValidationUtils.validateOrderFillableOrThrowAsync(this._exchangeTransferSimulator, signedOrder, this._zrxAssetData)];
            });
        });
    };
    /**
     * When creating an order without a specified taker or feeRecipient you must supply the Solidity
     * address null type (as opposed to Javascripts `null`, `undefined` or empty string). We expose
     * this constant for your convenience.
     */
    ZeroEx.NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
    return ZeroEx;
}());
exports.ZeroEx = ZeroEx;
