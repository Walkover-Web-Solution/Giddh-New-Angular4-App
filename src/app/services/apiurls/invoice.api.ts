import { Configuration } from '../../app.constant';
let COMMON_URL = Configuration.ApiUrl + 'company/:companyUniqueName/';
export const INVOICE_API = {
  GET_ALL_INVOICES: COMMON_URL + 'invoices?',
  GET_ALL_LEDGERS_FOR_INVOICE: COMMON_URL + 'ledgers?',
  GENERATE_BULK_INVOICE: COMMON_URL + 'invoices/bulk-generate?combined',
  PREVIEW_INVOICE: COMMON_URL + 'accounts/:accountUniqueName/invoices/generate',
  PREVIEW_AND_GENERATE: COMMON_URL + 'accounts/:accountUniqueName/invoices/preview',
  GET_INVOICE_TEMPLATES: COMMON_URL + 'templates/all'
};
