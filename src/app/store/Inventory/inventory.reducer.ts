import { GroupsWithStocksHierarchyMin } from '../../models/api-models/GroupsWithStocks';
import {
  CreateStockRequest,
  StockDetailResponse,
  StockGroupRequest,
  StockGroupResponse,
  StockReportResponse,
  StocksResponse,
  StockUnitRequest
} from '../../models/api-models/Inventory';
import { IGroupsWithStocksHierarchyMinItem } from '../../models/interfaces/groupsWithStocks.interface';
import { Action, ActionReducer } from '@ngrx/store';
import * as _ from 'lodash';
import {
  CUSTOM_STOCK_UNIT_ACTIONS,
  InventoryActionsConst,
  STOCKS_REPORT_ACTIONS
} from '../../services/actions/inventory/inventory.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { INameUniqueName } from '../../models/interfaces/nameUniqueName.interface';

/**
 * Keeping Track of the CompanyState
 */
export interface InventoryState {
  groupsWithStocks?: IGroupsWithStocksHierarchyMinItem[];
  stocksList: StocksResponse;
  stockUnits?: StockUnitRequest[];
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
  isStockAddInProcess: boolean;
  isStockUpdateInProcess: boolean;
  isStockDeleteInProcess: boolean;
  showLoadingForStockEditInProcess: boolean;
  isAddNewGroupInProcess: boolean;
  isUpdateGroupInProcess: boolean;
  isDeleteGroupInProcess: boolean;
  createCustomStockInProcess: boolean;
  updateCustomStockInProcess: boolean;
  deleteCustomStockInProcessCode: any[];
}

const prepare = (mockData: IGroupsWithStocksHierarchyMinItem[]): IGroupsWithStocksHierarchyMinItem[] => {
  return _.orderBy(mockData.map((m) => {
    m = Object.assign({}, m, {
      isActive: false,
      isOpen: false
    });
    m.childStockGroups = prepare(m.childStockGroups);
    return m;
  }), 'name');
};

/**
 * Setting the InitialState for this Reducer's Store
 */
// stocks: [{ uniqueName: 'sabji', name: 'Sabji' }, { uniqueName: 'kadi', name: 'Kadi' }]
const initialState: InventoryState = {
  groupsWithStocks: null,
  stocksList: null,
  stockUnits: [],
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
  deleteCustomStockInProcessCode: []
};

export const InventoryReducer: ActionReducer<InventoryState> = (state: InventoryState = initialState, action: Action) => {
  let groupUniqueName = '';
  let groupArray: IGroupsWithStocksHierarchyMinItem[] = [];
  let group: StockGroupResponse = null;
  let activeGroupData: IGroupsWithStocksHierarchyMinItem;
  switch (action.type) {
    case InventoryActionsConst.SetActiveStock:
      return Object.assign({}, state, {activeStockUniqueName: action.payload});
    case InventoryActionsConst.GetGroupsWithStocksHierarchyMinResponse:
      if ((action.payload as BaseResponse<GroupsWithStocksHierarchyMin, string>).status === 'success') {
        groupArray = prepare((action.payload as BaseResponse<GroupsWithStocksHierarchyMin, string>).body.results);
        if (state.activeGroup) {
          groupUniqueName = state.activeGroup.uniqueName;

          if (groupUniqueName && groupArray) {
            for (let el of groupArray) {
              activeGroupData = setRecursivlyActive(el.childStockGroups ? el.childStockGroups : [], groupUniqueName, null);
              if (activeGroupData) {
                el.isOpen = true;
                el.isActive = false;
              } else {
                if (groupUniqueName === el.uniqueName) {
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
        return Object.assign({}, state, {groupsWithStocks: groupArray});
      }
      return state;

    case InventoryActionsConst.GetInventoryGroupResponse:
      if ((action.payload as BaseResponse<StockGroupResponse, string>).status === 'success') {
        groupArray = _.cloneDeep(state.groupsWithStocks);
        group = (action.payload as BaseResponse<StockGroupResponse, string>).body;
        if (groupArray) {
          for (let el of groupArray) {
            activeGroupData = setRecursivlyStock(el.childStockGroups ? el.childStockGroups : [], group, null, state.activeStockUniqueName);
            if (activeGroupData) {
              break;
            } else {
              if (group.uniqueName === el.uniqueName) {
                el.stocks = group.stocks;
                if (state.activeStockUniqueName) {
                  for (let st of el.stocks) {
                    st = Object.assign({}, st, {
                      isActive: st.uniqueName === state.activeStockUniqueName
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
            activeGroupUniqueName: group.uniqueName,
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
            if (groupUniqueName === el.uniqueName) {
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
      if (groupStockResponse.status === 'success') {
        groupArray = _.cloneDeep(state.groupsWithStocks);
        if (groupStockResponse.request.isSelfParent) {
          groupArray.push({
            name: groupStockResponse.body.name,
            uniqueName: groupStockResponse.body.uniqueName,
            childStockGroups: [],
            isOpen: false,
            isActive: false
          });
        } else {
          for (let el of groupArray) {
            if (el.uniqueName === groupStockResponse.request.parentStockGroupUniqueName) {
              el.childStockGroups.push({
                name: groupStockResponse.body.name,
                uniqueName: groupStockResponse.body.uniqueName,
                childStockGroups: [],
                isOpen: false,
                isActive: false
              });
              el.isOpen = false;
              el.isActive = false;
              break;
            } else {
              if (el.childStockGroups.length) {
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
          activeStockUniqueName: null
        });
      }
      return Object.assign({}, state, {isAddNewGroupInProcess: false, createGroupSuccess: false});
    case InventoryActionsConst.GetGroupUniqueName:
      return Object.assign({}, state, {fetchingGrpUniqueName: true, isGroupNameAvailable: null});
    case InventoryActionsConst.GetGroupUniqueNameResponse:
      let resData: BaseResponse<StockGroupResponse, string> = action.payload;
      if (resData.status === 'success') {
        return Object.assign({}, state, {fetchingGrpUniqueName: false, isGroupNameAvailable: false});
      } else {
        if (resData.code === 'STOCK_GROUP_NOT_FOUND') {
          return Object.assign({}, state, {fetchingGrpUniqueName: false, isGroupNameAvailable: true});
        }
        return state;
      }
    case InventoryActionsConst.UpdateGroup:
      return Object.assign({}, state, {isUpdateGroupInProcess: true});
    case InventoryActionsConst.UpdateGroupResponse:
      let resp = action.payload as BaseResponse<StockGroupResponse, StockGroupRequest>;
      if (resp.status === 'success') {
        let data: StockGroupResponse = action.payload.body;
        groupArray = _.cloneDeep(state.groupsWithStocks);
        let activeGroup = _.cloneDeep(state.activeGroup);
        let stateActiveGrp: StockGroupResponse = null;
        if (resp.request.isSelfParent) {
          groupArray.map(gr => {
            if (gr.uniqueName === activeGroup.uniqueName) {
              gr.name = resp.body.name;
              gr.uniqueName = resp.body.uniqueName;
              gr.isActive = false;
              gr.isOpen = false;
            }
          });
        } else {
          for (let el of groupArray) {
            if (el.uniqueName === activeGroup.parentStockGroup.uniqueName) {
              let myGrp = removeGroupItemAndReturnIt(el.childStockGroups, activeGroup.parentStockGroup.uniqueName, resp.queryString.stockGroupUniquename, null);
              if (myGrp) {
                myGrp.name = resp.body.name;
                myGrp.uniqueName = resp.body.uniqueName;
                myGrp.isActive = false;
                myGrp.isOpen = false;
                addItemAtIndex(groupArray, resp.body.parentStockGroup.uniqueName, myGrp);
                break;
              }
            } else {
              if (el.childStockGroups.length) {
                let myGrp = removeGroupItemAndReturnIt(el.childStockGroups, activeGroup.parentStockGroup.uniqueName, resp.queryString.stockGroupUniquename, null);
                if (myGrp) {
                  myGrp.name = resp.body.name;
                  myGrp.uniqueName = resp.body.uniqueName;
                  myGrp.isActive = false;
                  myGrp.isOpen = false;
                  addItemAtIndex(groupArray, resp.body.parentStockGroup.uniqueName, myGrp);
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
          isUpdateGroupInProcess: false
        });
      }
      return Object.assign({}, state, {isUpdateGroupInProcess: false});
    case InventoryActionsConst.RemoveGroup:
      return Object.assign({}, state, {isDeleteGroupInProcess: true});
    case InventoryActionsConst.RemoveGroupResponse:
      let removeGrpResp = action.payload as BaseResponse<string, string>;
      if (removeGrpResp.status === 'success') {
        groupArray = _.cloneDeep(state.groupsWithStocks);
        for (let el of groupArray) {
          if (el.uniqueName === removeGrpResp.request) {
            groupArray = groupArray.filter(grp => grp.uniqueName !== removeGrpResp.request);
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
          isDeleteGroupInProcess: false
        });
      }
      return Object.assign({}, state, {isDeleteGroupInProcess: false});
    case InventoryActionsConst.ResetActiveGroup:
      return Object.assign({}, state, {activeGroup: null, activeGroupUniqueName: '', activeStockUniqueName: null});

    case InventoryActionsConst.GetStockUniqueName:
      return Object.assign({}, state, {fetchingStockUniqueName: true, isStockNameAvailable: null});
    case InventoryActionsConst.GetStockUniqueNameResponse:
      let resStockData: BaseResponse<StockDetailResponse, string> = action.payload;
      if (resStockData.status === 'success') {
        return Object.assign({}, state, {fetchingStockUniqueName: false, isStockNameAvailable: false});
      } else {
        if (resStockData.code === 'STOCK_NOT_FOUND') {
          return Object.assign({}, state, {fetchingStockUniqueName: false, isStockNameAvailable: true});
        }
        return state;
      }
    case InventoryActionsConst.GetStockResponse:
      let stockResponse: BaseResponse<StocksResponse, string> = action.payload;
      if (stockResponse.status === 'success') {
        return Object.assign({}, state, {stocksList: stockResponse.body});
      }
      return state;
    case InventoryActionsConst.CreateStock:
      return Object.assign({}, state, {isStockAddInProcess: true, createStockSuccess: false});
    case InventoryActionsConst.CreateStockResponse:
      let createStockResp: BaseResponse<StockDetailResponse, CreateStockRequest> = action.payload;
      if (createStockResp.status === 'success') {
        groupArray = _.cloneDeep(state.groupsWithStocks);
        for (let el of groupArray) {
          if (el.uniqueName === createStockResp.queryString.stockGroupUniqueName) {
            el.stocks.push(createStockResp.body);
            el.isOpen = true;
            el.isActive = true;
            break;
          } else {
            if (el.childStockGroups.length) {
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
        return Object.assign({}, state, {
          groupsWithStocks: groupArray,
          activeStockUniqueName: createStockResp.request.uniqueName,
          activeStock: createStockResp.body,
          createStockSuccess: true,
          isStockAddInProcess: false
        });
      }
      return Object.assign({}, state, {isStockAddInProcess: false});
    case InventoryActionsConst.UpdateStock:
      return Object.assign({}, state, {isStockUpdateInProcess: true});
    case InventoryActionsConst.UpdateStockResponse:
      let updateStockResp: BaseResponse<StockDetailResponse, CreateStockRequest> = action.payload;
      if (updateStockResp.status === 'success') {
        groupArray = _.cloneDeep(state.groupsWithStocks);
        let activeGroup = _.cloneDeep(state.activeGroup);
        let stateActiveGrp: StockGroupResponse = null;
        let myGrp = removeStockItemAndReturnIt(groupArray, activeGroup.uniqueName, updateStockResp.queryString.stockUniqueName, null);
        if (myGrp) {
          myGrp.name = updateStockResp.body.name;
          myGrp.uniqueName = updateStockResp.body.uniqueName;
          addStockItemAtIndex(groupArray, activeGroup.uniqueName, myGrp);
        }
        return Object.assign({}, state, {
          groupsWithStocks: groupArray,
          activeStock: updateStockResp.body,
          activeStockUniqueName: updateStockResp.body.uniqueName,
          isStockUpdateInProcess: false
        });
      }
      return Object.assign({}, state, {isStockUpdateInProcess: false});
    case InventoryActionsConst.RemoveStock:
      return Object.assign({}, state, {isStockDeleteInProcess: true});
    case InventoryActionsConst.RemoveStockResponse:
      let remStockResp: BaseResponse<string, string> = action.payload;
      if (remStockResp.status === 'success') {
        groupArray = _.cloneDeep(state.groupsWithStocks);
        removeStockItemAndReturnIt(groupArray, remStockResp.queryString.stockGroupUniqueName, remStockResp.queryString.stockUniqueName, null);

        return Object.assign({}, state, {
          groupsWithStocks: groupArray,
          activeStock: null,
          activeStockUniqueName: null,
          isStockDeleteInProcess: false
        });
      }
      return Object.assign({}, state, {isStockDeleteInProcess: false});
    case InventoryActionsConst.GetInventoryStockResponse:
      let stockDetailsResp: BaseResponse<StockDetailResponse, string> = action.payload;
      if (stockDetailsResp.status === 'success') {
        return Object.assign({}, state, {
          activeStock: stockDetailsResp.body,
          activeStockUniqueName: stockDetailsResp.body.uniqueName
        });
      }
      return state;
    case InventoryActionsConst.ShowLoadingForStockEditInProcess:
      return Object.assign({}, state, {showLoadingForStockEditInProcess: true});
    case InventoryActionsConst.HideLoadingForStockEditInProcess:
      return Object.assign({}, state, {showLoadingForStockEditInProcess: false});
    case InventoryActionsConst.ResetActiveStock:
      return Object.assign({}, state, {activeStock: null, activeStockUniqueName: null});
    /*
     *Custom Stock Units...
     * */
    case CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_RESPONSE:
      return Object.assign({}, state, {stockUnits: action.payload});
    case CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT:
      return Object.assign({}, state, {createCustomStockInProcess: true});
    case CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT_RESPONSE:
      return Object.assign({}, state, {
        stockUnits: [...state.stockUnits, action.payload],
        createCustomStockInProcess: false
      });
    case CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT:
      return Object.assign({}, state, {updateCustomStockInProcess: true});
    case CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT_RESPONSE:
      return Object.assign({}, state, {
        stockUnits: state.stockUnits.map(p => p.code === action.payload.code ? action.payload.unit : p),
        updateCustomStockInProcess: false
      });
    case CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT:
      return Object.assign({}, state, {deleteCustomStockInProcessCode: [...state.deleteCustomStockInProcessCode, action.payload]});
    case CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT_RESPONSE:
      if ((action.payload as BaseResponse<string, string>).status === 'success') {
        return Object.assign({}, state, {
          stockUnits: state.stockUnits.filter(p => p.code !== (action.payload as BaseResponse<string, string>).request),
          deleteCustomStockInProcessCode: state.deleteCustomStockInProcessCode.filter(p => p !== (action.payload as BaseResponse<string, string>).request)
        });
      }
      return Object.assign({}, state, {
        deleteCustomStockInProcessCode: state.deleteCustomStockInProcessCode.filter(p => p !== (action.payload as BaseResponse<string, string>).request)
      });
    /*
     * Inventory Stock Report
     * */
    case STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT_RESPONSE:
      return Object.assign({}, state, {stockReport: action.payload});

    default:
      return state;
  }
};

const setRecursivlyActive = (groups: IGroupsWithStocksHierarchyMinItem[], uniqueName: string, result: IGroupsWithStocksHierarchyMinItem) => {
  for (let el of groups) {
    if (el.uniqueName === uniqueName) {
      el.isActive = true;
      el.isOpen = !el.isOpen;
      if (!result) {
        result = el;
      }
    } else {
      el.isActive = false;
    }
    if (el.childStockGroups && el.childStockGroups.length > 0 && !result) {
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
    if (el.uniqueName === group.uniqueName) {
      el.stocks = group.stocks;
      if (stockUniqueName) {
        for (let st of el.stocks) {
          st = Object.assign({}, st, {
            isActive: st.uniqueName === stockUniqueName
          });
          // st.isActive = ();
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
    if (el.childStockGroups && el.childStockGroups.length > 0 && !result) {
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
    if (el.uniqueName === group.request.parentStockGroupUniqueName) {
      el.isActive = false;
      el.isOpen = false;
      el.childStockGroups.push({
        name: group.body.name,
        uniqueName: group.body.uniqueName,
        childStockGroups: [],
        isOpen: false,
        isActive: false
      });
      if (!result) {
        result = el;
        return result;
      }
    }
    if (el.childStockGroups && el.childStockGroups.length > 0 && !result) {
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
  for (let index = 0; index < groups.length; index++) {
    if (groups[index].uniqueName === parentUniqueName) {
      groups.splice(index, 1);
      return;
    }

    if (groups[index].childStockGroups && groups[index].childStockGroups.length > 0) {
      removeGroupItem(groups[index].childStockGroups, parentUniqueName, uniqueName);
    }
  }
  return;
};

const addItemAtIndex = (groups: IGroupsWithStocksHierarchyMinItem[], parentUniqueName: string, group: IGroupsWithStocksHierarchyMinItem) => {
  for (let el of groups) {
    if (el.uniqueName === parentUniqueName) {
      el.isActive = false;
      el.isOpen = false;
      el.childStockGroups.push({
        name: group.name,
        uniqueName: group.uniqueName,
        childStockGroups: group.childStockGroups,
        isOpen: false,
        isActive: false
      });
      return;
    }
    if (el.childStockGroups && el.childStockGroups.length > 0) {
      addItemAtIndex(el.childStockGroups, parentUniqueName, group);
    }
  }
  return;
};

const findMyParent = (groups: IGroupsWithStocksHierarchyMinItem[], uniqueName: string, result: IGroupsWithStocksHierarchyMinItem) => {
  for (let el of groups) {
    if (el.uniqueName === uniqueName) {
      if (!result) {
        result = el;
        return result;
      }
    }
    if (el.childStockGroups && el.childStockGroups.length > 0 && !result) {
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
  for (let index = 0; index < groups.length; index++) {
    if (groups[index].uniqueName === uniqueName) {
      result = groups[index];
      groups.splice(index, 1);
      return result;
    }

    if (groups[index].childStockGroups && groups[index].childStockGroups.length > 0) {
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
    if (el.uniqueName === stock.queryString.stockGroupUniqueName) {
      el.isActive = true;
      el.isOpen = true;
      el.stocks.push(stock.body);
      if (!result) {
        result = el;
        return result;
      }
    }
    if (el.childStockGroups && el.childStockGroups.length > 0 && !result) {
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
    if (grp.uniqueName === grpUniqueName) {
      let st = grp.stocks.findIndex(p => p.uniqueName === stockUniqueName);
      result = grp.stocks[st];
      grp.stocks.splice(st, 1);
      return result;
    }

    if (grp.childStockGroups && grp.childStockGroups.length > 0) {
      result = removeStockItemAndReturnIt(grp.childStockGroups, grpUniqueName, stockUniqueName, result);
      if (result) {
        return result;
      }
    }
  }
  return result;
};

const addStockItemAtIndex = (groups: IGroupsWithStocksHierarchyMinItem[], parentUniqueName: string, stock: INameUniqueName) => {
  for (let el of groups) {
    if (el.uniqueName === parentUniqueName) {
      el.isActive = true;
      el.isOpen = true;
      el.stocks.push({
        name: stock.name,
        uniqueName: stock.uniqueName
      });
      return;
    }
    if (el.childStockGroups && el.childStockGroups.length > 0) {
      addStockItemAtIndex(el.childStockGroups, parentUniqueName, stock);
    }
  }
  return;
};
