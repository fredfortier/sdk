"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SDKInitLifeCycle = /** @class */ (function () {
    function SDKInitLifeCycle(events, priorityList, timeout) {
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
                this._events.on(item.event, this.handleEvent.bind(this, item.event));
            }
        }
    }
    // Bind the function calls that will
    // get called in order of the priorityList.
    //
    // The scope is the class that the
    // functions belong to.
    SDKInitLifeCycle.prototype.setup = function (scope) {
        var _a;
        for (var _i = 0, _b = this._priorityList; _i < _b.length; _i++) {
            var item = _b[_i];
            if (item.func) {
                if (item.args) {
                    this._events.on(item.event, (_a = item.func).bind.apply(_a, [scope].concat(item.args)));
                }
                else {
                    this._events.on(item.event, item.func.bind(scope));
                }
            }
        }
    };
    SDKInitLifeCycle.prototype.promise = function (event) {
        var _this = this;
        if (this._runInterval)
            return Promise.resolve(true);
        this._current = this._priority[event];
        this._startTime = new Date().getTime();
        return new Promise(function (resolve, reject) {
            _this._runInterval = setInterval(_this.checkEventProgress.bind(_this, resolve, reject), 100);
        });
    };
    SDKInitLifeCycle.prototype.checkEventProgress = function (resolve, reject) {
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
    SDKInitLifeCycle.prototype.handleEvent = function (event) {
        var current = this._priority[event];
        this._current = (current >= this._current) ? current : this._current;
        var progressPerc = Math.floor((this._current / this._last) * 100);
        this._events.emit('loading', {
            progress: progressPerc || 0,
            elapsedTime: (new Date().getTime() - this._startTime),
            source: this.constructor.name + ':' + event
        });
    };
    return SDKInitLifeCycle;
}());
exports.SDKInitLifeCycle = SDKInitLifeCycle;
