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
