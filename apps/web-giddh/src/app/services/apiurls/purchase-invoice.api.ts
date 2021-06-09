const COMMON = 'company/:companyUniqueName/';
const GSTRETURN = 'company/:companyUniqueName/gstreturn/';

export const PURCHASE_INVOICE_API = {
    DOWNLOAD_GSTR2_EXCEL_SHEET: COMMON + 'gstreturn/gstr2-excel-export?monthYear=:month&gstin=:company_gstin', // GET gstr2_excel_export
    DOWNLOAD_GSTR2_ERROR_SHEET: COMMON + 'gstreturn/gstr2-error-export?monthYear=:month&gstin=:company_gstin', // GET
    DOWNLOAD_GSTR2_SHEET: COMMON + 'gstreturn/gstr2_data/file?monthYear=:month&gstin=:company_gstin', // GET
    SEND_GSTR3B_EMAIL: 'v2/company/:companyUniqueName/gstr3b-excel-export/email?monthYear=:month&gstin=:company_gstin&detailedSheet=:isNeedDetailSheet&email=:userEmail'
};

export const GST_RETURN_API = {
    FILE_JIO_GST_RETURN: GSTRETURN + 'post-data-to-jiogst?from=:from&to=:to&gstin=:company_gstin',
    FILE_TAX_PRO_RETURN: GSTRETURN + 'taxpro/post-data-to-taxpro?gstin=:company_gstin&from=:from&to=:to',
    FILE_VAYANA_RETURN: GSTRETURN + 'vayana/post-data-to-vayana?gstin=:company_gstin&from=:from&to=:to',
    FILE_GSTR3B: 'v2/' + COMMON + 'save-gstr3b?gstin=:company_gstin&from=:from&to=:to&gsp=:gsp',
    GET_GSP_SESSION: 'v2/' + COMMON + 'session?gstin=:company_gstin',
    GET_TAX_DETAILS: COMMON + 'tax-numbers'
};
