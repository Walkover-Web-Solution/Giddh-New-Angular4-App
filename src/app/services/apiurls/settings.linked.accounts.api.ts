
let COMMON_URL = 'company/:companyUniqueName/';
export const EBANKS = {
  GET_TOKEN: COMMON_URL + 'ebanks/token', // GET
  GET_ALL_ACCOUNTS: COMMON_URL + 'ebanks', // GET
  LINK_ACCOUNT: COMMON_URL + 'ebanks/:accountId', // PUT
  UNLINK_ACCOUNT: COMMON_URL + 'ebanks/:accountId/unlink',
  REFRESH_ACCOUNTS:  COMMON_URL + 'ebanks/refresh', // GET
  RECONNECT_ACCOUNT: COMMON_URL + 'login/:loginId/token/reconnect', // GET
  DELETE_BANK_ACCOUNT: COMMON_URL + 'login/:loginId', // DELETE
  REFREST_ACCOUNT: COMMON_URL + 'login/:loginId/token/refresh', // GET
  ADD_GIDDH_ACCOUNT: COMMON_URL + '/ebanks/:itemAccountId', // PUT
  REMOVE_GIDDH_ACCOUNT: COMMON_URL + 'ebanks/:ItemAccountId/unlink', // DELETE
  UPDATE_DATE: COMMON_URL + 'ebanks/:accountId/eledgers?from=:date', // PUT
};

export const YODLEE_FASTLINK = {
  ACCESS_TOKEN: COMMON_URL + 'yodlee/access-token',
  GET_ACCOUNTS: COMMON_URL + 'yodlee/yodlee-accounts',
};
