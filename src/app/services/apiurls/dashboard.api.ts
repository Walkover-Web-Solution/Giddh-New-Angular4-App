import { Configuration } from '../../app.constant';

export const DASHBOARD_API = {
  DASHBOARD: Configuration.ApiUrl + 'company/:companyUniqueName/dashboard?fromDate=:fromDate&toDate=:toDate&interval=:interval&refresh=refresh', // get call
};
