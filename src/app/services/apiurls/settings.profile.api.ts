import { Configuration } from '../../app.constant';
const COMMON = Configuration.ApiUrl + 'company/:companyUniqueName';

export const SETTINGS_PROFILE_API = {
  GET: COMMON,
};
