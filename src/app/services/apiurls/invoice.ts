import { Configuration } from '../../app.constant';

export const INVOICE_API = {
  // GET_USER_TEMPLATES: Configuration.ApiUrl + 'templates-v2/sample-templates',
  GET_USER_TEMPLATES: Configuration.ApiUrl + 'v2/sample-templates',
  // CREATE_NEW_TEMPLATE: Configuration.ApiUrl + 'company/:companyUniqueName/templates-v2', // POST
  CREATE_NEW_TEMPLATE: Configuration.ApiUrl + 'v2/company/:companyUniqueName/templates', // POST
  UPDATE_TEMPLATE: Configuration.ApiUrl + 'v2/company/:companyUniqueName/templates', // PUT
  // GET_CREATED_TEMPLATES: Configuration.ApiUrl + 'company/:companyUniqueName/templates-v2', // GET
  GET_CREATED_TEMPLATES: Configuration.ApiUrl + 'v2/company/:companyUniqueName/templates', // GET
  // GET_CUSTOM_TEMPLATE: Configuration.ApiUrl + 'company/:companyUniqueName/templates-v2/:templateUniqueName', // GET
  GET_CUSTOM_TEMPLATE: Configuration.ApiUrl + 'v2/company/:companyUniqueName/templates/:templateUniqueName', // GET
  // SET_AS_DEFAULT: Configuration.ApiUrl + 'company/:companyUniqueName/templates-v2/:templateUniqueName/default', // PATCH
  SET_AS_DEFAULT: Configuration.ApiUrl + 'v2/company/:companyUniqueName/templates/:templateUniqueName/default', // PATCH
  // DELETE_TEMPLATE: Configuration.ApiUrl + 'company/:companyUniqueName/templates-v2/:templateUniqueName', // DELETE
  DELETE_TEMPLATE: Configuration.ApiUrl + 'v2/company/:companyUniqueName/templates/:templateUniqueName', // DELETE
};
