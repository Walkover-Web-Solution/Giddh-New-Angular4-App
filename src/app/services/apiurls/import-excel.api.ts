const COMMON_URL_FOR_IMPORT_EXCEL = 'company/:companyUniqueName/import-xls';

export const IMPORT_EXCEL_API = {
  UPLOAD_FILE: COMMON_URL_FOR_IMPORT_EXCEL + '/upload?entity=:entity',
  PROCESS_IMPORT: COMMON_URL_FOR_IMPORT_EXCEL + '/process?entity=:entity',
};
