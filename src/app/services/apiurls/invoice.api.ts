import { Configuration } from '../../app.constant';
let COMMON_URL = Configuration.ApiUrl + 'company/:companyUniqueName/';
// let COMMON_URL = 'http://apidev.giddh.com/' + 'company/:companyUniqueName/'; //using static path to test invoice-setting api
export const INVOICE_API = {
  GET_ALL_INVOICES: COMMON_URL + 'invoices?',
  GET_ALL_LEDGERS_FOR_INVOICE: COMMON_URL + 'ledgers?',
  GENERATE_BULK_INVOICE: COMMON_URL + 'invoices/bulk-generate?combined',
  PREVIEW_AND_GENERATE: COMMON_URL + 'v2/accounts/:accountUniqueName/invoices/preview',
  GET_INVOICE_TEMPLATES: COMMON_URL + 'templates/all',
  GET_INVOICE_TEMPLATE: COMMON_URL + 'templates-v2/templateUniqueName', // get call for single
  ACTION_ON_INVOICE: COMMON_URL + 'invoices/:invoiceUniqueName/action',
  DELETE_INVOICE: COMMON_URL + 'invoices/:invoiceNumber',
  GENERATE_INVOICE: COMMON_URL + 'accounts/:accountUniqueName/invoices/generate',
  PREVIEW_INVOICE: COMMON_URL + 'v2/accounts/:accountUniqueName/invoices/preview',
  GET_INVOICE_TEMPLATE_DETAILS: COMMON_URL + 'templates-v2/:templateUniqueName', // get call for single template details
  SETTING_INVOICE: COMMON_URL + 'settings', // GET/POST Invoice Setting
  DELETE_WEBHOOK: COMMON_URL + 'settings/webhooks/:webhookUniquename', // Delete Invoice Webhook
  UPDATE_INVOICE_EMAIL: COMMON_URL + 'invoice-setting', // Update Invoice Email
  SAVE_INVOICE_WEBHOOK: COMMON_URL + 'settings/webhooks', // Save Webhook
  GET_RAZORPAY_DETAIL: COMMON_URL + 'razorpay', // Get RazorPay Detail
};
