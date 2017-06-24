import { Configuration } from '../../app.constant';

export const LEDGER_API = {
  CREATE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers', // post call
};
