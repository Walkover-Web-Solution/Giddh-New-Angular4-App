const COMMON = 'company/:companyUniqueName/';

export const COMPANY_IMPORT_EXPORT_API = {
    EXPORT: COMMON + 'export',
    EXPORT_LEDGERS: COMMON + 'export-ledgers?from=:from&to=:to',
    IMPORT: COMMON + 'import',
    IMPORT_LEDGERS: COMMON + 'import-ledgers',
};
