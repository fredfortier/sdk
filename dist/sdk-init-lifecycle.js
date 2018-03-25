"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SDKInitLifeCycle {
    constructor(events, priorityList, timeout = 10000) {
        this.priority = {};
        this.firstLoad = false;
        this.priorityList = priorityList;
        this.events = events;
        this.timeout = timeout;
        // Setup the priority event map and
        // event handlers which maintain
        // the current loaded event priority
        for (const item of priorityList) {
            this.priority[item.event] = item.priority;
            this.events.on(item.event, this.handleEvent.bind(this, item.event));
        }
    }
    // Bind the function calls that will
    // get called in order of the priorityList.
    //
    // The scope is the class that the
    // functions belong to.
    setup(scope) {
        console.log('Radar Relay SDK Powering Up 📡');
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
        this.currentEvent = this.priority[event];
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
        if (this.currentEvent === 0) {
            clearInterval(this.runInterval);
            this.runInterval = undefined;
            this.firstLoad = true;
            return resolve(true);
        }
    }
    handleEvent(event) {
        const count = this.priority[event];
        this.currentEvent = (count <= this.currentEvent) ? count : this.currentEvent;
        if (!this.firstLoad) {
            process.stdout.write('.....');
        }
    }
}
exports.SDKInitLifeCycle = SDKInitLifeCycle;
