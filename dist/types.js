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
    WalletType[WalletType["Core"] = 0] = "Core";
    WalletType[WalletType["Ledger"] = 1] = "Ledger";
    WalletType[WalletType["Rpc"] = 2] = "Rpc";
})(WalletType = exports.WalletType || (exports.WalletType = {}));
var InfuraNetwork;
(function (InfuraNetwork) {
    InfuraNetwork["Mainnet"] = "mainnet";
    InfuraNetwork["Kovan"] = "kovan";
    InfuraNetwork["Rinkeby"] = "rinkeby";
    InfuraNetwork["Ropsten"] = "ropsten";
})(InfuraNetwork = exports.InfuraNetwork || (exports.InfuraNetwork = {}));
