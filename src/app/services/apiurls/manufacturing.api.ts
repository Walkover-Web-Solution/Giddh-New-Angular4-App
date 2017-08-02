import { Configuration } from '../../app.constant';
let COMMON_URL = Configuration.ApiUrl + '/company/:companyUniqueName/stock/:stockUniqueName/manufacture';
export const MANUFACTURING_API = {
  GET: COMMON_URL + '/:manufacturingUniqueName',
  CREATE: COMMON_URL,
  UPDATE: COMMON_URL + '/:manufacturingUniqueName',
  DELETE: COMMON_URL + '/:manufacturingUniqueName',
  MF_REPORT: Configuration.ApiUrl + 'company/:companyUniqueName/stock/manufacture-report?page=:page&count=:count&product=:product&searchOperation=:searchOperation&searchBy=:searchBy&searchValue=:searchValue&from=:from&to=:to',
  GET_STOCK_WITH_RATE: Configuration.ApiUrl + 'company/:companyUniqueName/stock/:stockUniqueName/link-with-rates'
};
