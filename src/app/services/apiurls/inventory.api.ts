import { Configuration } from '../../app.constant';

export const INVENTORY_API = {
  CREATE_STOCK_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group', // post call
  UPDATE_STOCK_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group', // put call
  DELETE_STOCK_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/:stockGroupUniqueName', // DELETE call
  STOCKS: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/stocks', // get call
  GROUPS_WITH_STOCKS_FLATTEN: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/groups-with-stocks-flatten?count=&page=1&q=', // get call
  GROUPS_WITH_STOCKS_HIERARCHY_MIN: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/groups-with-stocks-hierarchy-min', // get call
  STOCK_UNIT: Configuration.ApiUrl + 'company/:companyUniqueName/stock-unit', // get call
};
