import { Configuration } from '../../app.constant';
const COMMON = Configuration.ApiUrl + 'company/:companyUniqueName';

export const SETTINGS_PERMISSION_API = {
  GET: COMMON + '/shared-with',
};
