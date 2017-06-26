import { Configuration } from '../../app.constant';

export const INVENTORY_API = {
  CREATE_STOCK_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group', // post call
  UPDATE_STOCK_GROUP: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group', // put call
  STOCKS: Configuration.ApiUrl + 'company/:companyUniqueName/stock-group/stocks', // get call
};
