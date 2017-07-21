import { Configuration } from '../../app.constant';

export const DASHBOARD_API = {
  DASHBOARD: Configuration.ApiUrl + 'company/:companyUniqueName/dashboard?from=:from&to=:to&interval=:interval&refresh=refresh', // get call
  GROUP_HISTORY: Configuration.ApiUrl + 'company/:companyUniqueName/group-history?from=:from&to=:to&interval=:interval&refresh=refresh', // post call
};
