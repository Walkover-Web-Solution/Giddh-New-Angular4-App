import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'any'
})
export class AdjustmentUtilityService {

    /**
     * This will convert the new response format for adjustments in old response format
     *
     * @param {*} data
     * @returns {*}
     * @memberof AdjustmentUtilityService
     */
    public getVoucherAdjustmentObject(data: any): any {
        if (data?.adjustments?.length > 0) {
            data.voucherAdjustments = { adjustments: this.formatAdjustmentsObject(data.adjustments) };
            delete data.adjustments;

            let totalAdjustmentAmount = 0;
            let totalAdjustmentCompanyAmount = 0;
            data.voucherAdjustments?.adjustments?.forEach(adjustment => {
                totalAdjustmentAmount += Number(adjustment.adjustmentAmount ? adjustment.adjustmentAmount.amountForAccount : 0);
                totalAdjustmentCompanyAmount += Number(adjustment.adjustmentAmount ? adjustment.adjustmentAmount.amountForCompany : 0);
            });

            data.voucherAdjustments.totalAdjustmentAmount = totalAdjustmentAmount;
            data.voucherAdjustments.totalAdjustmentCompanyAmount = totalAdjustmentCompanyAmount;
        }
        return data;
    }

    /**
     * Formats the adjustment object
     *
     * @param {*} adjustments
     * @returns {*}
     * @memberof AdjustmentUtilityService
     */
    public formatAdjustmentsObject(adjustments: any): any {
        adjustments?.map(adjustment => {
            adjustment.adjustmentAmount = adjustment.amount;
            adjustment.balanceDue = adjustment.unadjustedAmount;
            delete adjustment.amount;
            delete adjustment.unadjustedAmount;
            return adjustment;
        });

        return adjustments;
    }

    /**
     * This will convert the old response format for adjustments in new response format
     *
     * @param {*} data
     * @returns {*}
     * @memberof AdjustmentUtilityService
     */
    public getAdjustmentObject(data: any): any {
        if (data?.voucherAdjustments?.adjustments?.length > 0) {
            data.voucherAdjustments.adjustments.map(adjustment => {
                adjustment.amount = adjustment.adjustmentAmount;
                adjustment.unadjustedAmount = adjustment.balanceDue;
                delete adjustment.adjustmentAmount;
                delete adjustment.balanceDue;
                return adjustment;
            });

            data.transactions[0].adjustments = data.voucherAdjustments.adjustments;
        } else if (data?.transactions?.length > 0) {
            data?.transactions?.forEach(transaction => {
                if (transaction?.voucherAdjustments?.adjustments?.length > 0) {
                    transaction.voucherAdjustments.adjustments.map(adjustment => {
                        adjustment.amount = adjustment.adjustmentAmount;
                        adjustment.unadjustedAmount = adjustment.balanceDue;
                        delete adjustment.adjustmentAmount;
                        delete adjustment.balanceDue;
                        return adjustment;
                    });

                    transaction.adjustments = transaction.voucherAdjustments.adjustments;
                    delete transaction.voucherAdjustments;
                }
            });
        }

        delete data.voucherAdjustments;
        return data;
    }

    /**
     * This will convert the old response format for adjustments in new response format
     *
     * @param {*} data
     * @returns {*}
     * @memberof AdjustmentUtilityService
     */
    public getAdjustmentObjectVoucherModule(data: any): any {
        if (data?.voucherAdjustments?.adjustments?.length > 0) {
            data.voucherAdjustments.adjustments.map(adjustment => {
                adjustment.amount = adjustment.adjustmentAmount;
                adjustment.unadjustedAmount = adjustment.balanceDue;
                delete adjustment.adjustmentAmount;
                delete adjustment.balanceDue;
                return adjustment;
            });

            data.adjustments = data.voucherAdjustments.adjustments;
            delete data.voucherAdjustments;
        } else {
            delete data.voucherAdjustments;
            data.adjustments = [];
        }

        return data;
    }

    /**
     * Returns the request params for invoice-list api
     *
     * @param {*} data
     * @returns {*}
     * @memberof AdjustmentUtilityService
     */
    public getInvoiceListRequest(data: any): any {
        const debitNoteVoucher = "debit note";
        const creditNoteVoucher = "credit note";
        const salesParentGroups = ['revenuefromoperations', 'otherincome'];
        const purchaseParentGroups = ['operatingcost', 'indirectexpenses'];
        const debtorCreditorParentGroups = ['sundrydebtors', 'sundrycreditors'];
        const cashBankParentGroups = ['cash', 'bankaccounts'];

        if (data?.particularAccount?.parentGroups?.length > 0) {
            if (data?.particularAccount?.parentGroups[0].uniqueName) {
                data.particularAccount.parentGroups = data?.particularAccount?.parentGroups?.map(group => group.uniqueName);
            }
        }

        const isSalesLedger = data?.ledgerAccount?.parentGroups?.some(account => salesParentGroups.includes(account?.uniqueName));
        const isPurchaseLedger = data?.ledgerAccount?.parentGroups?.some(account => purchaseParentGroups.includes(account?.uniqueName));
        const isDebtorCreditorLedger = data?.ledgerAccount?.parentGroups?.some(account => debtorCreditorParentGroups.includes(account?.uniqueName));
        const isCashBankLedger = data?.ledgerAccount?.parentGroups?.some(account => cashBankParentGroups.includes(account?.uniqueName));

        const isSalesAccount = data?.particularAccount?.parentGroups?.some(accountUniqueName => salesParentGroups.includes(accountUniqueName));
        const isPurchaseAccount = data?.particularAccount?.parentGroups?.some(accountUniqueName => purchaseParentGroups.includes(accountUniqueName));
        const isDebtorCreditorAccount = data?.particularAccount?.parentGroups?.some(accountUniqueName => debtorCreditorParentGroups.includes(accountUniqueName));
        const isCashBankAccount = data?.particularAccount?.parentGroups?.some(accountUniqueName => cashBankParentGroups.includes(accountUniqueName));

        let request = {
            accountUniqueName: undefined,
            voucherType: undefined,
            noteVoucherType: undefined
        };

        if (isSalesLedger || isPurchaseLedger) {
            if (isDebtorCreditorAccount) {
                request = {
                    accountUniqueName: data?.particularAccount?.uniqueName,
                    voucherType: data?.voucherType,
                    noteVoucherType: ((data?.voucherType === debitNoteVoucher || data?.voucherType === creditNoteVoucher) && isSalesLedger) ? "sales" : ((data?.voucherType === debitNoteVoucher || data?.voucherType === creditNoteVoucher) && isPurchaseLedger) ? "purchase" : undefined
                };
            } else {
                request = undefined;
            }
        } else if (isDebtorCreditorLedger) {
            request.accountUniqueName = data?.ledgerAccount?.uniqueName;
            request.voucherType = data?.voucherType;

            if (isSalesAccount) {
                request.noteVoucherType = (data?.voucherType === debitNoteVoucher || data?.voucherType === creditNoteVoucher) ? "sales" : undefined;
            } else if (isPurchaseAccount) {
                request.noteVoucherType = (data?.voucherType === debitNoteVoucher || data?.voucherType === creditNoteVoucher) ? "purchase" : undefined;
            } else if (isCashBankAccount) {
                request.noteVoucherType = undefined;
            } else {
                request = undefined;
            }
        } else if (isCashBankLedger) {
            if (isDebtorCreditorAccount) {
                request = {
                    accountUniqueName: data?.ledgerAccount?.uniqueName,
                    voucherType: data?.voucherType,
                    noteVoucherType: undefined
                };
            } else {
                request = undefined;
            }
        }

        return request;
    }
}