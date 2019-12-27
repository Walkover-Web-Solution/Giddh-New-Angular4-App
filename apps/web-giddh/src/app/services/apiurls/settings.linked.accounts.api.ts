let COMMON_URL = 'company/:companyUniqueName/';
export const EBANKS = {
    GET_TOKEN: COMMON_URL + 'ebanks/token', // GET
    GET_ALL_ACCOUNTS: COMMON_URL + 'ebanks', // GET
    LINK_ACCOUNT: COMMON_URL + 'yodlee/ebanks/:accountId', // PUT
    // UNLINK_ACCOUNT: COMMON_URL + 'ebanks/:accountId/unlink',
    UNLINK_ACCOUNT: COMMON_URL + 'yodlee/ebanks/:accountId?accountUniqueName=:accountUniqueName',
    REFRESH_ACCOUNTS: COMMON_URL + 'ebanks/refresh', // GET
    RECONNECT_ACCOUNT: COMMON_URL + 'login/:loginId/token/reconnect', // GET
    // DELETE_BANK_ACCOUNT: COMMON_URL + 'login/:loginId', // DELETE
    DELETE_BANK_ACCOUNT: COMMON_URL + 'yodlee/yodlee-accounts?',
    // REFREST_ACCOUNT: COMMON_URL + 'login/:loginId/token/refresh', // GET (OLD)
    REFREST_ACCOUNT: COMMON_URL + 'yodlee/refresh/:ebankItemId', // GET (NEW)
    ADD_GIDDH_ACCOUNT: COMMON_URL + 'yodlee/ebanks/:itemAccountId', // PUT
    REMOVE_GIDDH_ACCOUNT: COMMON_URL + 'yodlee/ebanks/:ItemAccountId/unlink', // DELETE
    UPDATE_DATE: COMMON_URL + 'yodlee/:accountId/eledgers?from=:date', // PUT
};

export const YODLEE_FASTLINK = {
    ACCESS_TOKEN: COMMON_URL + 'yodlee/access-token',
    GET_ACCOUNTS: COMMON_URL + 'yodlee/yodlee-accounts',
    SEARCH_BANKS: COMMON_URL + 'yodlee/search?name=:queryString',
    GET_LOGIN_FORM: COMMON_URL + 'yodlee/login-form/:providerId',
    ADD_PROVIDER: COMMON_URL + 'yodlee/add-provider-account?providerId=:providerId',
    GET_BANK_SYNC_STATUS: COMMON_URL + 'yodlee/status/:providerId',
};
