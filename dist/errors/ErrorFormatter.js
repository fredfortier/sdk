"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RadarError_1 = require("./RadarError");
var ZeroExErrors_1 = require("./ZeroExErrors");
exports.ErrorFormatter = {
    formatRadarError: function (error) {
        var radarErrorMessage = ZeroExErrors_1.contractWrappersErrorToHumanReadableError[error.message] ||
            ZeroExErrors_1.exchangeContractErrorToHumanReadableError[error.message];
        if (radarErrorMessage) {
            throw new RadarError_1.RadarError(radarErrorMessage);
        }
        throw error;
    }
};
