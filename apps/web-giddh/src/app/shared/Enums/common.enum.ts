export enum FileTypeEnum {
    PDF = "pdf",
    CSV = "csv",
    XLS ="xls",
    XLSX = "xlsx"
}

export enum CopyType {
    ORIGINAL = "Original",
    CUSTOMER = "Customer",
    TRANSPORT = "Transport"
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

/** Enum representing data operations for database manipulation, including CRUD and extended operations. */
export enum DataOperationEnum {
    /** Create a new record in the database */
    CREATE = 'CREATE',
    /** Read/retrieve existing records from the database */
    READ = 'READ',
    /** Update an existing record with new data */
    UPDATE = 'UPDATE',
    /** Delete an existing record from the database */
    DELETE = 'DELETE',
    /** Merge data from multiple sources into a single record */
    MERGE = 'MERGE',
    /** Insert a new record or update if it already exists */
    UPSERT = 'UPSERT',
    /** Partially update specific fields of an existing record */
    PATCH = 'PATCH',
    /** Create multiple records in a single operation */
    BULK_CREATE = 'BULK_CREATE',
    /** Update multiple records in a single operation */
    BULK_UPDATE = 'BULK_UPDATE',
    /** Delete multiple records in a single operation */
    BULK_DELETE = 'BULK_DELETE'
}

/** Enum representing account category types used for categorizing accounts and transactions */
export enum AccountCategoryEnum {
    /** Income/Revenue category for sales and revenue accounts */
    INCOME = 'income',
    /** Expense category for cost and expense accounts (singular form) */
    EXPENSE = 'expense',
    /** Expenses category for cost and expense accounts (plural form) */
    EXPENSES = 'expenses',
    /** Assets category for asset accounts */
    ASSETS = 'assets',
    /** Liabilities category for liability accounts */
    LIABILITIES = 'liabilities'
}


