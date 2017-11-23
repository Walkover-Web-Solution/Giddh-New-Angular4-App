import { Configuration } from '../../app.constant';
let COMMON_URL = Configuration.ApiUrl + 'company/:companyUniqueName/role';

export const PERMISSION_API = {
  GET_ROLE: COMMON_URL,
  CREATE_ROLE: COMMON_URL,
  DELETE_ROLE: COMMON_URL + '/:roleUniqueName',
  UPDATE_ROLE: COMMON_URL + '/:roleUniqueName',
  GET_ALL_PAGE_NAMES: Configuration.ApiUrl + 'scope-v2',
  SHARE_COMPANY: Configuration.ApiUrl + 'company/:companyUniqueName/share',
  UN_SHARE_COMPANY: Configuration.ApiUrl + 'company/:companyUniqueName/unshare',
  COMPANY_SHARED_WITH: Configuration.ApiUrl + 'company/:companyUniqueName/shared-with',
};
