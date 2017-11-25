import { Configuration } from '../../app.constant';
const COMMON_URL_FOR_ACCOUNT = Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName';
const COMMON_URL_FOR_ACCOUNT_V2 = Configuration.ApiUrl + 'v2/company/:companyUniqueName/accounts/:accountUniqueName';

export const ACCOUNTS_API_V2 = {
  GET: COMMON_URL_FOR_ACCOUNT_V2,
  UPDATE: Configuration.ApiUrl + 'v2/company/:companyUniqueName/groups/:groupUniqueName/accounts/:accountUniqueName',
  CREATE: Configuration.ApiUrl + 'v2/company/:companyUniqueName/groups/:groupUniqueName/accounts'
};

export const ACCOUNTS_API = {
  CREATE: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/accounts',
  UPDATE: COMMON_URL_FOR_ACCOUNT,
  DETAILS: COMMON_URL_FOR_ACCOUNT,
  DELETE: COMMON_URL_FOR_ACCOUNT, // delete method,
  MERGE: COMMON_URL_FOR_ACCOUNT + '/merge',
  UNMERGE: COMMON_URL_FOR_ACCOUNT + '/un-merge',
  MOVE: COMMON_URL_FOR_ACCOUNT + '/move',
  // SHARE: COMMON_URL_FOR_ACCOUNT + '/share',
  SHARE: Configuration.ApiUrl + 'company/:companyUniqueName/role/:roleUniqueName/assign',
  UN_SHARE: Configuration.ApiUrl + 'company/:companyUniqueName/role/:roleUniqueName/revoke',
  // UNSHARE: COMMON_URL_FOR_ACCOUNT + '/unshare',
  SHARED_WITH: COMMON_URL_FOR_ACCOUNT + '/shared-with',
  TAX_HIERARCHY: COMMON_URL_FOR_ACCOUNT + '/tax-hierarchy', // get call
  FLATTEN_ACCOUNTS: Configuration.ApiUrl + 'company/:companyUniqueName/flatten-accounts?q=:q&page=:page&count=:count', // get call
  FLATTEN_ACCOUNTS_OF_GROUPS: Configuration.ApiUrl + 'company/:companyUniqueName/flatten-accounts?count=:count&page=:page&q=:q'
};
