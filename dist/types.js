"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("@radarrelay/types"));
var WalletType;
(function (WalletType) {
    WalletType[WalletType["Local"] = 0] = "Local";
    WalletType[WalletType["Rpc"] = 1] = "Rpc";
    WalletType[WalletType["Injected"] = 2] = "Injected";
    WalletType[WalletType["Ledger"] = 3] = "Ledger";
})(WalletType = exports.WalletType || (exports.WalletType = {}));
var InjectedWalletType;
(function (InjectedWalletType) {
    InjectedWalletType["Metmask"] = "metamask";
})(InjectedWalletType = exports.InjectedWalletType || (exports.InjectedWalletType = {}));
var InfuraNetwork;
(function (InfuraNetwork) {
    InfuraNetwork["Mainnet"] = "mainnet";
    InfuraNetwork["Kovan"] = "kovan";
    InfuraNetwork["Rinkeby"] = "rinkeby";
    InfuraNetwork["Ropsten"] = "ropsten";
})(InfuraNetwork = exports.InfuraNetwork || (exports.InfuraNetwork = {}));
var NetwordId;
(function (NetwordId) {
    NetwordId[NetwordId["Mainnet"] = 1] = "Mainnet";
    NetwordId[NetwordId["Kovan"] = 42] = "Kovan";
    NetwordId[NetwordId["Rinkeby"] = 4] = "Rinkeby";
    NetwordId[NetwordId["Ropsten"] = 3] = "Ropsten";
})(NetwordId = exports.NetwordId || (exports.NetwordId = {}));
var EventName;
(function (EventName) {
    EventName["Loading"] = "loading";
    EventName["EthereumInitialized"] = "ethereumInitialized";
    EventName["EthereumNetworkIdInitialized"] = "ethereumNetworkIdInitialized";
    EventName["ZeroExInitialized"] = "zeroExInitialized";
    EventName["TokensInitialized"] = "tokensInitialized";
    EventName["AccountInitialized"] = "accountInitialized";
    EventName["TradeInitialized"] = "tradeInitialized";
    EventName["MarketsInitialized"] = "marketsInitialized";
    EventName["TransactionPending"] = "transactionPending";
    EventName["TransactionComplete"] = "transactionComplete";
    EventName["AddressChanged"] = "addressChanged";
})(EventName = exports.EventName || (exports.EventName = {}));
var SdkError;
(function (SdkError) {
    SdkError["InvalidOrMissingEndpoints"] = "INVALID_OR_MISSING_RADAR_RELAY_ENDPOINTS";
    SdkError["WebSocketDisconnected"] = "WEBSOCKET_DISCONNECTED";
    SdkError["UnableToRetrieveAccount"] = "UNABLE_TO_RETRIEVE_ACCOUNT";
})(SdkError = exports.SdkError || (exports.SdkError = {}));
