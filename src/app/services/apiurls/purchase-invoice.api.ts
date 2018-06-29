
const COMMON = 'company/:companyUniqueName/';
const GSTRETURN = 'company/:companyUniqueName/gstreturn/';

export const PURCHASE_INVOICE_API = {
  INVOICE_API: COMMON + 'invoices/purchase',  // GET AND PUT call
  // GSTR_excel_export
  GET_TAXES: COMMON + 'tax', // GET
  GENERATE_PURCHASE_INVOICE: COMMON + 'accounts/:accountUniqueName/' + 'invoices/generate-purchase',
  UPDATE_PURCHASE_ENTRY: COMMON + 'accounts/:accountUniqueName/' + 'ledgers/:ledgerUniqueName',
  DOWNLOAD_GSTR1_SHEET: COMMON + 'gstreturn/:report_sheet_Type?monthYear=:month&gstin=:company_gstin', // GET gstr1_excel_export || gstr2_excel_export
  DOWNLOAD_GSTR1_ERROR_SHEET: COMMON + 'gstreturn/:error_sheet_Type?monthYear=:month&gstin=:company_gstin', // GET error_sheet_Type = (gstr1_error_export || gstr2_error_export)
  UPDATE_INVOICE: COMMON + 'accounts/:accountUniqueName/' + 'invoices/generate-purchase/:invoiceUniqueName', // PATCH
  DOWNLOAD_GSTR2_SHEET: COMMON + 'gstreturn/gstr2_data/file?monthYear=:month&gstin=:company_gstin', // GET
  SEND_GSTR3B_EMAIL: COMMON + 'gstreturn/gstr3b-excel-export/email?monthYear=:month&gstin=:company_gstin&detailedSheet=:isNeedDetailSheet&email=:userEmail'
};

export const GST_RETURN_API = {
  SAVE_JIO_GST: GSTRETURN + 'settings',
  SAVE_TAX_PRO: GSTRETURN + 'taxpro/get-otp?gstin=:GSTIN&username=:USERNAME',
  SAVE_TAX_PRO_WITH_OTP: GSTRETURN + 'taxpro/get-auth-token?gstin=:GSTIN&username=:USERNAME&otp=:OTP',
  FILE_JIO_GST_RETURN: GSTRETURN + 'post-data-to-jiogst?monthYear=:month&gstin=:company_gstin',
  FILE_TAX_PRO_RETURN: GSTRETURN + 'taxpro/post-data-to-taxpro?gstin=:company_gstin&monthYear=:month',
};
