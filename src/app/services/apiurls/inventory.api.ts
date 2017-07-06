import { Configuration } from '../../app.constant';

export const INVENTORY_API = {
  CREATE_STOCK_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group', // post call
  UPDATE_STOCK_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/:stockGroupUniquename', // put call
  DELETE_STOCK_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/:stockGroupUniqueName', // DELETE call
  STOCKS: Configuration.ApiUrl + 'company/:companyUniqueName/stocks', // get call
  GROUPS_STOCKS: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/:stockGroupUniqueName', // get call
  GROUPS_WITH_STOCKS_FLATTEN: Configuration.ApiUrl + 'company/:companyUniqueName/flatten-stock-groups-with-stocks?count=:count&page=:page&q=:q', // get call
  GROUPS_WITH_STOCKS_HIERARCHY: Configuration.ApiUrl + 'company/:companyUniqueName/hierarchical-stock-groups?q=:q&page=:page&count=:count', // get call
  STOCK_UNIT: Configuration.ApiUrl + 'company/:companyUniqueName/stock-unit', // get call
  STOCK_REPORT: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/report-v2?from=:from&to=:to&count=:count&page=:page', // get call
  STOCK_DETAIL: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName', // get call
  CREATE_STOCK: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock', // post call
  CREATE_STOCK_UNIT: Configuration.ApiUrl + 'company/:companyUniqueName/stock-unit', // post call
  DELETE_STOCK: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName', // DELETE call
  DELETE_STOCK_UNIT: Configuration.ApiUrl + 'company/:companyUniqueName/stock-unit/:uName', // DELETE call
  UPDATE_STOCK: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName', // PUT call
  UPDATE_STOCK_UNIT: Configuration.ApiUrl + 'company/:companyUniqueName/stock-unit/:uName', // PUT call
};
