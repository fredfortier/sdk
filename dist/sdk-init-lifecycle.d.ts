/// <reference types="node" />
import { EventEmitter } from 'events';
export interface InitPriorityItem {
    event: string;
    func: any;
    args?: any[];
}
export declare class SDKInitLifeCycle {
    private priorityList;
    private events;
    private priority;
    private current;
    private last;
    private startTime;
    private timeout;
    private runInterval;
    constructor(events: EventEmitter, priorityList: InitPriorityItem[], timeout?: number);
    setup(scope: any): void;
    promise(event: string): Promise<boolean | string>;
    private checkEventProgress;
    private handleEvent;
}
