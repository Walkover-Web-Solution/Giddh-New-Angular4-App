import { GroupsWithStocksHierarchyMin } from '../../models/api-models/GroupsWithStocks';
import { CreateStockRequest, GroupStockReportResponse, INameUniqueName, StockDetailResponse, StockGroupRequest, StockGroupResponse, StockMappedUnitResponse, StockReportResponse, StocksResponse, StockUnitRequest } from '../../models/api-models/Inventory';
import { IGroupsWithStocksHierarchyMinItem } from '../../models/interfaces/groups-with-stocks.interface';
import { CUSTOM_STOCK_UNIT_ACTIONS, InventoryActionsConst, STOCKS_REPORT_ACTIONS } from '../../actions/inventory/inventory.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CustomActions } from '../custom-actions';
import { COMMON_ACTIONS } from '../../actions/common.const';

/**
 * Keeping Track of the CompanyState
 */
export interface InventoryState {
    groupsWithStocks?: IGroupsWithStocksHierarchyMinItem[];
    stocksList: StocksResponse;
    manufacturingStockList: StocksResponse;
    manufacturingStockListForCreateMF: StocksResponse;
    stockUnits?: StockUnitRequest[];
    stockMappedUnits?: StockMappedUnitResponse[];
    stockMappedUnitsWithCode?: StockMappedUnitResponse[];
    activeGroup?: StockGroupResponse;
    activeGroupUniqueName?: string;
    activeStock?: StockDetailResponse;
    activeStockUniqueName?: string;
    fetchingGrpUniqueName: boolean;
    isGroupNameAvailable: boolean;
    fetchingStockUniqueName: boolean;
    isStockNameAvailable: boolean;
    createGroupSuccess: boolean;
    createStockSuccess: boolean;
    stockReport?: StockReportResponse;
    groupStockReportInProcess: boolean;
    stockReportInProcess: boolean;
    groupStockReport?: GroupStockReportResponse;
    isStockAddInProcess: boolean;
    isStockUpdateInProcess: boolean;
    isStockDeleteInProcess: boolean;
    showLoadingForStockEditInProcess: boolean;
    isAddNewGroupInProcess: boolean;
    isUpdateGroupInProcess: boolean;
    isDeleteGroupInProcess: boolean;
    createCustomStockInProcess: boolean;
    updateCustomStockInProcess: boolean;
    updateCustomStockSuccess: boolean;
    deleteCustomStockInProcessCode: any[];
    deleteCustomStockSuccess: boolean;
    createCustomStockSuccess: boolean;
    showNewGroupAsidePane: boolean;
    showNewCustomUnitAsidePane: boolean;
    inventoryAsideState: {
        isOpen: boolean,
        isGroup: boolean,
        isUpdate: boolean,
    };
    deleteStockSuccess: boolean;
    deleteGroupSuccess: boolean;
    UpdateGroupSuccess: boolean;
    UpdateStockSuccess: boolean;
    showBranchScreen: boolean;
    showBranchScreenSidebar: boolean;
    isStockUnitCodeAvailable: boolean;
    moveStockSuccess: boolean;
    isGetManufactureStockInProgress: boolean;
    getStocksInProgress: boolean;
    stocksTotalPages: number;
}

const prepare = (mockData: IGroupsWithStocksHierarchyMinItem[]): IGroupsWithStocksHierarchyMinItem[] => {
    return mockData.map((m: IGroupsWithStocksHierarchyMinItem) => {
        m = Object.assign({}, m, {
            isActive: false,
            isOpen: false,
            stocks: []
        });
        m.childStockGroups = prepare(m.childStockGroups);
        return m;
    });
};

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState: InventoryState = {
    groupsWithStocks: [],
    stocksList: null,
    manufacturingStockList: null,
    manufacturingStockListForCreateMF: null,
    stockUnits: [],
    stockMappedUnits: [],
    stockMappedUnitsWithCode: [],
    activeGroup: null,
    fetchingGrpUniqueName: false,
    isGroupNameAvailable: false,
    fetchingStockUniqueName: false,
    isStockNameAvailable: false,
    createGroupSuccess: false,
    createStockSuccess: false,
    isStockAddInProcess: false,
    isStockUpdateInProcess: false,
    isStockDeleteInProcess: false,
    showLoadingForStockEditInProcess: false,
    isAddNewGroupInProcess: false,
    isUpdateGroupInProcess: false,
    isDeleteGroupInProcess: false,
    createCustomStockInProcess: false,
    updateCustomStockInProcess: false,
    updateCustomStockSuccess:false,
    deleteCustomStockInProcessCode: [],
    activeGroupUniqueName: '',
    activeStock: null,
    activeStockUniqueName: '',
    stockReport: null,
    groupStockReportInProcess: false,
    stockReportInProcess: false,
    groupStockReport: null,
    createCustomStockSuccess: false,
    deleteCustomStockSuccess: false,
    showNewGroupAsidePane: false,
    showNewCustomUnitAsidePane: false,
    inventoryAsideState: {
        isOpen: false,
        isGroup: false,
        isUpdate: false,
    },
    deleteStockSuccess: false,
    deleteGroupSuccess: false,
    UpdateGroupSuccess: false,
    UpdateStockSuccess: false,
    showBranchScreen: false,
    showBranchScreenSidebar: false,
    isStockUnitCodeAvailable: false,
    moveStockSuccess: false,
    isGetManufactureStockInProgress: false,
    getStocksInProgress: false,
    stocksTotalPages: 0
};

export function InventoryReducer(state: InventoryState = initialState, action: CustomActions): InventoryState {
    let groupUniqueName = '';
    let groupArray: IGroupsWithStocksHierarchyMinItem[] = [];
    let group: StockGroupResponse = null;
    let activeGroupData: IGroupsWithStocksHierarchyMinItem;
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case InventoryActionsConst.SetActiveStock:
            return Object.assign({}, state, { activeStockUniqueName: action.payload });
        case InventoryActionsConst.GetGroupsWithStocksHierarchyMin: {
            return Object.assign({}, state, { getStocksInProgress: true });
        }
        case InventoryActionsConst.GetGroupsWithStocksHierarchyMinResponse:
            if ((action.payload as BaseResponse<GroupsWithStocksHierarchyMin, string>)?.status === 'success') {
                groupArray = prepare((action.payload as BaseResponse<GroupsWithStocksHierarchyMin, string>).body?.results);
                if (state.activeGroup) {
                    groupUniqueName = state.activeGroup.uniqueName;

                    if (groupUniqueName && groupArray) {
                        for (let el of groupArray) {
                            activeGroupData = setRecursivlyActive(el.childStockGroups ? el.childStockGroups : [], groupUniqueName, null);
                            if (activeGroupData) {
                                el.isOpen = true;
                                el.isActive = false;
                            } else {
                                if (groupUniqueName === el?.uniqueName) {
                                    el.isOpen = !el.isOpen;
                                    el.isActive = true;
                                } else {
                                    el.isActive = false;
                                }
                            }
                            activeGroupData = null;
                        }
                    }
                }
                if (action.payload?.queryString?.page > 1) {
                    return Object.assign({}, state, { getStocksInProgress: false, stocksTotalPages: (action.payload as BaseResponse<GroupsWithStocksHierarchyMin, string>).body?.totalPages, groupsWithStocks: [...state.groupsWithStocks.concat(groupArray)] });
                } else {
                    return Object.assign({}, state, { getStocksInProgress: false, stocksTotalPages: (action.payload as BaseResponse<GroupsWithStocksHierarchyMin, string>).body?.totalPages, groupsWithStocks: groupArray });
                }
            }
            return Object.assign({}, state, { getStocksInProgress: false });

        case InventoryActionsConst.GetInventoryGroupResponse:
            if ((action.payload as BaseResponse<StockGroupResponse, string>)?.status === 'success') {
                groupArray = _.cloneDeep(state.groupsWithStocks);
                group = (action.payload as BaseResponse<StockGroupResponse, string>).body;
                if (groupArray) {
                    for (let el of groupArray) {
                        activeGroupData = setRecursivlyStock(el.childStockGroups ? el.childStockGroups : [], group, null, state.activeStockUniqueName);
                        if (activeGroupData) {
                            break;
                        } else {
                            if (group?.uniqueName === el?.uniqueName) {
                                el.stocks = group.stocks;
                                if (state.activeStockUniqueName) {
                                    for (let st of el.stocks) {
                                        st = Object.assign({}, st, {
                                            isActive: st?.uniqueName === state.activeStockUniqueName
                                        });
                                    }
                                }
                                el.isActive = true;
                                el.isOpen = true;
                                break;
                            }
                        }
                        activeGroupData = null;
                    }
                    return Object.assign({}, state, {
                        activeGroup: group,
                        activeGroupUniqueName: group?.uniqueName,
                        groupsWithStocks: groupArray
                    });
                }
            }
            return state;

        case InventoryActionsConst.InventoryGroupToggleOpen:
            groupUniqueName = action.payload;
            groupArray = _.cloneDeep(state.groupsWithStocks);
            if (groupUniqueName && groupArray) {
                for (let el of groupArray) {
                    activeGroupData = setRecursivlyActive(el.childStockGroups ? el.childStockGroups : [], groupUniqueName, null);
                    if (activeGroupData) {
                        el.isOpen = true;
                        el.isActive = false;
                    } else {
                        if (groupUniqueName === el?.uniqueName) {
                            el.isOpen = !el.isOpen;
                            el.isActive = true;
                        } else {
                            el.isActive = false;
                        }
                    }
                    activeGroupData = null;
                }
            }
            return Object.assign({}, state, {
                groupsWithStocks: groupArray
            });

        case InventoryActionsConst.AddNewGroup:
            return Object.assign({}, state, {
                isAddNewGroupInProcess: true,
                activeStockUniqueName: null,
                createGroupSuccess: false
            });

        case InventoryActionsConst.AddNewGroupResponse:
            let groupStockResponse = action.payload as BaseResponse<StockGroupResponse, StockGroupRequest>;
            if (groupStockResponse?.status === 'success') {
                groupArray = _.cloneDeep(state.groupsWithStocks);
                if (groupStockResponse.request.isSelfParent || !groupStockResponse.request.isSubGroup) {
                    groupArray.push({
                        name: groupStockResponse.body?.name,
                        uniqueName: groupStockResponse.body?.uniqueName,
                        childStockGroups: [],
                        stocks: [],
                        isOpen: false,
                        isActive: false
                    });
                    groupArray.map(grp => {
                        grp.isOpen = false;
                        grp.isActive = false;
                    });
                } else {
                    for (let el of groupArray) {
                        if (el?.uniqueName === groupStockResponse.request.parentStockGroupUniqueName) {
                            el.childStockGroups.push({
                                name: groupStockResponse.body?.name,
                                uniqueName: groupStockResponse.body?.uniqueName,
                                childStockGroups: [],
                                stocks: [],
                                isOpen: false,
                                isActive: false
                            });
                            el.isOpen = false;
                            el.isActive = false;
                            break;
                        } else {
                            if (el.childStockGroups?.length) {
                                activeGroupData = addNewGroup(el.childStockGroups, groupStockResponse, null);
                                if (activeGroupData) {
                                    el.isOpen = false;
                                    el.isActive = false;
                                    break;
                                }
                            }
                        }
                        activeGroupData = null;
                    }
                }
                return Object.assign({}, state, {
                    isAddNewGroupInProcess: false,
                    createGroupSuccess: true,
                    groupsWithStocks: groupArray,
                    activeStockUniqueName: null,
                    showNewGroupAsidePane: false
                });
            }
            return Object.assign({}, state, { isAddNewGroupInProcess: false, createGroupSuccess: false });
        case InventoryActionsConst.GetGroupUniqueName:
            return Object.assign({}, state, { fetchingGrpUniqueName: true, isGroupNameAvailable: null });
        case InventoryActionsConst.GetGroupUniqueNameResponse:
            let resData: BaseResponse<StockGroupResponse, string> = action.payload;
            if (resData?.status === 'success') {
                return Object.assign({}, state, { fetchingGrpUniqueName: false, isGroupNameAvailable: false });
            } else {
                if (resData.code === 'STOCK_GROUP_NOT_FOUND') {
                    return Object.assign({}, state, { fetchingGrpUniqueName: false, isGroupNameAvailable: true });
                }
                return state;
            }
        case InventoryActionsConst.UpdateGroup:
            return Object.assign({}, state, { isUpdateGroupInProcess: true, UpdateGroupSuccess: false });
        case InventoryActionsConst.UpdateGroupResponse:
            let resp = action.payload as BaseResponse<StockGroupResponse, StockGroupRequest>;
            if (resp?.status === 'success') {
                groupArray = _.cloneDeep(state.groupsWithStocks);
                let activeGroup = _.cloneDeep(state.activeGroup);
                if (resp.request.isSelfParent || !resp.request.isSubGroup) {
                    groupArray.map(gr => {
                        if (gr?.uniqueName === activeGroup?.uniqueName) {
                            gr.name = resp.body?.name;
                            gr.uniqueName = resp.body?.uniqueName;
                            gr.isActive = false;
                            gr.isOpen = false;
                        }
                    });
                } else {
                    for (let el of groupArray) {
                        if (el?.uniqueName === resp.body?.parentStockGroup?.uniqueName) {
                            let myGrp = removeGroupItemAndReturnIt(el.childStockGroups, resp.body?.parentStockGroup?.uniqueName, resp.queryString.stockGroupUniquename, null);
                            if (myGrp) {
                                myGrp.name = resp.body?.name;
                                myGrp.uniqueName = resp.body?.uniqueName;
                                myGrp.isActive = false;
                                myGrp.isOpen = false;
                                addItemAtIndex(groupArray, resp.body?.parentStockGroup?.uniqueName, myGrp);
                                break;
                            }
                        } else {
                            if (el.childStockGroups?.length) {
                                let myGrp = removeGroupItemAndReturnIt(el.childStockGroups, activeGroup?.parentStockGroup?.uniqueName, resp.queryString?.stockGroupUniquename, null);
                                if (myGrp) {
                                    myGrp.name = resp.body?.name;
                                    myGrp.uniqueName = resp.body?.uniqueName;
                                    myGrp.isActive = false;
                                    myGrp.isOpen = false;
                                    addItemAtIndex(groupArray, resp.body?.parentStockGroup?.uniqueName, myGrp);
                                    break;
                                }
                            }
                        }
                    }
                }
                return Object.assign({}, state, {
                    groupsWithStocks: groupArray,
                    activeGroup: resp.body,
                    activeGroupUniqueName: '',
                    isUpdateGroupInProcess: false,
                    UpdateGroupSuccess: true
                });
            }
            return Object.assign({}, state, { isUpdateGroupInProcess: false });
        case InventoryActionsConst.RemoveGroup:
            return Object.assign({}, state, { isDeleteGroupInProcess: true, deleteGroupSuccess: false });
        case InventoryActionsConst.RemoveGroupResponse:
            let removeGrpResp = action.payload as BaseResponse<string, string>;
            if (removeGrpResp?.status === 'success') {
                groupArray = _.cloneDeep(state.groupsWithStocks);
                for (let el of groupArray) {
                    if (el?.uniqueName === removeGrpResp.request) {
                        groupArray = groupArray?.filter(grp => grp?.uniqueName !== removeGrpResp.request);
                    } else {
                        let myParent = findMyParent(el.childStockGroups, removeGrpResp.request, null);
                        if (myParent) {
                            removeGroupItem(el.childStockGroups, myParent.uniqueName, removeGrpResp.request);
                            break;
                        }
                    }
                }
                return Object.assign({}, state, {
                    groupsWithStocks: groupArray,
                    activeGroup: null,
                    activeGroupUniqueName: '',
                    isDeleteGroupInProcess: false,
                    deleteGroupSuccess: true
                });
            }
            return Object.assign({}, state, { isDeleteGroupInProcess: false });
        case InventoryActionsConst.ResetActiveGroup:
            return Object.assign({}, state, { activeGroup: null, activeGroupUniqueName: '', activeStockUniqueName: null });

        case InventoryActionsConst.GetStockUniqueName:
            return Object.assign({}, state, { fetchingStockUniqueName: true, isStockNameAvailable: null });
        case InventoryActionsConst.GetStockUniqueNameResponse:
            let resStockData: BaseResponse<StockDetailResponse, string> = action.payload;
            if (resStockData?.status === 'success') {
                return Object.assign({}, state, { fetchingStockUniqueName: false, isStockNameAvailable: false });
            } else {
                if (resStockData.code === 'STOCK_NOT_FOUND') {
                    return Object.assign({}, state, { fetchingStockUniqueName: false, isStockNameAvailable: true });
                }
                return state;
            }
        case InventoryActionsConst.GetStockResponse:
            let stockResponse: BaseResponse<StocksResponse, string> = action.payload;
            if (stockResponse?.status === 'success') {
                return Object.assign({}, state, { stocksList: stockResponse.body });
            }
            return state;
        case InventoryActionsConst.GetManufacturingStockResponse:
            let res: BaseResponse<StocksResponse, string> = action.payload;
            if (res?.status === 'success') {
                return Object.assign({}, state, { manufacturingStockList: res.body });
            }
            return state;
        case InventoryActionsConst.GetManufacturingStockForCreateResponse:
            let mfResponse: BaseResponse<StocksResponse, string> = action.payload;
            if (mfResponse?.status === 'success') {
                return Object.assign({}, state, { manufacturingStockListForCreateMF: mfResponse.body, isGetManufactureStockInProgress: false });
            }
            return state;

        case InventoryActionsConst.GetManufacturingStockForCreate:
            return Object.assign({}, state, { isGetManufactureStockInProgress: true });

        case InventoryActionsConst.CreateStock:
            return Object.assign({}, state, { isStockAddInProcess: true, createStockSuccess: false });
        case InventoryActionsConst.CreateStockResponse:
            let createStockResp: BaseResponse<StockDetailResponse, CreateStockRequest> = action.payload;
            if (createStockResp?.status === 'success') {
                groupArray = _.cloneDeep(state.groupsWithStocks);
                if (groupArray && groupArray?.length) {
                    for (let el of groupArray) {
                        if (el?.uniqueName === createStockResp.queryString.stockGroupUniqueName) {
                            el.stocks.push(createStockResp.body);
                            el.isOpen = true;
                            el.isActive = true;
                            break;
                        } else {
                            if (el.childStockGroups?.length) {
                                activeGroupData = addNewStockToGroup(el.childStockGroups, createStockResp, null);
                                if (activeGroupData) {
                                    el.isOpen = true;
                                    el.isActive = true;
                                    break;
                                }
                            }
                        }
                        activeGroupData = null;
                    }
                }
                return Object.assign({}, state, {
                    groupsWithStocks: groupArray,
                    activeStockUniqueName: null,
                    activeStock: null,
                    createStockSuccess: true,
                    isStockAddInProcess: false
                });
            }
            return Object.assign({}, state, { isStockAddInProcess: false });
        case InventoryActionsConst.ResetCreateStockFlags: {
            return {
                ...state,
                createStockSuccess: false,
                isStockAddInProcess: false,
                activeStockUniqueName: null,
                activeStock: null
            };
        }
        case InventoryActionsConst.UpdateStock:
            return Object.assign({}, state, { isStockUpdateInProcess: true, UpdateStockSuccess: false });
        case InventoryActionsConst.UpdateStockResponse:
            let updateStockResp: BaseResponse<StockDetailResponse, CreateStockRequest> = action.payload;
            if (updateStockResp?.status === 'success') {
                groupArray = _.cloneDeep(state.groupsWithStocks);
                let activeGroupUniqueName = _.cloneDeep(updateStockResp.queryString.stockGroupUniqueName);
                updateStockIteminGroupArray(groupArray, activeGroupUniqueName, updateStockResp);
                return Object.assign({}, state, {
                    groupsWithStocks: groupArray,
                    activeStock: updateStockResp.body,
                    activeStockUniqueName: updateStockResp.body?.uniqueName,
                    isStockUpdateInProcess: false,
                    UpdateStockSuccess: true
                });
            }
            return Object.assign({}, state, { isStockUpdateInProcess: false });
        case InventoryActionsConst.RemoveStock:
            return Object.assign({}, state, { isStockDeleteInProcess: true, deleteStockSuccess: false });
        case InventoryActionsConst.RemoveStockResponse:
            let remStockResp: BaseResponse<string, string> = action.payload;
            if (remStockResp?.status === 'success') {
                groupArray = _.cloneDeep(state.groupsWithStocks);
                removeStockItemAndReturnIt(groupArray, remStockResp.queryString.stockGroupUniqueName, remStockResp.queryString.stockUniqueName, null);

                return Object.assign({}, state, {
                    groupsWithStocks: groupArray,
                    activeStock: null,
                    activeStockUniqueName: null,
                    isStockDeleteInProcess: false,
                    deleteStockSuccess: true
                });
            }
            return Object.assign({}, state, { isStockDeleteInProcess: false });
        case InventoryActionsConst.GetInventoryStockResponse:
            let stockDetailsResp: BaseResponse<StockDetailResponse, string> = action.payload;
            if (stockDetailsResp?.status === 'success') {
                return Object.assign({}, state, {
                    activeStock: stockDetailsResp.body,
                    activeStockUniqueName: stockDetailsResp.body?.uniqueName
                });
            }
            return state;
        case InventoryActionsConst.SearchGroupsWithStocks: {
            return Object.assign({}, state, { getStocksInProgress: true });
        }
        case InventoryActionsConst.SearchGroupsWithStocksResponse:
            if ((action.payload as BaseResponse<GroupsWithStocksHierarchyMin, string>)?.status === 'success') {
                groupArray = action.payload.body?.results;
                if (groupArray?.length) {
                    if (groupArray) {
                        for (let el of groupArray) {
                            if (el) {
                                el.isOpen = true;
                                el.isActive = false;
                            }
                            el.childStockGroups = [];
                        }
                    }
                }
                groupArray = _.orderBy(groupArray, ['name']);
                if (action.payload?.queryString?.page > 1) {
                    return Object.assign({}, state, { getStocksInProgress: false, stocksTotalPages: (action.payload as BaseResponse<GroupsWithStocksHierarchyMin, string>).body?.totalPages, groupsWithStocks: [...state.groupsWithStocks.concat(groupArray)] });
                } else {
                    return Object.assign({}, state, { getStocksInProgress: false, stocksTotalPages: (action.payload as BaseResponse<GroupsWithStocksHierarchyMin, string>).body?.totalPages, groupsWithStocks: groupArray });
                }
            }
            return Object.assign({}, state, { getStocksInProgress: false });
        case InventoryActionsConst.GetStockWithUniqueNameResponse:
            let data: BaseResponse<StockDetailResponse, string> = action.payload;
            if (data?.status === 'success') {
                return Object.assign({}, state, { fetchingStockUniqueName: false, isStockNameAvailable: false });
            } else {
                if (data.code === 'STOCK_NOT_FOUND') {
                    return Object.assign({}, state, { fetchingStockUniqueName: false, isStockNameAvailable: true });
                }
                return state;
            }
        case InventoryActionsConst.ShowLoadingForStockEditInProcess:
            return Object.assign({}, state, { showLoadingForStockEditInProcess: true });
        case InventoryActionsConst.HideLoadingForStockEditInProcess:
            return Object.assign({}, state, { showLoadingForStockEditInProcess: false });
        case InventoryActionsConst.ResetActiveStock:
            return Object.assign({}, state, { activeStock: null, activeStockUniqueName: null });
        case InventoryActionsConst.ResetInventoryState:
            return Object.assign({}, state, initialState);
        case InventoryActionsConst.MoveStock:
            return Object.assign({}, state, { moveStockSuccess: false });
        case InventoryActionsConst.MoveStockResponse:
            let moveStockResp: BaseResponse<string, string> = action.payload;
            groupArray = _.cloneDeep(state.groupsWithStocks);
            removeStockItemAndReturnIt(groupArray, moveStockResp.queryString.activeGroup?.uniqueName, moveStockResp.queryString.stockUniqueName, null);
            return Object.assign({}, state, {
                groupsWithStocks: groupArray,
                activeStock: null,
                activeStockUniqueName: null,
                moveStockSuccess: true
            });
        /*
         *Custom Stock Units...
         * */
        case CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_MAPPED_UNITS_RESPONSE:
            return Object.assign({}, state, { stockMappedUnits: action.payload });
        case CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_MAPPED_UNIT_UNIQUE_NAME_RESPONSE:
            return Object.assign({}, state, { stockMappedUnitsWithCode: action.payload });

        case CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_RESPONSE:
            return Object.assign({}, state, { stockUnits: action.payload });
        case CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT:
            return Object.assign({}, state, { createCustomStockInProcess: true, createCustomStockSuccess: false, });
        case CUSTOM_STOCK_UNIT_ACTIONS.RESET_STOCK_UNIT_RESPONSE:
            return Object.assign({}, state, {createCustomStockSuccess: false});
        case CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT_RESPONSE:
            if (action.payload?.status === 'success') {
                return Object.assign({}, state, {
                    stockUnits: [...state.stockUnits, action.payload.body],
                    createCustomStockInProcess: false,
                    createCustomStockSuccess: true,
                    showNewCustomUnitAsidePane: false
                });
            }
            return {
                ...state,
                createCustomStockInProcess: false,
                createCustomStockSuccess: false
            };
        case CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT:
            return Object.assign({}, state, { updateCustomStockInProcess: true ,updateCustomStockSuccess: false });
        case CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT_RESPONSE:
            return Object.assign({}, state, {
                stockUnits: state.stockUnits.map(unit => {
                    if (unit.code === action.payload.code) {
                        return action.payload
                    }
                    return unit;
                }),
                updateCustomStockInProcess: false,
                updateCustomStockSuccess: true
            });
        case CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT:
            return Object.assign({}, state, { deleteCustomStockInProcessCode: [...state.deleteCustomStockInProcessCode, action.payload],  deleteCustomStockSuccess: false });
        case CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT_RESPONSE:
            if ((action.payload as BaseResponse<string, string>)?.status === 'success') {
                return Object.assign({}, state, {
                    stockUnits: state.stockUnits?.filter(p => p.code !== (action.payload as BaseResponse<string, string>).request),
                    deleteCustomStockInProcessCode: state.deleteCustomStockInProcessCode?.filter(p => p !== (action.payload as BaseResponse<string, string>).request),
                    deleteCustomStockSuccess: true,
                });
            }
            return Object.assign({}, state, {
                deleteCustomStockInProcessCode: state.deleteCustomStockInProcessCode?.filter(p => p !== (action.payload as BaseResponse<string, string>).request),
                deleteCustomStockSuccess: false
            });
        case CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_NAME:
            return Object.assign({}, state, { isStockUnitCodeAvailable: null });
        case CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_NAME_RESPONSE:
            let resStockUnit: BaseResponse<StockDetailResponse, string> = action.payload;
            if (resStockUnit?.status === 'success') {
                return Object.assign({}, state, { isStockNameAvailable: false });
            } else {
                if (resStockUnit.code === 'NOT_FOUND') {
                    return Object.assign({}, state, { isStockUnitCodeAvailable: true });
                }
                return state;
            }
        /*
         * Inventory Stock Report
         * */
        case STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT_RESPONSE:
            return Object.assign({}, state, { stockReport: action.payload, stockReportInProcess: false });
        case STOCKS_REPORT_ACTIONS.GET_GROUP_STOCKS_REPORT: {
            return {
                ...state,
                groupStockReportInProcess: true
            };
        }
        case STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT: {
            return {
                ...state,
                stockReportInProcess: true
            };
        }
        case STOCKS_REPORT_ACTIONS.GET_GROUP_STOCKS_REPORT_RESPONSE:
            return Object.assign({}, state, { groupStockReport: action.payload, groupStockReportInProcess: false });
        case InventoryActionsConst.NewGroupAsidePane:
            return Object.assign({}, state, { showNewGroupAsidePane: action.payload });
        case InventoryActionsConst.NewCustomUnitAsidePane:
            return Object.assign({}, state, { showNewCustomUnitAsidePane: action.payload });
        case InventoryActionsConst.ManageInventoryAside:
            return Object.assign({}, state, { inventoryAsideState: action.payload });

        //  region branch
        case InventoryActionsConst.ShowBranchScreen:
            return Object.assign({}, state, { showBranchScreen: action.payload });
        case InventoryActionsConst.ShowBranchScreenSideBar:
            return Object.assign({}, state, { showBranchScreenSidebar: action.payload });
        //  endregion
        default:
            return state;
    }
}

const setRecursivlyActive = (groups: IGroupsWithStocksHierarchyMinItem[], uniqueName: string, result: IGroupsWithStocksHierarchyMinItem) => {
    for (let el of groups) {
        if (el?.uniqueName === uniqueName) {
            el.isActive = true;
            el.isOpen = !el.isOpen;
            if (!result) {
                result = el;
            }
        } else {
            el.isActive = false;
        }
        if (el.childStockGroups && el.childStockGroups?.length > 0 && !result) {
            result = setRecursivlyActive(el.childStockGroups, uniqueName, result);
            if (result) {
                el.isOpen = true;
                el.isActive = false;
                result = el;
            } else {
                el.isActive = false;
            }
        }
    }
    return result;
};

const setRecursivlyStock = (groups: IGroupsWithStocksHierarchyMinItem[], group: StockGroupResponse, result: IGroupsWithStocksHierarchyMinItem, stockUniqueName?: string) => {
    for (let el of groups) {
        if (el?.uniqueName === group?.uniqueName) {
            el.stocks = group.stocks;
            if (stockUniqueName) {
                for (let st of el.stocks) {
                    st = Object.assign({}, st, {
                        isActive: st?.uniqueName === stockUniqueName
                    });
                }
            }
            el.isActive = true;
            el.isOpen = true;
            if (!result) {
                result = el;
            }
        } else {
            el.isActive = false;
        }
        if (el.childStockGroups && el.childStockGroups?.length > 0 && !result) {
            result = setRecursivlyStock(el.childStockGroups, group, result, stockUniqueName);
            if (result) {
                el.isOpen = true;
                el.isActive = false;
                result = el;
            } else {
                el.isActive = false;
            }
        }
    }
    return result;
};

const addNewGroup = (groups: IGroupsWithStocksHierarchyMinItem[], group: BaseResponse<StockGroupResponse, StockGroupRequest>, result: IGroupsWithStocksHierarchyMinItem) => {
    for (let el of groups) {
        if (el?.uniqueName === group.request.parentStockGroupUniqueName) {
            el.isActive = false;
            el.isOpen = false;
            el.childStockGroups.push({
                name: group.body?.name,
                uniqueName: group.body?.uniqueName,
                childStockGroups: [],
                stocks: [],
                isOpen: false,
                isActive: false
            });
            if (!result) {
                result = el;
                return result;
            }
        }
        if (el.childStockGroups && el.childStockGroups?.length > 0 && !result) {
            result = addNewGroup(el.childStockGroups, group, result);
            if (result) {
                result = el;
                return result;
            }
        }
    }
    return result;
};

const removeGroupItem = (groups: IGroupsWithStocksHierarchyMinItem[], parentUniqueName: string, uniqueName: string) => {
    for (let index = 0; index < groups?.length; index++) {
        if (groups[index]?.uniqueName === parentUniqueName) {
            groups.splice(index, 1);
            return;
        }

        if (groups[index].childStockGroups && groups[index].childStockGroups?.length > 0) {
            removeGroupItem(groups[index].childStockGroups, parentUniqueName, uniqueName);
        }
    }
    return;
};

const addItemAtIndex = (groups: IGroupsWithStocksHierarchyMinItem[], parentUniqueName: string, group: IGroupsWithStocksHierarchyMinItem) => {
    for (let el of groups) {
        if (el?.uniqueName === parentUniqueName) {
            el.isActive = false;
            el.isOpen = false;
            el.childStockGroups.push({
                name: group?.name,
                uniqueName: group?.uniqueName,
                childStockGroups: group?.childStockGroups,
                stocks: [],
                isOpen: false,
                isActive: false
            });
            return;
        }
        if (el.childStockGroups && el.childStockGroups?.length > 0) {
            addItemAtIndex(el.childStockGroups, parentUniqueName, group);
        }
    }
    return;
};

const findMyParent = (groups: IGroupsWithStocksHierarchyMinItem[], uniqueName: string, result: IGroupsWithStocksHierarchyMinItem) => {
    for (let el of groups) {
        if (el?.uniqueName === uniqueName) {
            if (!result) {
                result = el;
                return result;
            }
        }
        if (el.childStockGroups && el.childStockGroups?.length > 0 && !result) {
            result = findMyParent(el.childStockGroups, uniqueName, result);
            if (result) {
                result = el;
                return result;
            }
        }
    }
    return result;
};

const removeGroupItemAndReturnIt = (groups: IGroupsWithStocksHierarchyMinItem[], parentUniqueName: string, uniqueName: string, result: IGroupsWithStocksHierarchyMinItem): IGroupsWithStocksHierarchyMinItem => {
    for (let index = 0; index < groups?.length; index++) {
        if (groups[index]?.uniqueName === uniqueName) {
            result = groups[index];
            groups.splice(index, 1);
            return result;
        }

        if (groups[index].childStockGroups && groups[index].childStockGroups?.length > 0) {
            result = removeGroupItemAndReturnIt(groups[index].childStockGroups, parentUniqueName, uniqueName, result);
            if (result) {
                return result;
            }
        }
    }
    return result;
};

const addNewStockToGroup = (groups: IGroupsWithStocksHierarchyMinItem[], stock: BaseResponse<StockDetailResponse, CreateStockRequest>, result: IGroupsWithStocksHierarchyMinItem) => {
    for (let el of groups) {
        if (el?.uniqueName === stock.queryString.stockGroupUniqueName) {
            el.isActive = true;
            el.isOpen = true;
            el.stocks.push(stock.body);
            if (!result) {
                result = el;
                return result;
            }
        }
        if (el.childStockGroups && el.childStockGroups?.length > 0 && !result) {
            result = addNewStockToGroup(el.childStockGroups, stock, result);
            if (result) {
                result = el;
                return result;
            }
        }
    }
    return result;
};

const removeStockItemAndReturnIt = (groups: IGroupsWithStocksHierarchyMinItem[], grpUniqueName: string, stockUniqueName: string, result: INameUniqueName): INameUniqueName => {
    for (let grp of groups) {
        if (grp?.uniqueName === grpUniqueName) {
            let st = grp.stocks?.findIndex(p => p?.uniqueName === stockUniqueName);
            result = grp.stocks[st];
            grp.stocks.splice(st, 1);
            return result;
        }

        if (grp.childStockGroups && grp.childStockGroups?.length > 0) {
            result = removeStockItemAndReturnIt(grp.childStockGroups, grpUniqueName, stockUniqueName, result);
            if (result) {
                return result;
            }
        }
    }
    return result;
};

/** update stock group array object on update stock unit in a group **/
const updateStockIteminGroupArray = (groups: IGroupsWithStocksHierarchyMinItem[], grpUniqueName: string, response: BaseResponse<StockDetailResponse, CreateStockRequest>): void => {
    for (let grp of groups) {
        if (grp?.uniqueName === grpUniqueName) {
            let index = grp.stocks?.findIndex(stock => stock?.uniqueName === response.queryString.stockUniqueName);
            if (index > -1) {
                grp.stocks[index] = {
                    name: response.body?.name,
                    uniqueName: response.body?.uniqueName,
                };
                return
            }
        }

        if (grp.childStockGroups && grp.childStockGroups?.length > 0) {
            updateStockIteminGroupArray(grp.childStockGroups, grpUniqueName, response);
        }
    }
};
const addStockItemAtIndex = (groups: IGroupsWithStocksHierarchyMinItem[], parentUniqueName: string, stock: INameUniqueName) => {
    for (let el of groups) {
        if (el?.uniqueName === parentUniqueName) {
            el.isActive = true;
            el.isOpen = true;
            el.stocks.push({
                name: stock.name,
                uniqueName: stock?.uniqueName
            });
            return;
        }
        if (el.childStockGroups && el.childStockGroups?.length > 0) {
            addStockItemAtIndex(el.childStockGroups, parentUniqueName, stock);
        }
    }
    return;
};
