
import {EventEmitter} from 'events';

export class SDKEventLifeCycle {

  private events: EventEmitter;

  private eventCounts = {
    marketsUpdated: 0,
    tradeExecutorUpdated: 1,
    apiEndpointUpdated: 2,
    accountUpdated: 2,
    zeroExUpdated: 4,
    ethereumNetworkIdUpdated: 5,
    ethereumNetworkUpdated: 6
  };

  private currentEvent: number;
  private startTime: number;
  private timeout: number;
  private runInterval: number;

  constructor(events: EventEmitter, timeout: number = 10000) {
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

  public promise(event: string): Promise<boolean | string>  {
    if (this.runInterval) return Promise.resolve(true);

    this.currentEvent = this.eventCounts[event];
    this.startTime = new Date().getTime();
    return new Promise((resolve, reject) => {
      this.runInterval = setInterval(this.checkEventProgress.bind(this, resolve, reject), 100);
    });
  }

  private checkEventProgress(resolve, reject): Promise<boolean | string> {
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

  private handleEvent(event: string) {
    console.log(event, '...');
    const count = this.eventCounts[event];
    this.currentEvent = (count <= this.currentEvent) ? count : this.currentEvent;
  }

}
