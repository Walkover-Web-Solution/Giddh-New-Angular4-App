export const COMPANY_API = {
    GET_STATE_DETAILS: 'state-details?companyUniqueName=:companyUniqueName',
    SET_STATE_DETAILS: 'state-details',
    COMPANY_LIST: 'users/:uniqueName/v2/companies',
    CREATE_COMPANY: 'company',
    SEND_EMAIL: 'v2/company/:companyUniqueName/groups/:groupUniqueName/email-account-closing-balance?from=:from&to=:to&sortBy=:sortBy&sort=:sort',
    SEND_SMS: 'v2/company/:companyUniqueName/groups/:groupUniqueName/sms-account-closing-balance?from=:from&to=:to&sortBy=:sortBy&sort=:sort',
    TAX: 'company/:companyUniqueName/tax', // get call
    GET_COMPANY_USERS: 'company/:companyUniqueName/users',
    GET_ALL_STATES: 'country/:country',
    UNIVERSAL_DATE: 'company/:companyUniqueName/entry-settings',
    DOWNLOAD_CSV: 'v2/company/:companyUniqueName/groups/:groupUniqueName/download-account-closing-balance?from=:from&to=:to&sortBy=:sortBy&sort=:sort',
    REGISTER_ACCOUNT: 'company/:companyUniqueName/bank/',

    BUSINESS_NATURE_LIST: 'business-nature',
    RAZORPAY_ORDERID: 'subscription/generateOrder?amount=:amount&currency=:currency',

    GET_OTP: 'company/:companyUniqueName/bank/generateotp?urn=:urn',
    GET_REGISTERED_SALES: 'v2/company/:companyUniqueName/sales-register-overview?from=:fromDate&to=:toDate&interval=:interval',
    GET_DETAILED_REGISTERED_SALES: 'v2/company/:companyUniqueName/sales-register-detailed?',

    GET_ALL_TAXES: 'ui/taxes?country=:country',

    GET_REGISTERED_PURCHASE: 'v2/company/:companyUniqueName/purchases-register-overview?from=:fromDate&to=:toDate&interval=:interval',
    GET_DETAILED_REGISTERED_PURCHASE: 'v2/company/:companyUniqueName/purchases-register-detailed?',
    GET_COMPANY_INTEGRATED_BANK_LIST: 'company/:companyUniqueName/payment/banks/accounts',
    BULK_PAYMENT: 'company/:companyUniqueName/bank/payments',
    BULK_PAYMENT_CONFIRM: 'company/:companyUniqueName/bank/payments/confirm?urn=:urn&uniqueName=:uniqueName',
    BULK_PAYMENT_RESEND_OTP: 'company/:companyUniqueName/bank/resend-otp?urn=:urn&uniqueName=:uniqueName&requestId=:requestId',

    CREATE_NEW_BRANCH: 'company/:companyUniqueName/branch',
    GET_ALL_BRANCHES: 'company/:companyUniqueName/branch',
    GET_SIDE_BAR_ITEM: 'company/:companyUniqueName/ui_side_bar_items',
    GET_COMPANY_USER: 'users/:userUniqueName/company-uer?companyUniqueName=:companyUniqueName',
    SEND_NEW_USER_INFO: '/users/send-new-user-info',
};
