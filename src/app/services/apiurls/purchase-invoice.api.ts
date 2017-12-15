
const COMMON = 'company/:companyUniqueName/';

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
};
