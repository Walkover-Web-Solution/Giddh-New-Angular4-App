import { Configuration } from '../../app.constant';

export const GROUP_API = {
  CREATE: Configuration.ApiUrl + 'company/:companyUniqueName/groups',
  UPDATE_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName',
  SHARE: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/share',
  UNSHARE: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/unshare',
  SHARED_WITH: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/shared-with',
  UPDATE: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName',
  GROUPS_WITH_ACCOUNT: Configuration.ApiUrl + 'company/:companyUniqueName/groups-with-accounts?q=:q',
  GET_SUB_GROUPS: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/subgroups', // model GroupResponse[]  get method
  GET_GROUP_DETAILS: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName', // delete method,
  DELETE_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName', // delete method,
  MOVE_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/move',
  FLATTEN_GROUP_WITH_ACCOUNTS: Configuration.ApiUrl + 'company/:companyUniqueName/flatten-groups-with-accounts?q=:q&page=:page&count=:count&showEmptyGroups=:showEmptyGroups',
  FLATTEN_GROUPS_ACCOUNTS: Configuration.ApiUrl + 'company/:companyUniqueName/groups/flatten-groups-accounts?q=:q&page=:page&count=:count&showEmptyGroups=:showEmptyGroups', // get call
  TAX_HIERARCHY: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/tax-hierarchy', // get call
};
