
let COMMON_URL = 'company/:companyUniqueName/';
let PART_A = 'v2/company/:companyUniqueName/';
let PART_B = 'accounts/:accountUniqueName/invoices/';
let URI_ONLY_FOR_INVOICE = PART_A + PART_B;

export const INVOICE_API = {
  GET_ALL_INVOICES: COMMON_URL + 'invoices?',
  GET_ALL_LEDGERS_FOR_INVOICE: COMMON_URL + 'ledgers?',
  // GENERATE_BULK_INVOICE: COMMON_URL + 'invoices/bulk-generate?combined', // By Nidhi
  GENERATE_BULK_INVOICE: COMMON_URL + 'vouchers/bulk-generate?combined',
  GET_INVOICE_TEMPLATES: COMMON_URL + 'templates/all',
  GET_INVOICE_TEMPLATE: COMMON_URL + 'templates-v2/templateUniqueName', // get call for single
  ACTION_ON_INVOICE: COMMON_URL + 'invoices/:invoiceUniqueName/action',
  DELETE_INVOICE: COMMON_URL + 'invoices',
  GENERATE_INVOICE: COMMON_URL + PART_B + 'generate',
  SETTING_INVOICE: COMMON_URL + 'settings', // GET/POST Invoice Setting
  DELETE_WEBHOOK: COMMON_URL + 'settings/webhooks/:webhookUniquename', // Delete Invoice Webhook
  UPDATE_INVOICE_EMAIL: COMMON_URL + 'invoice-setting', // Update Invoice Email
  SAVE_INVOICE_WEBHOOK: COMMON_URL + 'settings/webhooks', // Save Webhook
  GET_RAZORPAY_DETAIL: COMMON_URL + 'razorpay', // Get RazorPay Detail
  SEND_INVOICE_ON_MAIL: COMMON_URL + PART_B + 'mail', // POST
};

export const INVOICE_API_2 = {
  UPDATE_GENERATED_INVOICE: URI_ONLY_FOR_INVOICE,
  SEND_INVOICE_ON_MAIL: URI_ONLY_FOR_INVOICE + 'mail',
  GENERATE_INVOICE: URI_ONLY_FOR_INVOICE + 'generate',
  PREVIEW_INVOICE: URI_ONLY_FOR_INVOICE + 'preview',
  DOWNLOAD_INVOICE: URI_ONLY_FOR_INVOICE + 'download',
  GENERATED_INVOICE_PREVIEW: PART_A + 'accounts/:accountUniqueName/invoice/preview',
  GET_INVOICE_TEMPLATE_DETAILS: PART_A + 'templates/:templateUniqueName',
  SEND_INVOICE_ON_SMS: COMMON_URL + 'accounts/:accountUniqueName/vouchers/:voucherNumber/magic-link?expirey=1'
};
