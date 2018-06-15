
import { EventEmitter } from 'events';
import { EventName } from './types';

export interface InitPriorityItem {
  // the event that is triggered
  // (via the EventEmitter) when this function finishes
  event: string;

  // function to be called in the main SDK class
  func: any;

  // optional args to pass to
  // the event callback
  args?: any[];
}

export class SDKInitLifeCycle {

  private _priorityList: InitPriorityItem[];
  private _events: EventEmitter;
  private _priority: {} = {};
  private _current: number;
  private _last: number;
  private _startTime: number;
  private _timeout: number;
  private _runInterval: any;

  constructor(events: EventEmitter, priorityList: InitPriorityItem[], timeout: number = 10000) {
    this._priorityList = priorityList;
    this._events = events;
    this._timeout = timeout;

    // Setup the priority event map and
    // event handlers which maintains
    // the current loaded event priority
    this._last = (priorityList.length - 1);
    for (const index in priorityList) {
      if (priorityList.hasOwnProperty(index)) {
        const item = priorityList[index];
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
  public setup(scope): void {
    for (const item of this._priorityList) {
      if (item.func) {
        if (item.args) {
          this._events.on(item.event, item.func.bind(scope, ...item.args));
        } else {
          this._events.on(item.event, item.func.bind(scope));
        }
      }
    }
  }

  public promise(event: string): Promise<boolean | string> {
    if (this._runInterval) return Promise.resolve(true);

    this._current = this._priority[event];
    this._startTime = new Date().getTime();
    return new Promise((resolve, reject) => {
      this._runInterval = setInterval(this.checkEventProgress.bind(this, resolve, reject), 100);
    });
  }

  private checkEventProgress(resolve, reject): Promise<boolean | string> {
    const now = new Date().getTime();
    if (now - this._startTime >= this._timeout) {
      clearInterval(this._runInterval);
      this._runInterval = undefined;
      return reject(`SDK init lifecycle timed out after ${this._timeout}ms`);
    }

    if (this._current >= this._last) {
      clearInterval(this._runInterval);
      this._runInterval = undefined;
      return resolve(true);
    }
  }

  private handleEvent(event: string): void {
    const current = this._priority[event];
    this._current = (current >= this._current) ? current : this._current;

    const progressPerc = Math.floor((this._current / this._last) * 100);
    this._events.emit(EventName.Loading, {
      progress: progressPerc || 0,
      elapsedTime: (new Date().getTime() - this._startTime),
      source: this.constructor.name + ':' + event
    });
  }

}
