export const SUBSCRIPTIONS_API = {
    SUBSCRIBED_COMPANIES: 'users/subscriptions',
    SUBSCRIBED_USER_TRANSACTIONS: 'subscriptions/:subscriptionId/all-transactions?from=:from&to=:to&interval=:interval',
    SUBSCRIBED_COMPANY_TRANSACTIONS: 'subscriptions/company/:company/transactions?from=:from&to=:to&interval=:interval',
    SUBSCRIBED_COMPANIES_LIST: 'subscriptions/:subscriptionId/companies',
};

export const SUBSCRIPTION_V2_API = {
    GET_ALL_PLANS: 'v2/subscription/plans/all?countryCode=:countryCode&region=:region',
    GET_COUNTRY_LIST: 'country/country-list',
    CREATE_SUBSCRIPTION: 'v2/subscription',
    UPDATE_SUBSCRIPTION: 'v2/subscription?company=:company',
    APPLY_PROMOCODE: 'v2/subscription/promocode',
    GET_ALL_SUBSCRIPTIONS: 'v2/subscription/list?page=:page&count=:count',
    SUBSCRIPTION_BY_ID: 'v2/subscription/:subscriptionId',
    CANCEL_SUBSCRIPTION_BY_ID: 'v2/subscription/:subscriptionId/cancel',
    TRANSFER: 'v2/subscription/transfer/ownership?subscriptionId=:subscriptionId',
    VERIFY_OWNERSHIP: 'v2/subscription/verify/ownership?requestId=:requestId',
    GET_BILLING_DETAILS: 'v2/subscription/billing-account/get?billingAccountUnqiueName=:billingAccountUnqiueName',
    UPDATE_BILLING_DETAILS: 'v2/subscription/billing-account/:billingAccountUnqiueName',
    GET_COMPANIES_LIST_BY_SUBSCRIPTION_ID: 'v2/subscription/company-list/:subscriptionId?sort=:sort&sortBy=:sortBy&page=:page&count=:count&q=:query',
    GENERATE_ORDER_BY_SUBSCRIPTION_ID: 'v2/subscription/:subscriptionId/generate-order',
    GET_CHANGE_PLAN_DETAILS: 'v2/subscription/change-plan',
    UPDATE_PLAN: 'v2/subscription/update'
};
