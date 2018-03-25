"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SDKEventLifeCycle {
    constructor(events, timeout = 10000) {
        this.eventCounts = {
            marketsUpdated: 0,
            tradeExecutorUpdated: 1,
            apiEndpointUpdated: 2,
            accountUpdated: 2,
            zeroExUpdated: 4,
            ethereumNetworkIdUpdated: 5,
            ethereumNetworkUpdated: 6
        };
        this.events = events;
        this.timeout = timeout;
        this.events.on('marketsUpdated', this.handleEvent.bind(this, 'marketsUpdated'));
        this.events.on('tradeExecutorUpdated', this.handleEvent.bind(this, 'tradeExecutorUpdated'));
        this.events.on('accountUpdated', this.handleEvent.bind(this, 'accountUpdated'));
        this.events.on('apiEndpointUpdated', this.handleEvent.bind(this, 'apiEndpointUpdated'));
        this.events.on('zeroExUpdated', this.handleEvent.bind(this, 'zeroExUpdated')); // default to account 0
        this.events.on('ethereumNetworkIdUpdated', this.handleEvent.bind(this, 'ethereumNetworkIdUpdated'));
        this.events.on('ethereumNetworkUpdated', this.handleEvent.bind(this, 'ethereumNetworkUpdated'));
    }
    promise(event) {
        if (this.runInterval)
            return Promise.resolve(true);
        this.currentEvent = this.eventCounts[event];
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
            return reject(`loading lifecycle timed out after ${this.timeout}ms`);
        }
        if (this.currentEvent === 0) {
            clearInterval(this.runInterval);
            this.runInterval = undefined;
            return resolve(true);
        }
    }
    handleEvent(event) {
        console.log(event, '...');
        const count = this.eventCounts[event];
        this.currentEvent = (count <= this.currentEvent) ? count : this.currentEvent;
    }
}
exports.SDKEventLifeCycle = SDKEventLifeCycle;
