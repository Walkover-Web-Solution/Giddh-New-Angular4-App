import { WorkerMessage } from '../model/web-worker.class';
import { WORKER_MODULES_OPERATIONS } from '../model/web-worker.constant';

export class LedgerIntensiveWorker {

    /**
     * Performs the operation based on module and operation type
     *
     * @static
     * @param {WorkerMessage} data Data to be processed
     * @returns Processed data by the worker
     * @memberof LedgerIntensiveWorker
     */
    public static doWork(data: WorkerMessage) {
        switch (data.operationType) {
            case WORKER_MODULES_OPERATIONS.LEDGER.VOUCHER_CALCULATION:
                return this.calculateApplicableVoucherType(data);
        }
    }

    /**
     * Calculates the applicable voucher type for involved accounts in ledger
     *
     * @private
     * @static
     * @param {WorkerMessage} data Data consists of information about involved accounts
     * @returns {WorkerMessage} Voucher details information for involved accounts
     * @memberof LedgerIntensiveWorker
     */
    private static calculateApplicableVoucherType(data: WorkerMessage): WorkerMessage {
        let count = 0;
        while (++count < 50000) {
            console.log(count);
        }
        return new WorkerMessage('ledger', data.operationType, count);
    }
}
