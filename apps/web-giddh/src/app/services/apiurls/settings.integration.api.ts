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
    BENEFICIARY_REGISTRATION: 'company/:companyUniqueName/bank/bene-registration?urn=:urn',
    BENEFICIARY_VALIDATION: 'company/:companyUniqueName/bank/bene-validation?urn=:urn&bnfAccNo=:bnfAccNo',
    GET_BENEFICIARIES: 'company/:companyUniqueName/bank/get-beneficiaries?urn=:urn',
    GET_REGISTRATION_STATUS: 'company/:companyUniqueName/bank/get-registration-status?urn=:urn',
    BANK_ACCOUNT_REGISTRATION: 'v2/company/:companyUniqueName/bank',
    BANK_ACCOUNT_MULTI_REGISTRATION: 'v2/company/:companyUniqueName/bank/multi-registration',
    UPDATE_PAYOR_ACCOUNT: 'v2/company/:companyUniqueName/bank/:bankAccountUniqueName/payor/:urn'
};
