import { Configuration } from '../../app.constant';
const COMMON = Configuration.ApiUrl + 'company/:companyUniqueName/';

export const SETTINGS_INTEGRATION_API = {
  SMS: COMMON + 'sms-key', // GET or POST call
  EMAIL: COMMON + 'email-key', // GET or POST call
};
