import { Configuration } from '../../app.constant';
let COMMON_URL = Configuration.ApiUrl + 'company/:companyUniqueName/';
export const INVOICE_API = {
  GET_ALL_INVOICES: COMMON_URL + 'invoices?',
  GET_ALL_LEDGERS_FOR_INVOICE: COMMON_URL + 'ledgers?',
  GENERATE_BULK_INVOICE: COMMON_URL + 'invoices/bulk-generate?combined',
  PREVIEW_AND_GENERATE: COMMON_URL + 'v2/accounts/:accountUniqueName/invoices/preview',
  GET_INVOICE_TEMPLATES: COMMON_URL + 'templates/all',
  GET_INVOICE_TEMPLATE: COMMON_URL + 'templates-v2/templateUniqueName', // get call for single
  ACTION_ON_INVOICE: COMMON_URL + 'invoices/action',
  DELETE_INVOICE: COMMON_URL + 'invoices/:invoiceUniqueName',
  GENERATE_INVOICE: COMMON_URL + 'accounts/:accountUniqueName/invoices/generate',
  PREVIEW_INVOICE: COMMON_URL + 'v2/accounts/:accountUniqueName/invoices/preview',
  GET_INVOICE_TEMPLATE_DETAILS: COMMON_URL + 'templates-v2/:templateUniqueName' // get call for single template details
};
