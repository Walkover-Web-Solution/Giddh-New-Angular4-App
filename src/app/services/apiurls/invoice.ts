import { Configuration } from '../../app.constant';

export const INVOICE_API = {
  GET_USER_TEMPLATES: Configuration.ApiUrl + 'templates-v2/sample-templates',
  CREATE_NEW_TEMPLATE: Configuration.ApiUrl + 'company/:companyUniqueName/templates-v2', // POST
  GET_CREATED_TEMPLATES: Configuration.ApiUrl + 'company/:companyUniqueName/templates-v2', // GET
  SET_AS_DEFAULT: Configuration.ApiUrl + 'company/:companyUniqueName/templates-v2/:templateUniqueName/default', // PATCH
};
