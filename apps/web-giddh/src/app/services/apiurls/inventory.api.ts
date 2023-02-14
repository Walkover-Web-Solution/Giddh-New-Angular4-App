const COMMON_USER = 'company/:companyUniqueName/inventory-users';
const COMMON_ENTRY = COMMON_USER + '/:inventoryUserUniqueName/inventory-entries';
const COMMON_TRANSFER_ENTRY = 'inventory-transfer';
const COMMON_V5 = 'v5/company/:companyUniqueName';
export const INVENTORY_API = {
    USER: {
        CREATE: COMMON_USER,
        UPDATE: COMMON_USER + '/:inventoryUserUniqueName',
        GET_ALL: COMMON_USER + '?q=:q&refresh=:refresh&page=:page&count=:count'
    },
    ENTRY: {
        CREATE: COMMON_ENTRY
    },
    TRANSFER_ENTRY: {
        CREATE: COMMON_TRANSFER_ENTRY,
    },
    REPORT: 'company/:companyUniqueName/stock/:stockUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count',
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
    GET_STOCK_MAPPED_UNIT: 'company/:companyUniqueName/stock-unit/mappings', // get call
    MOVE_STOCK: 'company/:companyUniqueName/stock/:stockUniqueName/move', // PUT call
    DOWNLOAD_INVENTORY_GROUP_REPORT: 'company/:companyUniqueName/stock-group/:stockGroupUniquename/download-inventory-report-v2?format=:format&from=:from&to=:to&sortBy=:sortBy&sort=:sort',
    DOWNLOAD_INVENTORY_STOCK_REPORT: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/download-stock-inventory-report-v3?from=:from&to=:to&page=:page&count=:count&format=:format&sortBy=:sortBy&sort=:sort',
    DOWNLOAD_INVENTORY_ALL_GROUP_REPORT: 'v2/company/:companyUniqueName/download-all-inventory-report-v2?format=:format&from=:from&to=:to&sortBy=:sortBy&sort=:sort',
    DOWNLOAD_INVENTORY_HIERARCHICAL_STOCKS_REPORT: 'v2/company/:companyUniqueName/download-all-inventory-hierarchy?from=:from&to=:to&format=:format&sortBy=:sortBy&sort=:sort&page=:page&count=:count',
    DOWNLOAD_INVENTORY_STOCKS_ARRANGED_BY_ACCOUNT_REPORT: 'v2/company/:companyUniqueName/download-inventory-arrangedby-accounts?from=:from&to=:to&format=:format&sort=:sort&sortBy=:sortBy',
    DOWNLOAD_JOBWORK_BY_STOCK: 'company/:companyUniqueName/stock/:stockUniqueName/download-job-work-report/mail-v2?format=:format&from=:from&to=:to&sort=:sort&sortBy=:sortBy',
    DOWNLOAD_JOBWORK_BY_PERSON: 'company/:companyUniqueName/inventory-users/download-job-work-report/mail-v2?format=:format&from=:from&to=:to&sort=:sort&sortBy=:sortBy',
    STOCK_REPORT_V2: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/report-v2?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy&transaction_type=:transactionType', // post for filter rest all get
    GROUP_STOCK_REPORT_V2: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/inventory-report-v2?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy', // post for filter rest all get // it was slow on prod
    GROUP_STOCK_REPORT_V3: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/inventory-report-v3?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy', // post for filter rest all get
    REPORT_V2: 'company/:companyUniqueName/stock/:stockUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy',
    REPORT_ALL_V2: 'company/:companyUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy',
    BRANCH_TRANSFER: {
        TRANSFER: 'inventory-transfer/'
    },
    LINKED_STOCKS: {
        LINKED_STOCKS: 'company/:companyUniqueName/linked-sources'
    },
    UPDATE_DESCRIPTION: 'company/:companyUniqueName/inventory-users/:companyUniqueName/inventory-entries/:uniqueName/description', // patch call to update description
    CREATE_NEW_BRANCH_TRANSFER: 'company/:companyUniqueName/branch-transfer/generate',
    GET_BRANCH_TRANSFER: 'company/:companyUniqueName/branch-transfer/:branchTransferUniqueName',
    GET_BRANCH_TRANSFER_LIST: 'company/:companyUniqueName/branch-transfer/all?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy',
    DELETE_BRANCH_TRANSFER: 'company/:companyUniqueName/branch-transfer/:branchTransferUniqueName',
    UPDATE_BRANCH_TRANSFER: 'company/:companyUniqueName/branch-transfer/:branchTransferUniqueName',
    DOWNLOAD_NEW_BRANCH_TRANSFER: 'company/:companyUniqueName/branch-transfer/download?fileType=base64',
    GET_UNIT_CODE_REGEX: 'ui/forms?formName=:formName&country=:country',
    V5: {
        CREATE_STOCK_GROUP: COMMON_V5 + '/stock-group',
        GET_STOCK_GROUP: COMMON_V5 + '/stock-group/:groupUniqueName',
        UPDATE_STOCK_GROUP: COMMON_V5 + '/stock-group/:groupUniqueName'
    },
    NEW: {
        CREATE: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock',
        GET: 'company/:companyUniqueName/stock/:stockUniqueName',
        UPDATE: 'company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName'
    },

    TRANSACTIONAL_STOCK_REPORT_V2: 'company/:companyUniqueName/inventory/transaction-report?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy&transaction_type=:transactionType', // post for filter rest all get
    TRANSACTIONAL_STOCK_REPORT_BALANCE_V2 :  'company/:companyUniqueName/inventory/balance?from=:from&to=:to', //
};
