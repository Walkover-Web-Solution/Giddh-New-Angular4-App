import { Configuration } from '../../app.constant';
let COMMON_URL = Configuration.ApiUrl + 'company/:companyUniqueName/';
export const EBANKS = {
  GET_TOKEN: COMMON_URL + 'ebanks/token',
  GET_ALL_ACCOUNTS: COMMON_URL + 'ebanks',
  UNLINK_ACCOUNT: COMMON_URL + 'ebanks/:accountId/unlink'
};
