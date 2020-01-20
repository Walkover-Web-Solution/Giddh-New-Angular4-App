const COMMON = 'company/:companyUniqueName/';
const GSTRETURN = 'company/:companyUniqueName/gstreturn/';

export const PURCHASE_INVOICE_API = {
    INVOICE_API: COMMON + 'invoices/purchase',  // GET AND PUT call
    // GSTR_excel_export
    GET_TAXES: COMMON + 'tax', // GET
    GENERATE_PURCHASE_INVOICE: COMMON + 'accounts/:accountUniqueName/' + 'invoices/generate-purchase',
    UPDATE_PURCHASE_ENTRY: COMMON + 'accounts/:accountUniqueName/' + 'ledgers/:ledgerUniqueName',
    DOWNLOAD_GSTR1_SHEET: COMMON + 'gstreturn/:report_sheet_Type?from=:from&to=:to&gstin=:company_gstin', // GET gstr1_excel_export || gstr2_excel_export
    DOWNLOAD_GSTR1_ERROR_SHEET: COMMON + 'gstreturn/:error_sheet_Type?from=:from&to=:to&gstin=:company_gstin', // GET error_sheet_Type = (gstr1_error_export || gstr2_error_export)
    DOWNLOAD_GSTR2_EXCEL_SHEET: COMMON + 'gstreturn/gstr2-excel-export?monthYear=:month&gstin=:company_gstin', // GET gstr2_excel_export
    DOWNLOAD_GSTR2_ERROR_SHEET: COMMON + 'gstreturn/gstr2-error-export?monthYear=:month&gstin=:company_gstin', // GET
    UPDATE_INVOICE: COMMON + 'accounts/:accountUniqueName/' + 'invoices/generate-purchase/:invoiceUniqueName', // PATCH
    DOWNLOAD_GSTR2_SHEET: COMMON + 'gstreturn/gstr2_data/file?monthYear=:month&gstin=:company_gstin', // GET
    SEND_GSTR3B_EMAIL: 'v2/company/:companyUniqueName/gstr3b-excel-export/email?monthYear=:month&gstin=:company_gstin&detailedSheet=:isNeedDetailSheet&email=:userEmail'
};

export const GST_RETURN_API = {
    SAVE_JIO_GST: GSTRETURN + 'settings',
    // SAVE_TAX_PRO: GSTRETURN + 'taxpro/get-otp?gstin=:GSTIN&username=:USERNAME', // GET
    SAVE_TAX_PRO: GSTRETURN + 'taxpro/get-otp', // POST given by @Mayank
    // SAVE_TAX_PRO_WITH_OTP: GSTRETURN + 'taxpro/get-auth-token?gstin=:GSTIN&username=:USERNAME&otp=:OTP', // GET
    SAVE_TAX_PRO_WITH_OTP: GSTRETURN + 'taxpro/get-auth-token?otp=:OTP', // POST given by @Mayank
    FILE_JIO_GST_RETURN: GSTRETURN + 'post-data-to-jiogst?from=:from&to=:to&gstin=:company_gstin',
    FILE_TAX_PRO_RETURN: GSTRETURN + 'taxpro/post-data-to-taxpro?gstin=:company_gstin&from=:from&to=:to',
    FILE_VAYANA_RETURN: GSTRETURN + 'vayana/post-data-to-vayana?gstin=:company_gstin&from=:from&to=:to',
    FILE_GSTR3B: 'v2/' + COMMON + 'save-gstr3b?gstin=:company_gstin&from=:from&to=:to&gsp=:gsp',
    SAVE_GSP_SESSION: 'v2/' + COMMON + 'gsp-session?gstin=:company_gstin&userName=:USERNAME&gsp=:GSP',
    SAVE_GSP_SESSION_WITH_OTP: 'v2/' + COMMON + 'authenticate-gsp-session?gstin=:company_gstin&userName=:USERNAME&gsp=:GSP&otp=:OTP',
    GET_GSP_SESSION: 'v2/' + COMMON + 'session?gstin=:company_gstin',
};
