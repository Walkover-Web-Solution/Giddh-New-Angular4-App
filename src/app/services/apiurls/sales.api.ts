import { Configuration } from '../../app.constant';
let URL = Configuration.ApiUrl + 'v2/company/:companyUniqueName/accounts/:accountUniqueName/';

export const SALES_API_V2 = {
  GENERATE_SALES: URL + 'invoices/generate-sales?updateAccount=:updateAccount',
};
