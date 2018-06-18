/// <reference types="node" />
import { EventEmitter } from 'events';
export interface InitPriorityItem {
    event: string;
    func: any;
    args?: any[];
}
export declare class SdkInitLifeCycle {
    private _priorityList;
    private _events;
    private _priority;
    private _current;
    private _last;
    private _startTime;
    private _timeout;
    private _runInterval;
    constructor(events: EventEmitter, priorityList: InitPriorityItem[], timeout?: number);
    setup(scope: any): void;
    promise(event: string): Promise<boolean | string>;
    private checkEventProgress;
    private handleEvent;
}
