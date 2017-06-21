import { Configuration } from '../../app.constant';

export const ACCOUNTS_API = {
  CREATE: Configuration.ApiUrl + 'company/companyUniqueName/groups/:groupUniqueName:/accounts',
  UPDATE: Configuration.ApiUrl + 'company/companyUniqueName/accounts/account_name',
  MERGE_ACCOUNT: Configuration.ApiUrl + 'company/{companyUniqueName}/accounts/{accountUniqueName}/merge',
  UNMERGE_ACCOUNT: Configuration.ApiUrl + 'company/{companyUniqueName}/accounts/{accountUniqueName}/un-merge',
};
