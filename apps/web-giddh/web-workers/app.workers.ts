import { WorkerMessage } from './model/web-worker.class';
import { WORKER_MODULES } from './model/web-worker.constant';
import { LedgerIntensiveWorker } from './ledger/ledger.worker';

export class AppWorkers {
    /** Stores the main context of web worker for whole app */
    workerContext: any;

    /** @ignore */
    constructor(context: any) {
        this.workerContext = context;
    }

    /**
     * Method to distribute intensive task to specific handlers based on modules
     *
     * @param {MessageEvent} event Message event
     * @memberof AppWorkers
     */
    workerBroker(event: MessageEvent): void {
        const data = event.data as WorkerMessage;
        switch (data.moduleName) {
            case WORKER_MODULES.LEDGER:
                this.postWorkerResult(LedgerIntensiveWorker.doWork(data));
                break;
            default: break;
        }
    }

    /**
     * Posts the message with required details
     *
     * @param {WorkerMessage} data Data to be procesed
     * @memberof AppWorkers
     */
    postWorkerResult(data: WorkerMessage): void {
        this.workerContext.postMessage(data);
    }
}
