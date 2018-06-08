"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SDKInitLifeCycle = /** @class */ (function () {
    function SDKInitLifeCycle(events, priorityList, timeout) {
        if (timeout === void 0) { timeout = 10000; }
        this.priority = {};
        this.priorityList = priorityList;
        this.events = events;
        this.timeout = timeout;
        // Setup the priority event map and
        // event handlers which maintains
        // the current loaded event priority
        this.last = (priorityList.length - 1);
        for (var index in priorityList) {
            if (priorityList.hasOwnProperty(index)) {
                var item = priorityList[index];
                this.priority[item.event] = index;
                this.events.on(item.event, this.handleEvent.bind(this, item.event));
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
        for (var _i = 0, _b = this.priorityList; _i < _b.length; _i++) {
            var item = _b[_i];
            if (item.func) {
                if (item.args) {
                    this.events.on(item.event, (_a = item.func).bind.apply(_a, [scope].concat(item.args)));
                }
                else {
                    this.events.on(item.event, item.func.bind(scope));
                }
            }
        }
    };
    SDKInitLifeCycle.prototype.promise = function (event) {
        var _this = this;
        if (this.runInterval)
            return Promise.resolve(true);
        this.current = this.priority[event];
        this.startTime = new Date().getTime();
        return new Promise(function (resolve, reject) {
            _this.runInterval = setInterval(_this.checkEventProgress.bind(_this, resolve, reject), 100);
        });
    };
    SDKInitLifeCycle.prototype.checkEventProgress = function (resolve, reject) {
        var now = new Date().getTime();
        if (now - this.startTime >= this.timeout) {
            clearInterval(this.runInterval);
            this.runInterval = undefined;
            return reject("SDK init lifecycle timed out after " + this.timeout + "ms");
        }
        if (this.current >= this.last) {
            clearInterval(this.runInterval);
            this.runInterval = undefined;
            return resolve(true);
        }
    };
    SDKInitLifeCycle.prototype.handleEvent = function (event) {
        var current = this.priority[event];
        this.current = (current >= this.current) ? current : this.current;
        var progressPerc = Math.floor((this.current / this.last) * 100);
        this.events.emit('loading', {
            progress: progressPerc || 0,
            elapsedTime: (new Date().getTime() - this.startTime),
            source: this.constructor.name + ':' + event
        });
    };
    return SDKInitLifeCycle;
}());
exports.SDKInitLifeCycle = SDKInitLifeCycle;
