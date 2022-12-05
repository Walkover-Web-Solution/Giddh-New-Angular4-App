const COMMON = 'company/:companyUniqueName/';

export const SETTINGS_INTEGRATION_API = {
    SMS: COMMON + 'sms-key', // GET or POST call
    EMAIL: COMMON + 'email-key', // GET or POST call
    PAYMENT: COMMON + 'bank/registration',// POST call to save payment info
    RAZORPAY: COMMON + 'razorpay', // ALL METHODS
    CASHFREE: COMMON + 'cashfree', // GET, POST
    AUTOCOLLECT_USER: COMMON + 'cashfree/autocollect/users', // GET, POST, PUT, DELETE
    PAYMENT_GATEWAY: COMMON + 'cashfree/payment-gateway', // GET, POST, PUT, DELETE
    AMAZON_SELLER: COMMON + 'amazon/seller', // GET, POST
    AMAZON_SELLER_OPERATION: COMMON + 'amazon/seller/:sellerId', // DELETE, PUT
    GET_GMAIL_INTEGRATION_STATUS: COMMON + 'gmail-token', // GET
    REMOVE_GMAIL_INTEGRATION: COMMON + 'gmail-token', //DELETE
    REMOVE_ICICI_REQUEST: COMMON + 'bank/deregistration?urn=:urn',
    UPDATE_PAYMENT: COMMON + 'bank/updateDetails',
    BANK_INTERATION_VALIDATION_FORM: 'ui/bank/integration/form?bankName=:bankName',
    BANK_ACCOUNT_REGISTRATION: 'v2/company/:companyUniqueName/bank',
    BANK_ACCOUNT_MULTI_REGISTRATION: 'v2/company/:companyUniqueName/bank/multi-registration',
    UPDATE_PAYOR_ACCOUNT: 'v2/company/:companyUniqueName/bank/:bankAccountUniqueName/payor/:urn',
    UPDATE_ACCOUNT: 'v2/company/:companyUniqueName/bank/:bankAccountUniqueName',
    GET_PAYOR_REGISTRATION_STATUS: 'v2/company/:companyUniqueName/bank/:bankAccountUniqueName/payor/:urn/status',
    GET_BANK_ACCOUNT_PAYORS: 'v2/company/:companyUniqueName/bank/:bankAccountUniqueName/payor?amount=:amount'
};

export const SETTINGS_INTEGRATION_COMMUNICATION_API = {
    GET_PLATFORMS: COMMON + 'communication',
    VERIFY_PLATFORM: COMMON + 'communication/platform/verify',
    DELETE_PLATFORM: COMMON + 'communication/platform/:platformUniqueName',
    CREATE_TRIGGERS: COMMON + 'communication/trigger',
    GET_TRIGGERS: COMMON + 'communication/trigger',
    GET_TRIGGERS_BY_UNIQUENAME: COMMON + 'communication/trigger/:triggerUniqueName',
    DELETE_TRIGGER: COMMON + 'communication/trigger/:triggerUniqueName',
    GET_TRIGGER_FORM: COMMON + 'communication/platform/:platform/trigger/form',
    GET_FIELD_SUGGESTIONS: COMMON + 'communication/suggestions/:platform/:entity',
    GET_CAMPAIGN_FIELDS: COMMON + 'communication/campaign/:slug/fields',
    GET_CAMPAIGN_LIST: COMMON + 'communication/campaign/list'
}
