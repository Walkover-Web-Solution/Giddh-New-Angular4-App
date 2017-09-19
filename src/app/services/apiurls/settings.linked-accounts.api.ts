import { Configuration } from '../../app.constant';

export const SETTINGS_LINKED_ACCOUNTS_API = {
  BANK_ACCOUNTS: Configuration.ApiUrl + 'company/:companyUniqueName/ebanks',
  REMOVE_ACCOUNT: Configuration.ApiUrl + 'company/:companyUniqueName/login/:loginId',
};
