export const COMMON_API = {
    COUNTRY: 'country?formName=:formName&refresh=false',
    TAXES: 'ui/taxes?country=:country',
    CURRENCY: 'currency',
    CALLING_CODES: 'ui/calling-code',
    FORM: 'ui/forms?formName=:formName&country=:country&refresh=false',
    PARTY_TYPE: 'ui/party-types',
    COMMAND_K: 'company/:companyUniqueName/cmdk?page=:page&q=:q&group=:group&refresh=false&isMobile=:isMobile',
    DOWNLOAD_FILE: 'company/:companyUniqueName/download-file?voucherVersion=2&fileType=:fileType&downloadOption=:downloadOption',
    STOCK_UNITS: 'stock-units',
    GST_STOCK_UNITS: 'v2/company/:companyUniqueName/gst/unit-mapping',
    MODULE_WISE_COLUMNS: 'report-filters?module=:module&companyUniqueName=:companyUniqueName',
    UPLOAD_FILE: 'company/:companyUniqueName/ledger/upload',
    UPLOAD_IMAGE: 'company/:companyUniqueName/images',
    BARCODE_SCAN: 'v4/company/:companyUniqueName/particular?customerUniqueName=:customerUniqueName&invoiceType=:invoiceType&barcode=:barcode',
    GST_INFORMATION: 'gst-info?gstin=:gstin',
    SUBSCRIPTION_PAYPAL_CALL_BACK: 'v2/subscription/paypal-subscription-callback'
};
