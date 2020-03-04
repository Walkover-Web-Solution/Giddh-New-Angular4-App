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
        console.log('Data received: ', data);
        if (!data || !data.data || !data.data.currentLedgerAccount || !data.data.particularAccount || !data.data.voucherData) {
            return new WorkerMessage('ledger', data.operationType, 0);
        }
        const { currentLedgerAccount, particularAccount, voucherData } = data.data;
        const currentLedgerApplicableVouchers = this.findVouchers(particularAccount.type, currentLedgerAccount.parentGroups, voucherData);
        const particularAccountApplicableVouchers = this.findVouchers(particularAccount.type,
            particularAccount.selectedAccount ? particularAccount.selectedAccount.parentGroups : [],
            voucherData);
        console.log(currentLedgerApplicableVouchers, particularAccountApplicableVouchers);
        return new WorkerMessage('ledger', data.operationType, 0);
    }

    private static findVouchers(transactionType: string, parentGroups: Array<any>, voucherData: Array<any>): Array<string> {
        if (parentGroups && voucherData) {
            console.log('ParentGroups: ', parentGroups);
            console.log('Voucher data: ', voucherData);
            let i = 0;
            let voucherDetailsByCategory = [...voucherData];
            while (parentGroups[i]) {
                console.log('Parent group: ', parentGroups[i]);
                let categoryVoucherDetails: any = voucherDetailsByCategory.filter(category => category.group === parentGroups[i].uniqueName);
                categoryVoucherDetails = categoryVoucherDetails.length ? categoryVoucherDetails.pop() : categoryVoucherDetails;
                console.log('categoryVoucherDetails: ', categoryVoucherDetails);
                if (categoryVoucherDetails.vouchers) {
                    return transactionType === 'CREDIT' ? categoryVoucherDetails.credit : categoryVoucherDetails.debit;
                } else if (categoryVoucherDetails.groups) {
                    i++;
                    console.log('New parent: ', parentGroups[i]);
                    voucherDetailsByCategory = [...(categoryVoucherDetails.groups)];
                } else {
                    return categoryVoucherDetails.default;
                }
            }
        }
    }
}
