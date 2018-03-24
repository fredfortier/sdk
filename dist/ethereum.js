"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require("web3");
/**
 * EthereumConnection
 */
class EthereumConnection {
    constructor(ethereumRPCUrl = '', eventBus) {
        try {
            // init ethereum network provider
            const provider = new Web3.providers.HttpProvider(ethereumRPCUrl);
            this.web3 = new Web3(provider);
            this.provider = this.web3.currentProvider;
        }
        catch (err) {
            console.error(err);
        }
    }
}
exports.EthereumConnection = EthereumConnection;
