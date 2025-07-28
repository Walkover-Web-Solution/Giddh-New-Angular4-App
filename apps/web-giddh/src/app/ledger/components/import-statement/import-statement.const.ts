export enum ImportStepEnum {
    First = 'First',
    Second = 'Second'
};

export enum ImportStatementType {
    Voucher = 'Voucher',
    BankStatement = 'Bank_statement'
};

// This enum is used to differentiate between the types of vouchers that can be imported
export enum VoucherType {
    AccountWise = "account-wise",
    VoucherWise = "voucher-wise"
}

export enum VoucherImportType {
    AccountWiseImport = "ACCOUNT_WISE_VOUCHER_IMPORT",
    VoucherWiseImport = "VOUCHER_WISE_VOUCHER_IMPORT"
}

