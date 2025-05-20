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

export enum AccountArchivedStatusEnum {
    UNARCHIVED = 'UNARCHIVED',
    ARCHIVED = 'ARCHIVED',
    BOTH = 'BOTH'
}

export enum GroupEnum {
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
