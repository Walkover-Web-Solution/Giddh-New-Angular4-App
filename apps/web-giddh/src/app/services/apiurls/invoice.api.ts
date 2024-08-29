let COMMON_URL = 'company/:companyUniqueName/';
let COMMON_URL_V4 = 'v4/company/:companyUniqueName/';
let EWAYBILL_COMMON_URL = 'company/:companyUniqueName/ewb';
let PART_A = 'v2/company/:companyUniqueName/';
let PART_B = 'accounts/:accountUniqueName/invoices/';
let PART_B_V2 = 'accounts/:accountUniqueName/vouchers/';
let URI_ONLY_FOR_INVOICE = PART_A + PART_B;

export const INVOICE_API = {
    GET_ALL_LEDGERS_FOR_INVOICE: COMMON_URL + 'ledgers?',
    GENERATE_BULK_INVOICE: COMMON_URL_V4 + 'accounts/:accountuniquename/vouchers/bulk-generate?combined',
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
    DOWNLOAD_INVOICE_EXPORT_CSV: COMMON_URL + 'export-invoices?from=:from&to=:to&fileType=base64',
    REMOVE_IMAGE_SIGNATURE: COMMON_URL + '/delete-image?imgUniqueName=:imgUniqueName',
    CANCEL_E_INVOICE_API: COMMON_URL + 'invoice/:invoiceUniqueName/cancel-einvoice',
    CANCEL_CN_DN_E_INVOICE_API: COMMON_URL + 'voucher/:voucherUniqueName/cancel-einvoice',
    VERIFY_EMAIL: COMMON_URL + 'invoice-setting/verify-email?emailAddress=:emailAddress&scope=:scope&branchUniqueName=:branchUniqueName',
    GET_ALL_VERSIONS: COMMON_URL + 'voucher/:voucherUniqueName/versions?page=:page&count=:count',
    GET_CREATED_TEMPLATES: 'v2/company/:companyUniqueName/templates?type=:voucherType'
};

export const INVOICE_API_2 = {
    UPDATE_GENERATED_INVOICE: URI_ONLY_FOR_INVOICE,
    SEND_INVOICE_ON_MAIL: COMMON_URL + PART_B_V2 + 'mail',
    GENERATE_INVOICE: URI_ONLY_FOR_INVOICE + 'generate',
    PREVIEW_INVOICE: URI_ONLY_FOR_INVOICE + 'preview',
    DOWNLOAD_INVOICE: COMMON_URL + PART_B_V2 + 'download-file?fileType=pdf',
    GENERATED_INVOICE_PREVIEW: PART_A + 'accounts/:accountUniqueName/invoice/preview',
    GET_INVOICE_TEMPLATE_DETAILS: PART_A + 'templates/:templateUniqueName',
    SEND_INVOICE_ON_SMS: COMMON_URL + 'accounts/:accountUniqueName/vouchers/:voucherNumber/magic-link?expirey=1',
    DELETE_VOUCHER: COMMON_URL + 'accounts/:accountUniqueName/vouchers',
    PREVIEW_VOUCHERS: COMMON_URL + 'accounts/:accountUniqueName/vouchers/preview',
    DOWNLOAD_INVOICE_V3: COMMON_URL + ':companyUniqueName/accounts/:accountUniqueName/vouchers/mail',
    CANCEL_E_INVOICE: COMMON_URL + 'accounts/:accountUniqueName/vouchers/cancel-einvoice',
    GENERATE_BULK_INVOICE: COMMON_URL_V4 + 'vouchers/bulk-generate?combined',
    PREVIEW_VOUCHERS_V4: COMMON_URL_V4 + 'accounts/:accountUniqueName/vouchers',
};

export const EWAYBILL_API = {
    GENERATE_EWAYBILL: EWAYBILL_COMMON_URL,
    LOGIN_EWAYBILL_USER: EWAYBILL_COMMON_URL + '/user',
    DOWNLOAD_EWAY: EWAYBILL_COMMON_URL + '/:ewaybillNumber' + '/download',
    DOWNLOAD_DETAILED_EWAY: EWAYBILL_COMMON_URL + '/:ewaybillNumber' + '/download-detailed',
    CANCEL_EWAY_BILL: EWAYBILL_COMMON_URL + '/cancel',
    UPDATE_EWAY_VEHICLE: EWAYBILL_COMMON_URL + '/vehicle',
    VALIDATE_INVOICE_EWAYBILL: EWAYBILL_COMMON_URL + '/validate-invoice',
    ADD_TRANSPORTER: COMMON_URL + 'transporters',  // get all transporter
    GET_ALL_TRANSPORTER: COMMON_URL + 'transporters?page=:pageNo',
    UPDATE_TRANSPORTER: COMMON_URL + 'transporters?transporterId=:transporterId', // FOR DELETE TRANSPORTER ALSO
    DELETE_TRANSPORTER: COMMON_URL + 'transporters?transporterId=:transporterId'
};

export const BULK_UPDATE_VOUCHER = {
    BULK_UPDATE_VOUCHER_ACTION: COMMON_URL + 'vouchers/bulk-update?action=:actionType'
}

export const CUSTOM_EMAIL_TEMPLATE = {
    GET_EMAIL_CONTENT: COMMON_URL + 'communication/email-content-suggestion',
    GET_EMAIL_CONDITIONS: COMMON_URL + 'communication/condition-suggestion?triggerModule=:triggerModule',
    CREATE_EMAIL_TEMPLATE: PART_A + 'communication/email-template',
    UPDATE_EMAIL_TEMPLATE: PART_A + 'communication/email-template/:voucherType',
    GET_EMAIL_TEMPLATE: PART_A + 'communication/email-template/:voucherType'
}
