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

            if (data.transactions?.length > 0) {
                data.transactions[0].adjustments = data.voucherAdjustments.adjustments;
            }
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
        const constants = this.getVoucherConstants();

        this.normalizeParentGroups(data);

        const ledgerTypes = this.determineLedgerAccountTypes(data, constants);
        const accountTypes = this.determineParticularAccountTypes(data, constants);

        return this.buildInvoiceRequest(data, constants, ledgerTypes, accountTypes);
    }

    /**
     * Get voucher and account type constants
     */
    private getVoucherConstants(): any {
        return {
            debitNoteVoucher: "debit note",
            creditNoteVoucher: "credit note",
            salesParentGroups: ['revenuefromoperations', 'otherincome'],
            purchaseParentGroups: ['operatingcost', 'indirectexpenses'],
            debtorCreditorParentGroups: ['sundrydebtors', 'sundrycreditors'],
            cashBankParentGroups: ['cash', 'bankaccounts', 'loanandoverdraft'],
            fixedAssetsGroups: ['fixedassets'],
            journalVoucherTypes: ["jr", "journal"],
            journalVoucherType: "journal"
        };
    }

    /**
     * Normalize parent groups to ensure they are unique names
     */
    private normalizeParentGroups(data: any): void {
        if (data?.particularAccount?.parentGroups?.length > 0) {
            if (data?.particularAccount?.parentGroups[0]?.uniqueName) {
                data.particularAccount.parentGroups = data?.particularAccount?.parentGroups?.map(group => group?.uniqueName);
            }
        }
    }

    /**
     * Determine ledger account types based on parent groups
     */
    private determineLedgerAccountTypes(data: any, constants: any): any {
        const types = {
            isSalesLedger: false,
            isPurchaseLedger: false,
            isDebtorCreditorLedger: false,
            isCashBankLedger: false,
            isFixedAssetsLedger: false
        };

        data?.ledgerAccount?.parentGroups?.forEach(group => {
            const groupName = group?.uniqueName;

            if (constants.salesParentGroups.includes(groupName)) {
                types.isSalesLedger = true;
            } else if (constants.purchaseParentGroups.includes(groupName)) {
                types.isPurchaseLedger = true;
            } else if (constants.debtorCreditorParentGroups.includes(groupName)) {
                types.isDebtorCreditorLedger = true;
            } else if (constants.cashBankParentGroups.includes(groupName)) {
                types.isCashBankLedger = true;
            } else if (constants.fixedAssetsGroups.includes(groupName)) {
                types.isFixedAssetsLedger = true;
            }
        });

        return types;
    }

    /**
     * Determine particular account types based on parent groups
     */
    private determineParticularAccountTypes(data: any, constants: any): any {
        const types = {
            isSalesAccount: false,
            isPurchaseAccount: false,
            isDebtorCreditorAccount: false,
            isCashBankAccount: false,
            isFixedAssetsAccount: false
        };

        data?.particularAccount?.parentGroups?.forEach(groupUniqueName => {
            if (constants.salesParentGroups.includes(groupUniqueName)) {
                types.isSalesAccount = true;
            } else if (constants.purchaseParentGroups.includes(groupUniqueName)) {
                types.isPurchaseAccount = true;
            } else if (constants.debtorCreditorParentGroups.includes(groupUniqueName)) {
                types.isDebtorCreditorAccount = true;
            } else if (constants.cashBankParentGroups.includes(groupUniqueName)) {
                types.isCashBankAccount = true;
            } else if (constants.fixedAssetsGroups.includes(groupUniqueName)) {
                types.isFixedAssetsAccount = true;
            }
        });

        return types;
    }

    /**
     * Build invoice request based on account types and voucher data
     */
    private buildInvoiceRequest(data: any, constants: any, ledgerTypes: any, accountTypes: any): any {
        if (ledgerTypes.isSalesLedger || ledgerTypes.isPurchaseLedger) {
            return this.buildSalesOrPurchaseLedgerRequest(data, constants, ledgerTypes, accountTypes);
        } else if (ledgerTypes.isFixedAssetsLedger) {
            return this.buildFixedAssetsLedgerRequest(data, constants, accountTypes);
        } else if (ledgerTypes.isDebtorCreditorLedger) {
            return this.buildDebtorCreditorLedgerRequest(data, constants, accountTypes);
        } else if (ledgerTypes.isCashBankLedger) {
            return this.buildCashBankLedgerRequest(data, constants, accountTypes);
        }

        return this.getDefaultRequest();
    }

    /**
     * Build request for sales or purchase ledger
     */
    private buildSalesOrPurchaseLedgerRequest(data: any, constants: any, ledgerTypes: any, accountTypes: any): any {
        if (accountTypes.isDebtorCreditorAccount) {
            return {
                accountUniqueName: data?.particularAccount?.uniqueName,
                voucherType: data?.voucherType,
                noteVoucherType: this.getSalesOrPurchaseNoteVoucherType(data, constants, ledgerTypes)
            };
        } else if (constants.journalVoucherTypes.includes(data?.voucherType)) {
            return this.buildJournalVoucherRequest(data, constants);
        }

        return undefined;
    }

    /**
     * Build request for fixed assets ledger
     */
    private buildFixedAssetsLedgerRequest(data: any, constants: any, accountTypes: any): any {
        if (accountTypes.isDebtorCreditorAccount) {
            return {
                accountUniqueName: data?.particularAccount?.uniqueName,
                voucherType: data?.voucherType,
                noteVoucherType: this.getFixedAssetsNoteVoucherType(data, constants)
            };
        } else if (constants.journalVoucherTypes.includes(data?.voucherType)) {
            return this.buildJournalVoucherRequest(data, constants);
        }

        return undefined;
    }

    /**
     * Build request for debtor/creditor ledger
     */
    private buildDebtorCreditorLedgerRequest(data: any, constants: any, accountTypes: any): any {
        const request = this.getDefaultRequest();
        request.accountUniqueName = data?.ledgerAccount?.uniqueName;
        request.voucherType = data?.voucherType;

        if (accountTypes.isSalesAccount) {
            request.noteVoucherType = this.isDebitOrCreditNote(data, constants) ? "sales" : undefined;
        } else if (accountTypes.isPurchaseAccount) {
            request.noteVoucherType = this.isDebitOrCreditNote(data, constants) ? "purchase" : undefined;
        } else if (accountTypes.isCashBankAccount) {
            request.noteVoucherType = undefined;
        } else if (accountTypes.isFixedAssetsAccount) {
            request.noteVoucherType = this.getFixedAssetsNoteVoucherType(data, constants);
        } else if (constants.journalVoucherTypes.includes(data?.voucherType)) {
            request.voucherType = constants.journalVoucherType;
        } else {
            return undefined;
        }

        return request;
    }

    /**
     * Build request for cash/bank ledger
     */
    private buildCashBankLedgerRequest(data: any, constants: any, accountTypes: any): any {
        if (accountTypes.isDebtorCreditorAccount) {
            return {
                accountUniqueName: data?.particularAccount?.uniqueName,
                voucherType: data?.voucherType,
                noteVoucherType: undefined
            };
        } else if (constants.journalVoucherTypes.includes(data?.voucherType)) {
            return this.buildJournalVoucherRequest(data, constants);
        }

        return undefined;
    }

    /**
     * Build journal voucher request
     */
    private buildJournalVoucherRequest(data: any, constants: any): any {
        return {
            accountUniqueName: data?.ledgerAccount?.uniqueName,
            voucherType: constants.journalVoucherType,
            noteVoucherType: undefined
        };
    }

    /**
     * Get note voucher type for sales or purchase ledger
     */
    private getSalesOrPurchaseNoteVoucherType(data: any, constants: any, ledgerTypes: any): string | undefined {
        const isNote = this.isDebitOrCreditNote(data, constants);

        if (isNote && ledgerTypes.isSalesLedger) {
            return "sales";
        } else if (isNote && ledgerTypes.isPurchaseLedger) {
            return "purchase";
        }

        return undefined;
    }

    /**
     * Get note voucher type for fixed assets
     */
    private getFixedAssetsNoteVoucherType(data: any, constants: any): string | undefined {
        if (data?.voucherType === constants.creditNoteVoucher) {
            return "sales";
        } else if (data?.voucherType === constants.debitNoteVoucher) {
            return "purchase";
        }

        return undefined;
    }

    /**
     * Check if voucher type is debit or credit note
     */
    private isDebitOrCreditNote(data: any, constants: any): boolean {
        return data?.voucherType === constants.debitNoteVoucher ||
               data?.voucherType === constants.creditNoteVoucher;
    }

    /**
     * Get default request structure
     */
    private getDefaultRequest(): any {
        return {
            accountUniqueName: undefined,
            voucherType: undefined,
            noteVoucherType: undefined
        };
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
            if (data?.particularAccount?.parentGroups[0]?.uniqueName) {
                data.particularAccount.parentGroups = data?.particularAccount?.parentGroups?.map(group => group?.uniqueName);
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
