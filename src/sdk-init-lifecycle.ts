
import {EventEmitter} from 'events';

export interface InitPriorityItem {
  // the event that is triggered
  // (via the EventEmitter) when this function finishes
  event: string;

  // function to be called in the main SDK class
  func: any;

  // load priority of this function
  priority: number;

  // optional args to pass to
  // the event callback
  args?: any[];
}

export class SDKInitLifeCycle {

  private priorityList: InitPriorityItem[];
  private events: EventEmitter;
  private priority: {} = {};
  private currentEvent: number;
  private startTime: number;
  private timeout: number;
  private runInterval: number;

  constructor(events: EventEmitter, priorityList: InitPriorityItem[], timeout: number = 10000) {
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
  public setup(scope) {
    console.log('Radar Relay SDK Powering Up 📡');
    for (const item of this.priorityList) {
      if (item.func) {
        if (item.args) {
          this.events.on(item.event, item.func.bind(scope, ...item.args));
        } else {
          this.events.on(item.event, item.func.bind(scope));
        }
      }
    }
  }

  public promise(event: string): Promise<boolean | string>  {
    if (this.runInterval) return Promise.resolve(true);

    this.currentEvent = this.priority[event];
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
      return reject(`SDK init lifecycle timed out after ${this.timeout}ms`);
    }

    if (this.currentEvent === 0) {
      clearInterval(this.runInterval);
      this.runInterval = undefined;
      return resolve(true);
    }
  }

  private handleEvent(event: string) {
    const count = this.priority[event];
    this.currentEvent = (count <= this.currentEvent) ? count : this.currentEvent;
    process.stdout.write('....');
  }

}
