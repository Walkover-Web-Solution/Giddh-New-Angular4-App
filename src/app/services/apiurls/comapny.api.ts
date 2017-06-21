
import { Configuration } from '../../app.constant';

export const COMPANY_API = {
  COMPANY_LIST: Configuration.ApiUrl + 'users/:uniqueName/companies',
  CREATE_COMPANY: Configuration.ApiUrl + 'company',
  DELETE_COMPANY: Configuration.ApiUrl + 'company',
};
