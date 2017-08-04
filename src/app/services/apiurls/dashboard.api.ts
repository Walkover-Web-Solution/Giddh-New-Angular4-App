import { Configuration } from '../../app.constant';

export const DASHBOARD_API = {
  DASHBOARD: Configuration.ApiUrl + 'company/:companyUniqueName/dashboard?from=:from&to=:to&interval=:interval&refresh=:refresh', // get call
  GROUP_HISTORY: Configuration.ApiUrl + 'company/:companyUniqueName/group-history?from=:from&to=:to&interval=:interval&refresh=:refresh', // post call
  CLOSING_BALANCE: Configuration.ApiUrl + '/company/:companyUniqueName/groups/:groupUniqueName/closing-balance?fromDate=:fromDate&toDate=:toDate&refresh=:refresh', // get call
  BANK_ACCOUNTS: Configuration.ApiUrl + '/company/:companyUniqueName/ebanks', // Get call
  REFRESH_BANK_ACCOUNT: Configuration.ApiUrl + '/company/:companyUniqueName/login/:loginId/token/refresh', // get call
  RECONNECT_BANK_ACCOUNT: Configuration.ApiUrl + '/company/:companyUniqueName/login/:loginId/token/reconnect',
};
