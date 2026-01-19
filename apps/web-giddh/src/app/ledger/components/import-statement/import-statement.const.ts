/**
 * ImportStepEnum enumeration
 * Defines constant values for ImportStepEnum
 */
export enum ImportStepEnum {
    First = 'First',
    Second = 'Second'
};

/**
 * ImportStatementType enumeration
 * Defines constant values for ImportStatementType
 */
export enum ImportStatementType {
    Voucher = 'Voucher',
    BankStatement = 'Bank_statement',
    Stock = 'stock',
    BankTransactions = 'banktransactions',
    Entries = 'entries',
    Master = 'master'
};

// This enum is used to differentiate between the types of vouchers that can be imported
/**
 * VoucherType enumeration
 * Defines constant values for VoucherType
 */
export enum VoucherType {
    AccountWise = "account-wise",
    VoucherWise = "voucher-wise"
}

/**
 * VoucherImportType enumeration
 * Defines constant values for VoucherImportType
 */
export enum VoucherImportType {
    AccountWiseImport = "ACCOUNT_WISE_VOUCHER_IMPORT",
    VoucherWiseImport = "VOUCHER_WISE_VOUCHER_IMPORT",
    BankTransactionsImport = "BANK_TRANSACTIONS_IMPORT"
}

