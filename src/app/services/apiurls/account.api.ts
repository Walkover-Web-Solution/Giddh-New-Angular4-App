import { Configuration } from '../../app.constant';

export const ACCOUNTS_API = {
  CREATE: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName:/accounts',
  UPDATE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountName',
  DETAILS: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName',
  MERGE_ACCOUNT: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/merge',
  UNMERGE_ACCOUNT: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/un-merge',
  MOVE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/move',
  SHARE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/share',
  SHARED_WITH: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/shared-with',
  FLATTEN_ACCOUNTS: Configuration.ApiUrl + 'company/:companyUniqueName/flatten-accounts?q=:q&refresh=:refresh', // get call
  TAX_HIERARCHY: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/tax-hierarchy', // get call
};
