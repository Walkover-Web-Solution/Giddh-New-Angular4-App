const COMMON_URL_FOR_GSTR = 'company/:companyUniqueName/gstreturn';
const COMMON_URL = 'company/:companyUniqueName';
const COMMON_V2 = 'v2/company/:companyUniqueName';

export const GSTR_API = {
    GET_OVERVIEW: COMMON_V2 + '/:gstType-summary?gstin=:gstin&from=:from&to=:to',
    GET_TRANSACTIONS: COMMON_V2 + '/:gstType-transactions?gstin=:gstin&entityType=:entityType&type=:type&page=:page&status=:status&from=:from&to=:to',
    GET_RETURN_SUMMARY: COMMON_URL_FOR_GSTR + '/:gstType-transactions/summary?page=:page&count=:count&gstin=:gstin&gstReturnType=:gstReturnType&from=:from&to=:to',
    GET_TRANSACTIONS_COUNTS: COMMON_URL_FOR_GSTR + '/gstr-transaction-count?gstin=:gstin&from=:from&to=:to',
    GET_DOCUMENT_ISSUED: COMMON_URL_FOR_GSTR + '/gstr1-transactions/documents-issued?gstin=:gstin&from=:from&to=:to',
    GSTR1_SUMMARY_DETAILS: COMMON_V2 + '/gstr1?gstin=:gstin&from=:from&to=:to',
    DOWNLOAD_SHEET: COMMON_V2 + '/:gstType-export?gstin=:gstin&from=:from&to=:to&type=:sheetType',
    SAVE_GSP_SESSION: COMMON_V2 + '/gsp-session?gstin=:company_gstin&userName=:USERNAME&gsp=:GSP',
    SAVE_GSP_SESSION_WITH_OTP: COMMON_V2 + '/authenticate-gsp-session?gstin=:company_gstin&userName=:USERNAME&gsp=:GSP&otp=:OTP',
    FILE_GSTR1: COMMON_V2 + '/save-gstr1?gstin=:company_gstin&from=:from&to=:to&gsp=:gsp&currentDateTime=:currentDateTime',
    DOWNLOAD_JSON: COMMON_V2 +'/gstr1/download?gstin=:gstIn&from=:from&to=:to&type=:type',
    GET_FILING_STATUS_REFERENCE_ID: COMMON_V2 +'/gstr1-referenceIds?gstin=:gstIn&from=:from&to=:to&page=:page&count=:count&gsp=:gsp',
    GET_FILING_STATUS_RESPONSE: COMMON_V2 + '/save-gstr1-status?referenceId=:referenceId',
    GET_LUT_NUMBER_LIST: COMMON_URL + '/gst-setting/list',
    DELETE_LUT_NUMBER: COMMON_URL + '/gst-setting/:lutNumberUniqueName'

};
