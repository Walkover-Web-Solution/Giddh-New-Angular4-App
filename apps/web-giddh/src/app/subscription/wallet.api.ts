export const WALLET_API = {
    GET_SUBSCRIPTION_DATA: `v2/subscription/:subscriptionId`,
    GET_WALLET_DETAILS: `v2/subscription/:subscriptionId/wallet`,
    ADD_WALLET_AMOUNT: `v2/subscription/add-wallet-amount`,
    CAPTURE_WALLET_PAYMENT: `v2/subscription/:subscriptionId/capture-wallet-payment`,
    GET_WALLET_LOGS: `v2/subscription/:subscriptionId/wallet-logs?page=:page&count=:count`
};
