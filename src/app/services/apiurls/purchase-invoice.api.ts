import { Configuration } from '../../app.constant';
const COMMON = Configuration.ApiUrl + 'company/:companyUniqueName/';

export const PURCHASE_INVOICE_API = {
  INVOICE_API: COMMON + 'invoice/purchase',  // GET AND PUT call
  // GSTR_excel_export
  GET_TAXES: COMMON + 'tax', //GET
  GENERATE_PURCHASE_INVOICE: COMMON + 'account/:accountUniqueName/' +'purchase-invoice/generate',
  DOWNLOAD_GSTR1_SHEET: COMMON + 'gstreturn/gstr1_excel_export?monthYear=:month&gstin=:company_gstin', // GET
  DOWNLOAD_GSTR1_ERROR_SHEET: COMMON + 'gstreturn/GSTR1_error_sheet?monthYear=:month&gstin=:company_gstin', // GET
};
