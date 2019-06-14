const COMMON_USER = 'company/:companyUniqueName/inventory-users';
const COMMON_ENTRY = COMMON_USER + '/:inventoryUserUniqueName/inventory-entries';
const COMMON_TRANSFER_ENTRY= 'inventory-transfer';
export const INVENTORY_API = {
  USER: {
    CREATE: COMMON_USER,
    UPDATE: COMMON_USER + '/:inventoryUserUniqueName',
    GET: COMMON_USER + '/:inventoryUserUniqueName',
    DELETE: COMMON_USER + '/:inventoryUserUniqueName',
    GET_ALL: COMMON_USER + '?q=:q&refresh=:refresh&page=:page&count=:count'
  },
  ENTRY: {
    CREATE: COMMON_ENTRY,
    UPDATE: COMMON_ENTRY + '/:inventoryEntryUniqueName',
    GET: COMMON_ENTRY + '/:inventoryEntryUniqueName',
    DELETE: COMMON_ENTRY + '/:inventoryEntryUniqueName',
  },
  TRANSFER_ENTRY: {
    CREATE: COMMON_TRANSFER_ENTRY,
  },
  REPORT: 'company/:companyUniqueName/stock/:stockUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count',
  REPORT_ALL: 'company/:companyUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count',

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
  GET_STOCK_WITH_UNIQUENAME: 'company/:companyUniqueName/stock/:stockUniqueName', // GET call
  GET_STOCK_UNIT_WITH_NAME: 'company/:companyUniqueName/stock-unit/:uName', // GET call
  MOVE_STOCK: 'company/:companyUniqueName/stock/:stockUniqueName/move', // PUT call
  DOWNLOAD_INVENTORY_GROUP_REPORT: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/download-report',
  DOWNLOAD_INVENTORY_STOCK_REPORT: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/download-report-v2?from=:from&to=:to',
  STOCK_REPORT_V2: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/report-v2?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy&transaction_type=:transactionType', // post for filter rest all get
  GROUP_STOCK_REPORT_V2: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/inventory-report-v2?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy', // post for filter rest all get
  REPORT_V2: 'company/:companyUniqueName/stock/:stockUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy',
  REPORT_ALL_V2: 'company/:companyUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy',

  BRANCH_TRANSFER: {
    TRANSFER: 'inventory-transfer/'
  },
  LINKED_STOCKS: {
    LINKED_STOCKS: 'company/:companyUniqueName/linked-sources'
  },
  UPDATE_DESCRIPTION: 'company/:companyUniqueName/inventory-users/:companyUniqueName/inventory-entries/:uniqueName/description' // patch call to update description
};
