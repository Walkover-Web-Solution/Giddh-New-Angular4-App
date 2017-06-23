import { Configuration } from '../../app.constant';

export const GROUP_API = {
  CREATE: Configuration.ApiUrl + 'company/:companyUniqueName/groups',
  SHARE: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/share',
  SHARED_WITH: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/shared-with',
  UPDATE: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/',
  GROUPS_WITH_ACCOUNT: Configuration.ApiUrl + 'company/:companyUniqueName/groups-with-accounts?q=:q',
  GET_SUB_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/subgroups', // model GroupResponse[]  get method
  DELETE_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName', // delete method,
  MOVA_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/move'
};
