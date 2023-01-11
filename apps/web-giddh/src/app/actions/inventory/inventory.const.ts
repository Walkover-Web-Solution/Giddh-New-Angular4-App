export class InventoryActionsConst {
    public static GetGroupsWithStocksHierarchyMin = 'GetGroupsWithStocksHierarchyMin';
    public static GetGroupsWithStocksHierarchyMinResponse = 'GetGroupsWithStocksHierarchyMinResponse';
    public static SetActiveStock = 'SetActiveStock';
    public static InventoryGroupToggleOpen = 'InventoryGroupToggleOpen';

    public static GetInventoryGroup = 'GetInventoryGroup';
    public static GetInventoryGroupResponse = 'GetInventoryGroupResponse';
    public static InventoryStockToggleOpen = 'InventoryStockToggleOpen';

    public static GetInventoryStock = 'GetInventoryStock';
    public static GetInventoryStockResponse = 'GetInventoryStockResponse';

    public static AddNewGroup = 'AddNewGroup';
    public static AddNewGroupResponse = 'AddNewGroupResponse';

    public static CreateStock = 'CreateStock';
    public static CreateStockResponse = 'CreateStockResponse';
    public static ResetCreateStockFlags = 'ResetCreateStockFlags';

    public static UpdateGroup = 'UpdateGroup';
    public static UpdateGroupResponse = 'UpdateGroupResponse';

    public static UpdateStock = 'UpdateStock';
    public static UpdateStockResponse = 'UpdateStockResponse';

    public static ResetActiveGroup = 'ResetGroup';

    public static RemoveGroup = 'RemoveGroup';
    public static RemoveGroupResponse = 'RemoveGroupResponse';

    public static RemoveStock = 'RemoveStock';
    public static RemoveStockResponse = 'RemoveStockResponse';

    public static GetGroupUniqueName = 'GetGroupUniqueName';
    public static GetGroupUniqueNameResponse = 'GetGroupUniqueNameResponse';

    public static GetStockUniqueName = 'GetStockUniqueName';
    public static GetStockUniqueNameResponse = 'GetStockUniqueNameResponse';

    public static ShowLoadingForStockEditInProcess = 'ShowLoadingForStockEditInProcess';
    public static HideLoadingForStockEditInProcess = 'HideLoadingForStockEditInProcess';

    public static GetStock = 'GetStock';
    public static GetStockResponse = 'GetStockResponse';

    public static GetManufacturingStock = 'GetManufacturingStock';
    public static GetManufacturingStockResponse = 'GetManufacturingStockResponse';

    public static GetManufacturingStockForCreate = 'GetManufacturingStockForCreate';
    public static GetManufacturingStockForCreateResponse = 'GetManufacturingStockForCreateResponse';

    public static ResetActiveStock = 'ResetActiveStock';

    public static ResetInventoryState = 'ResetInventoryState';

    public static NewGroupAsidePane = 'NewGroupAsidePane';
    public static NewCustomUnitAsidePane = 'NewCustomUnitAsidePane';

    public static SearchGroupsWithStocks = 'SearchGroupsWithStocks';
    public static SearchGroupsWithStocksResponse = 'SearchGroupsWithStocksResponse';

    public static GetStockWithUniqueName = 'GetStockWithUniqueName';
    public static GetStockWithUniqueNameResponse = 'GetStockWithUniqueNameResponse';

    public static ManageInventoryAside = 'ManageInventoryAside';

    public static ShowBranchScreen = 'ShowBranchScreen';
    public static ShowBranchScreenSideBar = 'ShowBranchScreenSideBar';

    public static MoveStock = 'MoveStock';
    public static MoveStockResponse = 'MoveStockResponse';
}

export const CUSTOM_STOCK_UNIT_ACTIONS = {
    CREATE_STOCK_UNIT: 'CREATE_STOCK_UNIT',
    UPDATE_STOCK_UNIT: 'UPDATE_STOCK_UNIT',
    DELETE_STOCK_UNIT: 'DELETE_STOCK_UNIT',
    GET_STOCK_UNIT: 'GET_STOCK_UNIT',
    GET_STOCK_MAPPED_UNITS: 'GET_STOCK_MAPPED_UNIT',
    GET_STOCK_MAPPED_UNITS_RESPONSE: 'GET_STOCK_MAPPED_UNIT_RESPONSE',
    UPDATE_STOCK_UNIT_RESPONSE: 'UPDATE_STOCK_UNIT_RESPONSE',
    DELETE_STOCK_UNIT_RESPONSE: 'DELETE_STOCK_UNIT_RESPONSE',
    CREATE_STOCK_UNIT_RESPONSE: 'CREATE_STOCK_UNIT_RESPONSE',
    GET_STOCK_UNIT_RESPONSE: 'GET_STOCK_UNIT_RESPONSE',
    GET_STOCK_UNIT_NAME: 'GET_STOCK_UNIT_NAME',
    GET_STOCK_UNIT_NAME_RESPONSE: 'GET_STOCK_UNIT_NAME_RESPONSE',

};

export const STOCKS_REPORT_ACTIONS = {
    GET_STOCKS_REPORT: 'GET_STOCKS_REPORT',
    GET_STOCKS_REPORT_RESPONSE: 'GET_STOCKS_REPORT_RESPONSE',
    GET_GROUP_STOCKS_REPORT: 'GET_GROUP_STOCKS_REPORT',
    GET_GROUP_STOCKS_REPORT_RESPONSE: 'GET_GROUP_STOCKS_REPORT_RESPONSE',
};

export const INVENTORY_USER_ACTIONS = {
    CREATE_USER: 'CREATE_USER',
    CREATE_USER_RESPONSE: 'CREATE_USER_RESPONSE',
    GET_ALL_USERS: 'GET_ALL_USERS',
    GET_ALL_USERS_RESPONSE: 'GET_ALL_USERS_RESPONSE'
};

export const INVENTORY_ENTRY_ACTIONS = {
    CREATE_ENTRY: 'CREATE_ENTRY',
    CREATE_ENTRY_RESPONSE: 'CREATE_ENTRY_RESPONSE',
    CREATE_TRANSFER_ENTRY: 'CREATE_TRANSFER_ENTRY',
    CREATE_TRANSFER_ENTRY_RESPONSE: 'CREATE_TRANSFER_ENTRY_RESPONSE'
};

export const INVENTORY_REPORT_ACTIONS = {
    GENERATE_REPORT: 'GENERATE_REPORT',
    GENERATE_REPORT_RESPONSE: 'GENERATE_REPORT_RESPONSE',
    GET_IN_OUT_REPORT: 'GET_IN_OUT_REPORT',
    GET_IN_OUT_REPORT_RESPONSE: 'GET_IN_OUT_REPORT_RESPONSE'
};

export const INVENTORY_BRANCH_TRANSFER = {
    CREATE_TRANSFER: 'CREATE_TRANSFER',
    CREATE_TRANSFER_RESPONSE: 'CREATE_TRANSFER_RESPONSE',
    RESET_BRANCH_TRANSFER_STATE: 'RESET_BRANCH_TRANSFER_STATE'
};

export const INVENTORY_LINKED_STOCKS = {
    GET_LINKED_STOCKS: 'GET_LINKED_STOCKS',
    GET_LINKED_STOCKS_RESPONSE: 'GET_LINKED_STOCKS_RESPONSE'
};
