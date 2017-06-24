import { Configuration } from '../../app.constant';

export const GROUP_API = {
  CREATE: Configuration.ApiUrl + 'company/:companyUniqueName/groups',
  SHARE: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/share',
  SHARED_WITH: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/shared-with',
  UPDATE: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/',
  GROUPS_WITH_ACCOUNT: Configuration.ApiUrl + 'company/:companyUniqueName/groups-with-accounts?q=:q',
  GET_SUB_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/subgroups', // model GroupResponse[]  get method
  GET_GROUP_DETAILS: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName', // delete method,
  DELETE_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName', // delete method,
  MOVE_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/move',
  FLATTEN_GROUP_WITH_ACCOUNTS: Configuration.ApiUrl + 'company/:companyUniqueName/flatten-groups-with-accounts?q=',
  FLATTEN_GROUPS_ACCOUNTS: Configuration.ApiUrl + 'company/:companyUniqueName/groups/flatten-groups-accounts?q=&page=1&count=10&showEmptyGroups=', // get call
  TAX_HIERARCHY: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/tax-hierarchy', // get call
};
