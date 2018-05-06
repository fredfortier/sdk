"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SDKInitLifeCycle {
    constructor(events, priorityList, timeout = 10000) {
        this.priority = {};
        this.priorityList = priorityList;
        this.events = events;
        this.timeout = timeout;
        // Setup the priority event map and
        // event handlers which maintains
        // the current loaded event priority
        this.last = (priorityList.length - 1);
        for (const index in priorityList) {
            if (priorityList.hasOwnProperty(index)) {
                const item = priorityList[index];
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
    setup(scope) {
        for (const item of this.priorityList) {
            if (item.func) {
                if (item.args) {
                    this.events.on(item.event, item.func.bind(scope, ...item.args));
                }
                else {
                    this.events.on(item.event, item.func.bind(scope));
                }
            }
        }
    }
    promise(event) {
        if (this.runInterval)
            return Promise.resolve(true);
        this.current = this.priority[event];
        this.startTime = new Date().getTime();
        return new Promise((resolve, reject) => {
            this.runInterval = setInterval(this.checkEventProgress.bind(this, resolve, reject), 100);
        });
    }
    checkEventProgress(resolve, reject) {
        const now = new Date().getTime();
        if (now - this.startTime >= this.timeout) {
            clearInterval(this.runInterval);
            this.runInterval = undefined;
            return reject(`SDK init lifecycle timed out after ${this.timeout}ms`);
        }
        if (this.current >= this.last) {
            clearInterval(this.runInterval);
            this.runInterval = undefined;
            return resolve(true);
        }
    }
    handleEvent(event) {
        const current = this.priority[event];
        this.current = (current >= this.current) ? current : this.current;
        const progressPerc = Math.floor((this.current / this.last) * 100);
        this.events.emit('loading', {
            progress: progressPerc || 0,
            elapsedTime: (new Date().getTime() - this.startTime),
            source: this.constructor.name + ':' + event
        });
    }
}
exports.SDKInitLifeCycle = SDKInitLifeCycle;
