import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, fromEvent } from 'rxjs';
import { WorkerMessage } from 'apps/web-giddh/web-workers/model/web-worker.class';

/** Provider to carry out web worker related operations */
@Injectable({
    providedIn: 'root'
})
export class WorkerService {
    /** Worker path where final worker will get stored at build time */
    public readonly workerPath = 'assets/worker.js';
    /** Observable to emit the worker progress */
    public workerUpdate$: Observable<WorkerMessage>;

    /** Worker instance that will get created each time any module requires it */
    private worker: Worker;
    /** Worker subject that emits the worker progress */
    private workerSubject: Subject<WorkerMessage>;
    /** Worker 'message' subscription that listens to 'message' event from worker and parses the output */
    private workerMessageSubscription: Subscription;

    /** @ignore */
    constructor() {}

    /**
     * Initializes the web worker
     *
     * @memberof WorkerService
     */
    public initWorker(): void {
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

    /**
     * Terminates the worker and releases the memory to avoid memory leaks,
     * should be called when the component using the worker is destroyed
     *
     * @memberof WorkerService
     */
    public terminateWorker(): void {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
            this.workerMessageSubscription.unsubscribe();
        }
    }

    /**
     * Posts the message to get processed
     *
     * @param {WorkerMessage} data Data to be processed by the web worker
     * @memberof WorkerService
     */
    public doWork(data: WorkerMessage): void {
        if (this.worker) {
            this.worker.postMessage(data);
        }
    }
}
