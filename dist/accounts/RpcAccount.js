"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAccount_1 = require("./BaseAccount");
var types_1 = require("../types");
var RpcAccount = /** @class */ (function (_super) {
    __extends(RpcAccount, _super);
    function RpcAccount() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = types_1.WalletType.Rpc;
        return _this;
    }
    return RpcAccount;
}(BaseAccount_1.BaseAccount));
exports.RpcAccount = RpcAccount;
