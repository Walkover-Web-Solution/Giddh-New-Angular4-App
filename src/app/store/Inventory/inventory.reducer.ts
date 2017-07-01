import { IGroupsWithStocksHierarchyMinItem } from '../../models/interfaces/groupsWithStocks.interface';
import { Action, ActionReducer } from '@ngrx/store';
import * as _ from 'lodash';
import { StockUnitResponse } from '../../models/api-models/Inventory';

/**
 * Keeping Track of the CompanyState
 */
export interface InventoryState {
  groupsWithStocks?: IGroupsWithStocksHierarchyMinItem[];
  stockUnits?: StockUnitResponse[];
}
const prepare = (mockData: IGroupsWithStocksHierarchyMinItem[]): IGroupsWithStocksHierarchyMinItem[] => {
  return _.orderBy(mockData.map((m) => {
    m = Object.assign({}, m, {
      visibleChilds: false,
      stocks: []
    });

    m.childStockGroups = prepare(m.childStockGroups);
    return m;
  }), 'name');
};
/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState: InventoryState = {
  groupsWithStocks: prepare([
    { uniqueName: 'new', childStockGroups: [], name: 'new' },
    {
      uniqueName: 'subgroup',
      childStockGroups: [
        { uniqueName: 'test', childStockGroups: [], name: 'test' }
      ],
      name: 'Sub Group'
    },
    {
      uniqueName: 'kartik',
      childStockGroups: [
        {
          uniqueName: '1',
          childStockGroups: [
            {
              uniqueName: 'www',
              childStockGroups: [
                { uniqueName: 'tttt', childStockGroups: [], name: 'ttttt' }
              ],
              name: 'www'
            }],
          name: '1'
        }],
      name: 'kartik'
    }]),
  stockUnits: [{
    name: 'Hour',
    hierarchicalQuantity: 1,
    quantityPerUnit: 1,
    code: 'hr'
  }]
};

export const InventoryReducer: ActionReducer<InventoryState> = (state: InventoryState = initialState, action: Action) => {

  switch (action.type) {
    default:
      return state;
  }
};
