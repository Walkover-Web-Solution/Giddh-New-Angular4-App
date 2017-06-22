import { Configuration } from '../../app.constant';

export const ACCOUNTS_API = {
  CREATE: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName:/accounts',
  UPDATE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountName',
  MERGE_ACCOUNT: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/merge',
  UNMERGE_ACCOUNT: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/un-merge',
  MOVE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/move',
  SHARE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/share',
  SHARED_WITH: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/shared-with',
};
