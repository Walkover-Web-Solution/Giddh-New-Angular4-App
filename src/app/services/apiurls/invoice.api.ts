import { Configuration } from '../../app.constant';
let COMMON_URL = Configuration.ApiUrl + 'company/:companyUniqueName/stock/:stockUniqueName/manufacture';
export const INVOICE_API = {
  GET_ALL_INVOICES: Configuration.ApiUrl + 'company/:companyUniqueName/invoices?',
  GET_ALL_LEDGERS_FOR_INVOICE: Configuration.ApiUrl + 'company/:companyUniqueName/ledgers?',
};
