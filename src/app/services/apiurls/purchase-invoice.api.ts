import { Configuration } from '../../app.constant';
const COMMON = Configuration.ApiUrl + 'company/:companyUniqueName/';

export const PURCHASE_INVOICE_API = {
  INVOICE_API: COMMON + 'invoice/purchase',  // GET AND PUT call
  // INVOICE_API: 'http://apidev.giddh.com/company/yahooindore15045261031030rz5qk/invoice/purchase'
};
