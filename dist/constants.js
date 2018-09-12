"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
exports.RADAR_RELAY_ENDPOINTS = function (network) {
    switch (network) {
        case types_1.NetwordId.Mainnet:
            return {
                radarRestEndpoint: 'https://api-beta.rrdev.io/v2',
                radarWebsocketEndpoint: 'wss://api-beta.rrdev.io/v2'
            };
        case types_1.NetwordId.Kovan:
            return {
                radarRestEndpoint: 'https://api.kovan.radarrelay.com/v2',
                radarWebsocketEndpoint: 'wss://ws.kovan.radarrelay.com/ws',
            };
        default:
            throw new Error("Unsupported Network: " + (types_1.NetwordId[network] || 'Unknown'));
    }
};
