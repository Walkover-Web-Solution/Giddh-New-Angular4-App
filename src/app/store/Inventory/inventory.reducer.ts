import { GroupsWithStocksHierarchyMin } from '../../models/api-models/GroupsWithStocks';
import { StockDetailResponse, StockGroupRequest, StockGroupResponse, StockReportResponse, StocksResponse, StockUnitRequest, CreateStockRequest } from '../../models/api-models/Inventory';
import { IGroupsWithStocksHierarchyMinItem } from '../../models/interfaces/groupsWithStocks.interface';
import { Action, ActionReducer } from '@ngrx/store';
import * as _ from 'lodash';
import { CUSTOM_STOCK_UNIT_ACTIONS, InventoryActionsConst, STOCKS_REPORT_ACTIONS } from '../../services/actions/inventory/inventory.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';

/**
 * Keeping Track of the CompanyState
 */
export interface InventoryState {
  groupsWithStocks?: IGroupsWithStocksHierarchyMinItem[];
  stocksList: StocksResponse;
  stockUnits?: StockUnitRequest[];
  activeGroup?: StockGroupResponse;
  activeStock?: StockDetailResponse;
  activeStockUniqueName?: string;
  isAddNewGroupInProcess: boolean;
  fetchingGrpUniqueName: boolean;
  isGroupNameAvailable: boolean;
  isUpdateGroupInProcess: boolean;
  fetchingStockUniqueName: boolean;
  isStockNameAvailable: boolean;
  createStockSuccess: boolean;
  stockReport?: StockReportResponse;
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
  isAddNewGroupInProcess: false,
  fetchingGrpUniqueName: false,
  isGroupNameAvailable: false,
  isUpdateGroupInProcess: false,
  fetchingStockUniqueName: false,
  isStockNameAvailable: false,
  createStockSuccess: false
};

export const InventoryReducer: ActionReducer<InventoryState> = (state: InventoryState = initialState, action: Action) => {
  let groupUniqueName = '';
  let groupArray: IGroupsWithStocksHierarchyMinItem[] = [];
  let group: StockGroupResponse = null;
  let activeGroupData: IGroupsWithStocksHierarchyMinItem;
  switch (action.type) {
    case InventoryActionsConst.SetActiveStock:
      return Object.assign({}, state, { activeStockUniqueName: action.payload });
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
        return Object.assign({}, state, { groupsWithStocks: groupArray });
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
          return Object.assign({}, state, { activeGroup: group, groupsWithStocks: groupArray });
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
      return Object.assign({}, state, { isAddNewGroupInProcess: true, activeStockUniqueName: null });

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
              el.isOpen = true;
              el.isActive = true;
              break;
            } else {
              if (el.childStockGroups.length) {
                activeGroupData = addNewGroup(el.childStockGroups, groupStockResponse, null);
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
          isAddNewGroupInProcess: false,
          groupsWithStocks: groupArray,
          activeStockUniqueName: null
        });
      }
      return state;
    case InventoryActionsConst.GetGroupUniqueName:
      return Object.assign({}, state, { fetchingGrpUniqueName: true, isGroupNameAvailable: null });
    case InventoryActionsConst.GetGroupUniqueNameResponse:
      let resData: BaseResponse<StockGroupResponse, string> = action.payload;
      if (resData.status === 'success') {
        return Object.assign({}, state, { fetchingGrpUniqueName: false, isGroupNameAvailable: false });
      } else {
        if (resData.code === 'STOCK_GROUP_NOT_FOUND') {
          return Object.assign({}, state, { fetchingGrpUniqueName: false, isGroupNameAvailable: true });
        }
        return state;
      }
    case InventoryActionsConst.UpdateGroup:
      return Object.assign({}, state, { isUpdateGroupInProcess: true });
    case InventoryActionsConst.UpdateGroupResponse:
      let resp = action.payload;
      if (resp.status === 'success') {
        groupArray = _.cloneDeep(state.groupsWithStocks);
        let activeGroup = _.cloneDeep(state.activeGroup);
        let stateActiveGrp: StockGroupResponse = null;
        if (resp.request.isSelfParent) {
          groupArray.map(gr => {
            if (gr.uniqueName === activeGroup.uniqueName) {
              gr.name = resp.request.name;
              gr.uniqueName = resp.request.uniqueName;
            }
          });
        } else {
          for (let el of groupArray) {
            if (el.uniqueName === activeGroup.parentStockGroup.uniqueName) {
              let myGrp = removeGroupItemAndReturnIt(el.childStockGroups, activeGroup.parentStockGroup.uniqueName, resp.request.uniqueName, null);
              if (myGrp) {
                addItemAtIndex(groupArray, resp.request.parentStockGroupUniqueName, myGrp);
                break;
              }
            } else {
              if (el.childStockGroups.length) {
                let myGrp = removeGroupItemAndReturnIt(el.childStockGroups, activeGroup.parentStockGroup.uniqueName, resp.request.uniqueName, null);
                if (myGrp) {
                  myGrp.name = resp.request.name;
                  myGrp.uniqueName = resp.request.uniqueName;
                  addItemAtIndex(groupArray, resp.request.parentStockGroupUniqueName, myGrp);
                  break;
                }
              }
            }
          }
        }
        return Object.assign({}, state, {
          groupsWithStocks: groupArray,
          activeGroup: null,
          isUpdateGroupInProcess: false
        });
      }
      return state;
    case InventoryActionsConst.RemoveGroup:
      return state;
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
        return Object.assign({}, state, { groupsWithStocks: groupArray, activeGroup: null });
      }
      return state;
    case InventoryActionsConst.ResetActiveGroup:
      return Object.assign({}, state, { activeGroup: null, activeStockUniqueName: null });

    case InventoryActionsConst.GetStockUniqueName:
      return Object.assign({}, state, { fetchingStockUniqueName: true, isStockNameAvailable: null });
    case InventoryActionsConst.GetStockUniqueNameResponse:
      let resStockData: BaseResponse<StockDetailResponse, string> = action.payload;
      if (resStockData.status === 'success') {
        return Object.assign({}, state, { fetchingStockUniqueName: false, isStockNameAvailable: false });
      } else {
        if (resStockData.code === 'STOCK_NOT_FOUND') {
          return Object.assign({}, state, { fetchingStockUniqueName: false, isStockNameAvailable: true });
        }
        return state;
      }
    case InventoryActionsConst.GetStockResponse:
      let stockResponse: BaseResponse<StocksResponse, string> = action.payload;
      if (stockResponse.status === 'success') {
        return Object.assign({}, state, { stocksList: stockResponse.body });
      }
      return state;
    case InventoryActionsConst.CreateStock:
      return Object.assign({}, state, { createStockSuccess: false });
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
          createStockSuccess: true
        });
      }
      return state;
    case InventoryActionsConst.GetInventoryStockResponse:
      let stockDetailsResp: BaseResponse<StockDetailResponse, string> = action.payload;
      if (stockDetailsResp.status === 'success') {
        return Object.assign({}, state, {activeStock: stockDetailsResp.body,
           activeStockUniqueName: stockDetailsResp.body.uniqueName});
      }
      return state;
    /*
     *Custom Stock Units...
     * */
    case CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_RESPONSE:
      return Object.assign({}, state, { stockUnits: action.payload });
    case CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT_RESPONSE:
      return Object.assign({}, state, { stockUnits: [...state.stockUnits, action.payload] });
    case CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT_RESPONSE:
      return Object.assign({}, state, { stockUnits: state.stockUnits.map(p => p.code === action.payload ? action.payload : p) });
    case CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT_RESPONSE:
      return Object.assign({}, state, { stockUnits: state.stockUnits.filter(p => p.code !== action.payload) });
    /*
     * Inventory Stock Report
     * */
    case STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT_RESPONSE:
      return Object.assign({}, state, { stockReport: action.payload });

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
      el.isActive = true;
      el.isOpen = true;
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
      el.isActive = true;
      el.isOpen = true;
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

const removeStockItemAndReturnIt = (groups: IGroupsWithStocksHierarchyMinItem[], uniqueName: string, result: IGroupsWithStocksHierarchyMinItem): IGroupsWithStocksHierarchyMinItem => {
  for (let index = 0; index < groups.length; index++) {
    if (groups[index].uniqueName === uniqueName) {
      result = groups[index];
      groups.splice(index, 1);
      return result;
    }

    if (groups[index].childStockGroups && groups[index].childStockGroups.length > 0) {
      result = removeStockItemAndReturnIt(groups[index].childStockGroups, uniqueName, result);
      if (result) {
        return result;
      }
    }
  }
  return result;
};
