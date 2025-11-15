export enum FileTypeEnum {
    PDF = "pdf",
    CSV = "csv",
    XLS ="xls",
    XLSX = "xlsx"
}

export enum CopyType {
    ORIGINAL = "ORIGINAL",
    CUSTOMER = "CUSTOMER",
    TRANSPORT = "TRANSPORT"
}

// Enum representing country names.
export enum CountryNames {
    INDIA = "India",
    UNITED_KINGDOM = "United Kingdom"
}

export enum AccountArchivedStatusEnum {
    UNARCHIVED = 'UNARCHIVED',
    ARCHIVED = 'ARCHIVED',
    BOTH = 'BOTH'
}

/** Enum representing standard accounting group unique names used for categorizing accounts. */
export enum AccountingGroupEnum {
    BankAccounts = 'bankaccounts',
    CapitalAccount = 'capitalaccount',
    CurrentAssets = 'currentassets',
    CurrentLiabilities = 'currentliabilities',
    DirectExpenses = 'directexpenses',
    DirectIncome = 'directincome',
    DutiesAndTaxes = 'dutiesandtaxes',
    FixedAssets = 'fixedassets',
    IndirectExpenses = 'indirectexpenses',
    Investments = 'investments',
    LoansLiabilities = 'loansliabilities',
    OperatingCost = 'operatingcost',
    OtherIncome = 'otherincome',
    Provisions = 'provisions',
    RevenueFromOperations = 'revenuefromoperations',
    SundryCreditors = 'sundrycreditors',
    SundryDebtors = 'sundrydebtors'
}

/** Enum representing dropdown types in ledger entry panel */
export enum LedgerDropdownTypeEnum {
    TAG = 'tag',
    TAX = 'tax',
    DISCOUNT = 'discount',
    SALES_PERSON = 'salesPerson',
    VOUCHER = 'voucher',
    VARIANT = 'variant',
    WAREHOUSE = 'warehouse',
    ITC = 'itc',
    INVOICE = 'invoice',
    ACCOUNT = 'account'
}
