import { Configuration } from '../../app.constant';

export const GROUP_API = {
  CREATE: Configuration.ApiUrl + 'company/:companyUniqueName/groups',
  SHARE: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/share',
  SHARED_WITH: Configuration.ApiUrl + 'company/:companyUniqueName/groups/:groupUniqueName/shared-with',
};
