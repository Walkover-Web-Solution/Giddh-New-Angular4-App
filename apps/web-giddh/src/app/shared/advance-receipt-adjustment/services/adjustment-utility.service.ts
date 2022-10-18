import { Injectable } from "@angular/core";
import { AdjustedVoucherType } from "../../../app.constant";

@Injectable({
    providedIn: 'any'
})
export class AdjustmentUtilityService {

    /**
     * This will convert the new response format for adjustments in old response format
     *
     * @param {*} data
     * @param {string} adjustedVoucherType
     * @returns {*}
     * @memberof AdjustmentUtilityService
     */
    public getVoucherAdjustmentObject(data: any, adjustedVoucherType: string): any {
        if (data?.adjustments?.length > 0) {
            data.voucherAdjustments = { adjustments: this.formatAdjustmentsObject(data.adjustments) };
            delete data.adjustments;

            let totalAdjustmentAmount = 0;
            let totalAdjustmentCompanyAmount = 0;
            data.voucherAdjustments?.adjustments?.forEach(adjustment => {
                if (((adjustedVoucherType === AdjustedVoucherType.SalesInvoice || adjustedVoucherType === AdjustedVoucherType.Sales) && adjustment.voucherType === AdjustedVoucherType.DebitNote) || ((adjustedVoucherType === AdjustedVoucherType.PurchaseInvoice || adjustedVoucherType === AdjustedVoucherType.Purchase) && adjustment.voucherType === AdjustedVoucherType.CreditNote)) {
                    totalAdjustmentAmount -= Number(adjustment.adjustmentAmount ? adjustment.adjustmentAmount.amountForAccount : 0);
                    totalAdjustmentCompanyAmount -= Number(adjustment.adjustmentAmount ? adjustment.adjustmentAmount.amountForCompany : 0);
                } else {
                    totalAdjustmentAmount += Number(adjustment.adjustmentAmount ? adjustment.adjustmentAmount.amountForAccount : 0);
                    totalAdjustmentCompanyAmount += Number(adjustment.adjustmentAmount ? adjustment.adjustmentAmount.amountForCompany : 0);
                }
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
        adjustments = adjustments?.map(adjustment => {
            adjustment.adjustmentAmount = adjustment.amount;
            adjustment.balanceDue = adjustment.unadjustedAmount;
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
        const cashBankParentGroups = ['cash', 'bankaccounts', 'loanandoverdraft'];
        const fixedAssetsGroups = ['fixedassets'];

        if (data?.particularAccount?.parentGroups?.length > 0) {
            if (data?.particularAccount?.parentGroups[0].uniqueName) {
                data.particularAccount.parentGroups = data?.particularAccount?.parentGroups?.map(group => group.uniqueName);
            }
        }

        let isSalesLedger = false;
        let isPurchaseLedger = false;
        let isDebtorCreditorLedger = false;
        let isCashBankLedger = false;
        let isFixedAssetsLedger = false;

        data?.ledgerAccount?.parentGroups?.forEach(group => {
            if (salesParentGroups.includes(group?.uniqueName)) {
                isSalesLedger = true;
            } else if (purchaseParentGroups.includes(group?.uniqueName)) {
                isPurchaseLedger = true;
            } else if (debtorCreditorParentGroups.includes(group?.uniqueName)) {
                isDebtorCreditorLedger = true;
            } else if (cashBankParentGroups.includes(group?.uniqueName)) {
                isCashBankLedger = true;
            } else if (fixedAssetsGroups.includes(group?.uniqueName)) {
                isFixedAssetsLedger = true;
            }
        });

        let isSalesAccount = false;
        let isPurchaseAccount = false;
        let isDebtorCreditorAccount = false;
        let isCashBankAccount = false;
        let isFixedAssetsAccount = false;

        data?.particularAccount?.parentGroups?.forEach(groupUniqueName => {
            if (salesParentGroups.includes(groupUniqueName)) {
                isSalesAccount = true;
            } else if (purchaseParentGroups.includes(groupUniqueName)) {
                isPurchaseAccount = true;
            } else if (debtorCreditorParentGroups.includes(groupUniqueName)) {
                isDebtorCreditorAccount = true;
            } else if (cashBankParentGroups.includes(groupUniqueName)) {
                isCashBankAccount = true;
            } else if (fixedAssetsGroups.includes(groupUniqueName)) {
                isFixedAssetsAccount = true;
            }
        });

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
        } else if (isFixedAssetsLedger) {
            if (isDebtorCreditorAccount) {
                request = {
                    accountUniqueName: data?.particularAccount?.uniqueName,
                    voucherType: data?.voucherType,
                    noteVoucherType: (data?.voucherType === creditNoteVoucher) ? "sales" : (data?.voucherType === debitNoteVoucher) ? "purchase" : undefined
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
            } else if (isFixedAssetsAccount) {
                request.noteVoucherType = (data?.voucherType === creditNoteVoucher) ? "sales" : (data?.voucherType === debitNoteVoucher) ? "purchase" : undefined;
            } else {
                request = undefined;
            }
        } else if (isCashBankLedger) {
            if (isDebtorCreditorAccount) {
                request = {
                    accountUniqueName: data?.particularAccount?.uniqueName,
                    voucherType: data?.voucherType,
                    noteVoucherType: undefined
                };
            } else {
                request = undefined;
            }
        }

        return request;
    }

    /**
     * Returns the customer name/uniquename
     *
     * @param {*} data
     * @returns {*}
     * @memberof AdjustmentUtilityService
     */
    public getAdjustedCustomer(data: any): any {
        const debtorCreditorParentGroups = ['sundrydebtors', 'sundrycreditors'];

        if (data?.particularAccount?.parentGroups?.length > 0) {
            if (data?.particularAccount?.parentGroups[0].uniqueName) {
                data.particularAccount.parentGroups = data?.particularAccount?.parentGroups?.map(group => group.uniqueName);
            }
        }

        let isDebtorCreditorLedger = false;

        data?.ledgerAccount?.parentGroups?.forEach(group => {
            if (debtorCreditorParentGroups.includes(group?.uniqueName)) {
                isDebtorCreditorLedger = true;
            }
        });

        let isDebtorCreditorAccount = false;

        data?.particularAccount?.parentGroups?.forEach(groupUniqueName => {
            if (debtorCreditorParentGroups.includes(groupUniqueName)) {
                isDebtorCreditorAccount = true;
            }
        });

        let request = {
            customerName: '',
            customerUniquename: ''
        };

        if (isDebtorCreditorLedger) {
            request.customerName = data?.ledgerAccount?.name;
            request.customerUniquename = data?.ledgerAccount?.uniqueName;
        } else if (isDebtorCreditorAccount) {
            request.customerName = data?.particularAccount?.name;
            request.customerUniquename = data?.particularAccount?.uniqueName;
        }

        return request;
    }
}