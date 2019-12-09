const COMMON_URL_FOR_IMPORT_EXCEL = 'company/:companyUniqueName/import-xls';

export const IMPORT_EXCEL_API = {
    UPLOAD_FILE: COMMON_URL_FOR_IMPORT_EXCEL + '/upload?entity=:entity',
    PROCESS_IMPORT: COMMON_URL_FOR_IMPORT_EXCEL + '/process?entity=:entity&isHeaderProvided=:isHeaderProvided',
    IMPORT_STATUS: COMMON_URL_FOR_IMPORT_EXCEL + '/status?page=:page&count=:count',
    IMPORT_STATUS_DETAILS: COMMON_URL_FOR_IMPORT_EXCEL + '/status/:requestId',
};
