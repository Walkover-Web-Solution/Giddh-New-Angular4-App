import { WorkerMessage } from './model/web-worker.class';
import { WORKER_MODULES } from './model/web-worker.constant';
import { LedgerIntensiveWorker } from './ledger/ledger.worker';

export class AppWorkers {
    workerContext: any;
    constructor(context: any) {
        this.workerContext = context;
    }

    workerBroker(event: MessageEvent): void {
        const data = event.data as WorkerMessage;
        switch (data.moduleName) {
            case WORKER_MODULES.LEDGER:
                this.postWorkerResult(LedgerIntensiveWorker.doWork(data));
                break;
        }
    }

    postWorkerResult(data: WorkerMessage): void {
        this.workerContext.postMessage(data);
    }
}
