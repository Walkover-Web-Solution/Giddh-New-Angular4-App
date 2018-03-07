
export const INVENTORY_API = {
  CREATE_STOCK_GROUP: 'company/:companyUniqueName/stock-group', // post call
  UPDATE_STOCK_GROUP: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName', // put call
  DELETE_STOCK_GROUP: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName', // DELETE call
  STOCKS: 'company/:companyUniqueName/stocks', // get call
  MANUFACTURING_STOCKS: 'company/:companyUniqueName/stocks-manufacture', // get call
  CREATE_NEW_MANUFACTURING_STOCKS: 'company/:companyUniqueName/stocks?isManufactured=true', // get call
  GROUPS_STOCKS: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName', // get call
  GROUPS_WITH_STOCKS_FLATTEN: 'company/:companyUniqueName/flatten-stock-groups-with-stocks?count=:count&page=:page&q=:q', // get call
  GROUPS_WITH_STOCKS: 'company/:companyUniqueName/hierarchical-stock-groups', // get call
  GROUPS_WITH_STOCKS_HIERARCHY: 'company/:companyUniqueName/hierarchical-stock-groups?q=:q&page=:page&count=:count', // get call
  STOCK_UNIT: 'company/:companyUniqueName/stock-unit', // get call
  STOCK_REPORT: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/report-v2?from=:from&to=:to&count=:count&page=:page', // get call
  GROUP_STOCK_REPORT: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/report?from=:from&to=:to&entity=:entity&value=:value&condition=:condition&number=:number&stock=:stock&count=:count&page=:page', // get call
  STOCK_DETAIL: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName', // get call
  CREATE_STOCK: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock', // post call
  CREATE_STOCK_UNIT: 'company/:companyUniqueName/stock-unit', // post call
  DELETE_STOCK: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName', // DELETE call
  DELETE_STOCK_UNIT: 'company/:companyUniqueName/stock-unit/:uName', // DELETE call
  UPDATE_STOCK: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName', // PUT call
  UPDATE_STOCK_UNIT: 'company/:companyUniqueName/stock-unit/:uName', // PUT call
  GET_RATE_FOR_STOCK: 'company/:companyUniqueName/stock/:stockUniqueName/rate-for-stock', // Get call
  GET_STOCK_WITH_UNIQUENAME: 'company/:companyUniqueName/stock/:stockUniqueName' // GET call
};
