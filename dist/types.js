"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PayloadType;
(function (PayloadType) {
    PayloadType[PayloadType["Tx"] = 0] = "Tx";
    PayloadType[PayloadType["Msg"] = 1] = "Msg";
    PayloadType[PayloadType["PersonalMsg"] = 2] = "PersonalMsg";
})(PayloadType = exports.PayloadType || (exports.PayloadType = {}));
var WalletType;
(function (WalletType) {
    WalletType[WalletType["Local"] = 0] = "Local";
    WalletType[WalletType["Rpc"] = 1] = "Rpc";
    WalletType[WalletType["Injected"] = 2] = "Injected";
    WalletType[WalletType["Ledger"] = 3] = "Ledger";
})(WalletType = exports.WalletType || (exports.WalletType = {}));
var InjectedWalletType;
(function (InjectedWalletType) {
    InjectedWalletType[InjectedWalletType["Metmask"] = 0] = "Metmask";
})(InjectedWalletType = exports.InjectedWalletType || (exports.InjectedWalletType = {}));
var InfuraNetwork;
(function (InfuraNetwork) {
    InfuraNetwork["Mainnet"] = "mainnet";
    InfuraNetwork["Kovan"] = "kovan";
    InfuraNetwork["Rinkeby"] = "rinkeby";
    InfuraNetwork["Ropsten"] = "ropsten";
})(InfuraNetwork = exports.InfuraNetwork || (exports.InfuraNetwork = {}));
