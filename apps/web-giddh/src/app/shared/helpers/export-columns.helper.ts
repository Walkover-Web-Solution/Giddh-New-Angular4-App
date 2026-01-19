/**
 * Shared utility for export column selection logic
 * Used by export-group-ledger and export-master-dialog components
 */
export class ExportColumnsHelper {
    /**
     * Builds the columnsToExport array based on form values
     * 
     * @param formValue Form values containing boolean flags for each column
     * @returns Array of column names to export
     */
    public static buildColumnsToExport(formValue: any): string[] {
        const columnsToExport: string[] = [];

        /**
         * Handles if functionality
         */
        if (formValue.openingBalance) {
            columnsToExport.push("Opening Balance");
        }
        /**
         * Handles if functionality
         */
        if (formValue.openingBalanceType) {
            columnsToExport.push("Opening Balance Type");
        }
        /**
         * Handles if functionality
         */
        if (formValue.foreignOpeningBalance) {
            columnsToExport.push("Foreign Opening Balance");
        }
        /**
         * Handles if functionality
         */
        if (formValue.foreignOpeningBalanceType) {
            columnsToExport.push("Foreign Opening Balance Type");
        }
        /**
         * Handles if functionality
         */
        if (formValue.currency) {
            columnsToExport.push("Currency");
        }
        /**
         * Handles if functionality
         */
        if (formValue.mobileNumber) {
            columnsToExport.push("Mobile Number");
        }
        /**
         * Handles if functionality
         */
        if (formValue.email) {
            columnsToExport.push("Email");
        }
        /**
         * Handles if functionality
         */
        if (formValue.attentionTo) {
            columnsToExport.push("Attention to");
        }
        /**
         * Handles if functionality
         */
        if (formValue.remark) {
            columnsToExport.push("Remark");
        }
        /**
         * Handles if functionality
         */
        if (formValue.address) {
            columnsToExport.push("Address");
        }
        /**
         * Handles if functionality
         */
        if (formValue.pinCode) {
            columnsToExport.push("Pin Code");
        }
        /**
         * Handles if functionality
         */
        if (formValue.taxNumber) {
            columnsToExport.push("Tax Number");
        }
        /**
         * Handles if functionality
         */
        if (formValue.partyType) {
            columnsToExport.push("Party Type");
        }
        /**
         * Handles if functionality
         */
        if (formValue.bankName) {
            columnsToExport.push("Bank Name");
        }
        /**
         * Handles if functionality
         */
        if (formValue.bankAccountNumber) {
            columnsToExport.push("Bank Account Number");
        }
        /**
         * Handles if functionality
         */
        if (formValue.ifscCode) {
            columnsToExport.push("IFSC Code");
        }
        /**
         * Handles if functionality
         */
        if (formValue.beneficiaryName) {
            columnsToExport.push("Beneficiary Name");
        }
        /**
         * Handles if functionality
         */
        if (formValue.branchName) {
            columnsToExport.push("Branch Name");
        }
        /**
         * Handles if functionality
         */
        if (formValue.swiftCode) {
            columnsToExport.push("Swift Code");
        }

        return columnsToExport;
    }
}
