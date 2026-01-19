/**
 * FileTypeEnum enumeration
 * Defines constant values for FileTypeEnum
 */
export enum FileTypeEnum {
    PDF = "pdf",
    CSV = "csv",
    XLS ="xls",
    XLSX = "xlsx"
}

/**
 * CopyType enumeration
 * Defines constant values for CopyType
 */
export enum CopyType {
    ORIGINAL = "ORIGINAL",
    CUSTOMER = "CUSTOMER",
    TRANSPORT = "TRANSPORT"
}

// Enum representing country names.
/**
 * CountryNames enumeration
 * Defines constant values for CountryNames
 */
export enum CountryNames {
    INDIA = "India",
    UNITED_KINGDOM = "United Kingdom"
}

/**
 * AccountArchivedStatusEnum enumeration
 * Defines constant values for AccountArchivedStatusEnum
 */
export enum AccountArchivedStatusEnum {
    UNARCHIVED = 'UNARCHIVED',
    ARCHIVED = 'ARCHIVED',
    BOTH = 'BOTH'
}

/** Enum representing standard accounting group unique names used for categorizing accounts. */
/**
 * AccountingGroupEnum enumeration
 * Defines constant values for AccountingGroupEnum
 */
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
/**
 * DataOperationEnum enumeration
 * Defines constant values for DataOperationEnum
 */
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


