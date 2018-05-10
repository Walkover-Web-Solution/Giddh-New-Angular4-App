import { StocksResponse } from '../../models/api-models/Inventory';
import { CustomActions } from '../customActions';
import { InventoryUser } from '../../models/api-models/Inventory-in-out';
import { INVENTORY_USER_ACTIONS } from '../../actions/inventory/inventory.const';

/**
 * Keeping Track of the CompanyState
 */
export interface InventoryInOutState {
  stocksList: StocksResponse;
  inventoryUsers: InventoryUser[];
}

const initialState: InventoryInOutState = {
  stocksList: null,
  inventoryUsers: null
};

export function InventoryInOutReducer(state: InventoryInOutState = initialState, action: CustomActions): InventoryInOutState {
  switch (action.type) {
    case INVENTORY_USER_ACTIONS.GET_ALL_USERS_RESPONSE:
      return {...state, inventoryUsers: action.payload.body.results};
    default:
      return state;
  }
}
