
import { Configuration } from '../../app.constant';

export const COMPANY_API = {
  GET_STATE_DETAILS: Configuration.ApiUrl + 'state-details',
  SET_STATE_DETAILS: Configuration.ApiUrl + 'state-details',
  COMPANY_LIST: Configuration.ApiUrl + 'users/:uniqueName/companies',
  CREATE_COMPANY: Configuration.ApiUrl + 'company',
  DELETE_COMPANY: Configuration.ApiUrl + 'company/:uniqueName',
};
