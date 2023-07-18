const COMMON_URL_FOR_IMPORT_EXCEL = 'company/:companyUniqueName/imports';

export const IMPORT_EXCEL_API = {
    UPLOAD_FILE: COMMON_URL_FOR_IMPORT_EXCEL + '/upload?type=:entity',
    PROCESS_IMPORT: COMMON_URL_FOR_IMPORT_EXCEL + '/process?entity=:entity&isHeaderProvided=:isHeaderProvided',
    IMPORT_STATUS: COMMON_URL_FOR_IMPORT_EXCEL + '/status?page=:page&count=:count'
};
