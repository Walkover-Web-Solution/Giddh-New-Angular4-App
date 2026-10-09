export enum ImportStepEnum {
    First = 'First',
    Second = 'Second'
};

export enum ImportStatementType {
    Voucher = 'Voucher',
    BankStatement = 'Bank_statement',
    Stock = 'stock',
    BankTransactions = 'banktransactions',
    Entries = 'entries',
    Master = 'master'
};

// This enum is used to differentiate between the types of vouchers that can be imported
export enum VoucherType {
    AccountWise = "account-wise",
    VoucherWise = "voucher-wise",
    BankStatement = "banktransactions"
}

export enum VoucherImportType {
    AccountWiseImport = "ACCOUNT_WISE_VOUCHER_IMPORT",
    VoucherWiseImport = "VOUCHER_WISE_VOUCHER_IMPORT",
    BankTransactionsImport = "BANK_TRANSACTIONS_IMPORT"
}

