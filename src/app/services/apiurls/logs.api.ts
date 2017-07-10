import { Configuration } from '../../app.constant';

export const LOGS_API = {
  AUDIT_LOGS: Configuration.ApiUrl + 'company/:companyUniqueName/logs?page=:page', // post call
};
