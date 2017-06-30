import { GroupsWithStocksHierarchyMin } from '../../models/api-models/GroupsWithStocks';
import { StockGroupResponse, StocksResponse } from '../../models/api-models/Inventory';
import { IGroupsWithStocksHierarchyMinItem } from '../../models/interfaces/groupsWithStocks.interface';
import { BaseResponse } from './../../models/api-models/BaseResponse';
import { Action, ActionReducer } from '@ngrx/store';
import * as _ from 'lodash';
import { InventoryActionsConst } from '../../services/actions/inventory/inventory.const';

/**
 * Keeping Track of the CompanyState
 */
export interface InventoryState {
  groupsWithStocks?: IGroupsWithStocksHierarchyMinItem[];
  activeGroup?: StockGroupResponse;
  activeStock?: string;
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
  groupsWithStocks: []
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
        return Object.assign({}, state, { groupsWithStocks: prepare(groupArray) });
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
        return Object.assign({}, state, { activeGroup: group, groupsWithStocks: groupArray });
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
        groupsWithStocks: groupArray,
      });
    default:
      return state;
  }
};

const setRecursivlyActive = (groups: IGroupsWithStocksHierarchyMinItem[], uniqueName: string, result: IGroupsWithStocksHierarchyMinItem) => {
  for (let el of groups) {
    if (el.uniqueName === uniqueName) {
      el.isActive = true;
      el.isOpen = !el.isOpen;
      if (!result) { result = el; }
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
      if (!result) { result = el; }
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
