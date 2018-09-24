"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var SdkInitLifeCycle = /** @class */ (function () {
    // --- Constructor --- //
    function SdkInitLifeCycle(events, priorityList, timeout) {
        if (timeout === void 0) { timeout = 10000; }
        this._priority = {};
        this._priorityList = priorityList;
        this._events = events;
        this._timeout = timeout;
        // Setup the priority event map and
        // event handlers which maintains
        // the current loaded event priority
        this._last = (priorityList.length - 1);
        for (var index in priorityList) {
            if (priorityList.hasOwnProperty(index)) {
                var item = priorityList[index];
                this._priority[item.event] = index;
                this._events.on(item.event, this._handleEvent.bind(this, item.event));
            }
        }
    }
    // --- Exposed methods --- //
    // Bind the function calls that will
    // get called in order of the priorityList.
    //
    // The scope is the class that the
    // functions belong to.
    SdkInitLifeCycle.prototype.setup = function (scope) {
        var e_1, _a, _b;
        try {
            for (var _c = __values(this._priorityList), _d = _c.next(); !_d.done; _d = _c.next()) {
                var item = _d.value;
                if (item.func) {
                    if (item.args) {
                        this._events.on(item.event, (_b = item.func).bind.apply(_b, __spread([scope], item.args)));
                    }
                    else {
                        this._events.on(item.event, item.func.bind(scope));
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    SdkInitLifeCycle.prototype.promise = function (event) {
        var _this = this;
        if (this._runInterval)
            return Promise.resolve(true);
        this._current = this._priority[event];
        this._startTime = new Date().getTime();
        return new Promise(function (resolve, reject) {
            _this._runInterval = setInterval(_this._checkEventProgress.bind(_this, resolve, reject), 100);
        });
    };
    // --- Internal methods --- //
    SdkInitLifeCycle.prototype._checkEventProgress = function (resolve, reject) {
        var now = new Date().getTime();
        if (now - this._startTime >= this._timeout) {
            clearInterval(this._runInterval);
            this._runInterval = undefined;
            return reject("SDK init lifecycle timed out after " + this._timeout + "ms");
        }
        if (this._current >= this._last) {
            clearInterval(this._runInterval);
            this._runInterval = undefined;
            return resolve(true);
        }
    };
    SdkInitLifeCycle.prototype._handleEvent = function (event) {
        var current = this._priority[event];
        this._current = (current >= this._current) ? current : this._current;
        var progressPerc = Math.floor((this._current / this._last) * 100);
        this._events.emit(types_1.EventName.Loading, {
            progress: progressPerc || 0,
            elapsedTime: (new Date().getTime() - this._startTime),
            source: this.constructor.name + ':' + event
        });
    };
    return SdkInitLifeCycle;
}());
exports.SdkInitLifeCycle = SdkInitLifeCycle;
