import { Configuration } from '../../app.constant';
let COMMON_URL = Configuration.ApiUrl + 'company/:companyUniqueName/role';
export const PERMISSION_API = {
  GET_ROLE: COMMON_URL,
  CREATE_ROLE: COMMON_URL,
  DELETE_ROLE: COMMON_URL + '/:roleUniqueName',
  UPDATE_ROLE: COMMON_URL + '/:roleUniqueName',
  GET_ALL_PAGE_NAMES: Configuration.ApiUrl + 'scope-v2',
  GET_ALL_PERMISSIONS: Configuration.ApiUrl + 'permission-v2',
};
