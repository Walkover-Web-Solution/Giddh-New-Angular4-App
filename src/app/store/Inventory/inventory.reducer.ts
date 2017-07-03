import { GroupsWithStocksHierarchyMin } from '../../models/api-models/GroupsWithStocks';
import { StockGroupRequest, StockGroupResponse, StockUnitRequest } from '../../models/api-models/Inventory';
import { IGroupsWithStocksHierarchyMinItem } from '../../models/interfaces/groupsWithStocks.interface';
import { Action, ActionReducer } from '@ngrx/store';
import * as _ from 'lodash';
import { CUSTOM_STOCK_UNIT_ACTIONS, InventoryActionsConst } from '../../services/actions/inventory/inventory.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';

/**
 * Keeping Track of the CompanyState
 */
export interface InventoryState {
  groupsWithStocks?: IGroupsWithStocksHierarchyMinItem[];
  stockUnits?: StockUnitRequest[];
  activeGroup?: StockGroupResponse;
  activeStock?: string;
  isAddNewGroupInProcess: boolean;
  fetchingGrpUniqueName: boolean;
  isGroupNameAvailable: boolean;
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
  stockUnits: [],
  isAddNewGroupInProcess: false,
  fetchingGrpUniqueName: false,
  isGroupNameAvailable: false
};

export const InventoryReducer: ActionReducer<InventoryState> = (state: InventoryState = initialState, action: Action) => {
  let groupUniqueName = '';
  let groupArray: IGroupsWithStocksHierarchyMinItem[] = [];
  let group: StockGroupResponse = null;
  let activeGroupData: IGroupsWithStocksHierarchyMinItem;
  switch (action.type) {
    case InventoryActionsConst.GetGroupsWithStocksHierarchyMinResponse:
      if ((action.payload as BaseResponse<GroupsWithStocksHierarchyMin, string>).status === 'success') {
        groupArray = (action.payload as BaseResponse<GroupsWithStocksHierarchyMin, string>).body.results;
        return Object.assign({}, state, {groupsWithStocks: prepare(groupArray)});
      }
      return state;

    case InventoryActionsConst.GetInventoryGroupResponse:
      if ((action.payload as BaseResponse<StockGroupResponse, string>).status === 'success') {
        groupArray = _.cloneDeep(state.groupsWithStocks);
        group = (action.payload as BaseResponse<StockGroupResponse, string>).body;
        for (let el of groupArray) {
          activeGroupData = setRecursivlyStock(el.childStockGroups ? el.childStockGroups : [], group, null, (action.payload as BaseResponse<StockGroupResponse, string>).queryString.stockUniqueName);
          if (activeGroupData) {
            break;
          } else {
            if (group.uniqueName === el.uniqueName) {
              el.stocks = group.stocks;
              break;
            }
          }
          activeGroupData = null;
        }
        return Object.assign({}, state, {activeGroup: group, groupsWithStocks: groupArray});
      }
      return state;

    case InventoryActionsConst.InventoryGroupToggleOpen:
      groupUniqueName = action.payload;
      groupArray = _.cloneDeep(state.groupsWithStocks);
      if (groupUniqueName) {
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
      return Object.assign({}, state, {isAddNewGroupInProcess: true});

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
        return Object.assign({}, state, {isAddNewGroupInProcess: false, groupsWithStocks: groupArray});
      }
      return state;
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
    /*
     *Custom Stock Units...
     * */
    case CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_RESPONSE:
      return Object.assign({}, state, {stockUnits: action.payload});
    case CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT_RESPONSE:
      return Object.assign({}, state, {stockUnits: [...state.stockUnits, action.payload]});
    case CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT_RESPONSE:
      return Object.assign({}, state, {stockUnits: state.stockUnits.map(p => p.code === action.payload ? action.payload : p)});
    case CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT_RESPONSE:
      return Object.assign({}, state, {stockUnits: state.stockUnits.filter(p => p.code !== action.payload)});
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
      el.isOpen = !el.isOpen;
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
