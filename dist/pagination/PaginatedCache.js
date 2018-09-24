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
// Vendor
var axios_1 = require("axios");
var PaginatedCache = /** @class */ (function () {
    // --- Constructor --- //
    function PaginatedCache(initialPage, perPage, endpoint) {
        this._cache = new Map();
        this._endpoint = endpoint;
        this.page = initialPage;
        this.perPage = perPage;
    }
    Object.defineProperty(PaginatedCache.prototype, "cache", {
        // --- Getters/setters --- //
        get: function () {
            return new Map(this._cache);
        },
        enumerable: true,
        configurable: true
    });
    // --- Exposed methods --- //
    PaginatedCache.prototype.getPageAsync = function (page, perPage) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this._endpoint, {
                            params: { page: page, perPage: perPage }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this._cacheResponseData(response)];
                }
            });
        });
    };
    PaginatedCache.prototype.getNextPageAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPageAsync(this.page, this.perPage)];
                    case 1:
                        data = _a.sent();
                        this.page++;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Object.defineProperty(PaginatedCache.prototype, "size", {
        // --- Mock relevant ES6 Map properties/methods--- //
        get: function () {
            return this._cache.size;
        },
        enumerable: true,
        configurable: true
    });
    PaginatedCache.prototype.clear = function () {
        return this._cache.clear();
    };
    PaginatedCache.prototype.delete = function (key) {
        return this._cache.delete(key);
    };
    PaginatedCache.prototype.forEach = function (callbackfn, thisArg) {
        return this._cache.forEach(callbackfn, thisArg);
    };
    PaginatedCache.prototype.entries = function () {
        return this._cache.entries();
    };
    PaginatedCache.prototype.values = function () {
        return this._cache.values();
    };
    PaginatedCache.prototype.has = function (key) {
        return this._cache.has(key);
    };
    PaginatedCache.prototype.keys = function () {
        return this._cache.keys();
    };
    PaginatedCache.prototype[Symbol.iterator] = function () {
        return this._cache.entries();
    };
    // --- Internal protected methods --- //
    PaginatedCache.prototype._cacheResponseData = function (response) {
        var _this = this;
        var data = new Map();
        if (Array.isArray(response.data)) {
            response.data.forEach(function (item) {
                var transformedData = _this._transformResponseData(item);
                data.set(transformedData[0], transformedData[1]);
                _this._cache.set(transformedData[0], transformedData[1]);
            });
        }
        else {
            var transformedData = this._transformResponseData(response.data);
            data.set(transformedData[0], transformedData[1]);
            this._cache.set(transformedData[0], transformedData[1]);
        }
        return data;
    };
    return PaginatedCache;
}());
exports.PaginatedCache = PaginatedCache;
