import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, fromEvent } from 'rxjs';
import { WorkerMessage } from 'apps/web-giddh/web-workers/model/web-worker.class';

@Injectable({
    providedIn: 'root'
})
export class WorkerService {
    public readonly workerPath = 'assets/main.js';
    workerUpdate$: Observable<WorkerMessage>;

    private worker: Worker;
    private workerSubject: Subject<WorkerMessage>;
    private workerMessageSubscription: Subscription;

    constructor() {
        this.initWorker();
    }

    private initWorker() {
        try {
            if (!this.worker) {
                this.worker = new Worker(this.workerPath);
                this.workerSubject = new Subject<WorkerMessage>();
                this.workerUpdate$ = this.workerSubject.asObservable();
                this.workerMessageSubscription = fromEvent(this.worker, 'message').subscribe((response: MessageEvent) => {
                    if (this.workerSubject) {
                        this.workerSubject.next(WorkerMessage.getInstance(response.data));
                    }
                }, (error) => console.error('Worker error: ', error));
            }
        } catch (error) {
            console.error(error);
        }
    }

    public doWork(data: WorkerMessage) {
        if (this.worker) {
            this.worker.postMessage(data);
        }
    }
}
