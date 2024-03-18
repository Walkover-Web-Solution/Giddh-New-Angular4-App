export const SUBSCRIPTIONS_API = {
    SUBSCRIBED_COMPANIES: 'users/subscriptions',
    SUBSCRIBED_USER_TRANSACTIONS: 'subscriptions/:subscriptionId/all-transactions?from=:from&to=:to&interval=:interval',
    SUBSCRIBED_COMPANY_TRANSACTIONS: 'subscriptions/company/:company/transactions?from=:from&to=:to&interval=:interval',
    SUBSCRIBED_COMPANIES_LIST: 'subscriptions/:subscriptionId/companies',
};
export const PLAN_API = {
    GET_ALL_PLANS: 'v2/subscription/plans/all?countryCode=:countryCode',
    CREATE_PLAN: 'v2/subscription',
    APPLY_PROMOCODE: 'v2/subscription/promocode'
};

export const SUBSRIPTION_V2_API = {
    GET_ALL_SUBSCRIPTIONS: 'v2/subscription/list',
    SUBSCRIPTION_BY_ID: 'v2/subscription/:subscriptionId',
    CANCEL_SUBSCRIPTION_BY_ID: 'v2/subscription/:subscriptionId/cancel',
    TRANSFER: 'v2/subscription/transfer/ownership?subscriptionId=:subscriptionId',
    VERIFY_OWNERSHIP: 'v2/subscription/verify/ownership?requestId=:requestId',
    GET_BILLING_DETAILS: 'v2/subscription/billing-account/get?billingAccountUnqiueName=:billingAccountUnqiueName',
    UPDATE_BILLING_DETAILS: 'v2/subscription/billing-account/:billingAccountUnqiueName'

};
