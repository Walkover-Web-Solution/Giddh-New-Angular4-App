import { WorkerMessage } from '../model/web-worker.class';
import { WORKER_MODULES_OPERATIONS } from '../model/web-worker.constant';

export class LedgerIntensiveWorker {
    public static doWork(data: WorkerMessage) {
        switch (data.operationType) {
            case WORKER_MODULES_OPERATIONS.LEDGER.VOUCHER_CALCULATION:
                let count = 0;
                while (++count < 50000) {
                    console.log(count);
                }
                return new WorkerMessage('ledger', data.operationType, count);
        }
    }
}
