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

        if (formValue.openingBalance) {
            columnsToExport.push("Opening Balance");
        }
        if (formValue.openingBalanceType) {
            columnsToExport.push("Opening Balance Type");
        }
        if (formValue.foreignOpeningBalance) {
            columnsToExport.push("Foreign Opening Balance");
        }
        if (formValue.foreignOpeningBalanceType) {
            columnsToExport.push("Foreign Opening Balance Type");
        }
        if (formValue.currency) {
            columnsToExport.push("Currency");
        }
        if (formValue.mobileNumber) {
            columnsToExport.push("Mobile Number");
        }
        if (formValue.email) {
            columnsToExport.push("Email");
        }
        if (formValue.attentionTo) {
            columnsToExport.push("Attention to");
        }
        if (formValue.remark) {
            columnsToExport.push("Remark");
        }
        if (formValue.address) {
            columnsToExport.push("Address");
        }
        if (formValue.pinCode) {
            columnsToExport.push("Pin Code");
        }
        if (formValue.taxNumber) {
            columnsToExport.push("Tax Number");
        }
        if (formValue.partyType) {
            columnsToExport.push("Party Type");
        }
        if (formValue.bankName) {
            columnsToExport.push("Bank Name");
        }
        if (formValue.bankAccountNumber) {
            columnsToExport.push("Bank Account Number");
        }
        if (formValue.ifscCode) {
            columnsToExport.push("IFSC Code");
        }
        if (formValue.beneficiaryName) {
            columnsToExport.push("Beneficiary Name");
        }
        if (formValue.branchName) {
            columnsToExport.push("Branch Name");
        }
        if (formValue.swiftCode) {
            columnsToExport.push("Swift Code");
        }

        return columnsToExport;
    }
}
