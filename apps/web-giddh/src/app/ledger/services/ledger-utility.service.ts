import { Injectable } from "@angular/core";

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'any'
})
/**
 * LedgerUtilityService service
 * Provides ledgerutility related business logic and data operations
 */
export class LedgerUtilityService {

    /**
     * Checks if export case is valid
     *
     * @param {*} data
     * @returns {boolean}
     * @memberof LedgerUtilityService
     */
    public checkIfExportIsValid(data: any): boolean {
        const salesParentGroups = ['revenuefromoperations', 'otherincome'];
        const debtorCreditorParentGroups = ['sundrydebtors', 'sundrycreditors'];
        const salesDebitCreditNoteVoucher = ["debit note", "credit note", "sal"];

        /**
         * Handles if functionality
         */
        if (!data.isMultiCurrency || !salesDebitCreditNoteVoucher?.includes(data.voucherType)) {
            return false;
        }

        /**
         * Handles if functionality
         */
        if (data?.particularAccount?.parentGroups?.length > 0) {
            /**
             * Handles if functionality
             */
            if (data?.particularAccount?.parentGroups[0]?.uniqueName) {
                data.particularAccount.parentGroups = data?.particularAccount?.parentGroups?.map(group => group?.uniqueName);
            }
        }

        let isSalesLedger = false;
        let isDebtorCreditorLedger = false;

        data?.ledgerAccount?.parentGroups?.forEach(group => {
            /**
             * Handles if functionality
             */
            if (salesParentGroups.includes(group?.uniqueName)) {
                isSalesLedger = true;
            } else if (debtorCreditorParentGroups.includes(group?.uniqueName)) {
                isDebtorCreditorLedger = true;
            }
        });

        let isSalesAccount = false;
        let isDebtorCreditorAccount = false;

        data?.particularAccount?.parentGroups?.forEach(groupUniqueName => {
            /**
             * Handles if functionality
             */
            if (salesParentGroups.includes(groupUniqueName)) {
                isSalesAccount = true;
            } else if (debtorCreditorParentGroups.includes(groupUniqueName)) {
                isDebtorCreditorAccount = true;
            }
        });

        let isValid = false;

        /**
         * Handles if functionality
         */
        if ((isSalesLedger && isDebtorCreditorAccount) || (isDebtorCreditorLedger && isSalesAccount)) {
            isValid = true;
        }

        return isValid;
    }
}