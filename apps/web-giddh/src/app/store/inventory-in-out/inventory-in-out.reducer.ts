import { StocksResponse } from '../../models/api-models/Inventory';
import { CustomActions } from '../custom-actions';
import { InventoryReport, InventoryUser } from '../../models/api-models/Inventory-in-out';
import { INVENTORY_ENTRY_ACTIONS, INVENTORY_REPORT_ACTIONS, INVENTORY_USER_ACTIONS } from '../../actions/inventory/inventory.const';

/**
 * Keeping Track of the CompanyState
 */
export interface InventoryInOutState {
    stocksList: StocksResponse;
    inventoryUsers: InventoryUser[];
    inventoryReport: InventoryReport;
    entryInProcess: boolean;
    entrySuccess: boolean;
    userSuccess: boolean;
}

const initialState: InventoryInOutState = {
    stocksList: null,
    inventoryUsers: [],
    inventoryReport: null,
    entryInProcess: false,
    entrySuccess: false,
    userSuccess: false
};

export function InventoryInOutReducer(state: InventoryInOutState = initialState, action: CustomActions): InventoryInOutState {
    switch (action.type) {
        case INVENTORY_USER_ACTIONS.GET_ALL_USERS_RESPONSE: {
            return { ...state, inventoryUsers: action.payload.body?.results };
        }
        case INVENTORY_REPORT_ACTIONS.GENERATE_REPORT_RESPONSE: {
            return { ...state, inventoryReport: action.payload.body };
        }
        case INVENTORY_ENTRY_ACTIONS.CREATE_ENTRY: {
            return { ...state, entryInProcess: true, entrySuccess: false };
        }
        case INVENTORY_ENTRY_ACTIONS.CREATE_ENTRY_RESPONSE: {
            return { ...state, entryInProcess: false, entrySuccess: action.payload?.status === 'success' };
        }
        case INVENTORY_ENTRY_ACTIONS.CREATE_TRANSFER_ENTRY: {
            return { ...state, entryInProcess: false, entrySuccess: false };
        }
        case INVENTORY_ENTRY_ACTIONS.CREATE_TRANSFER_ENTRY_RESPONSE: {
            return { ...state, entryInProcess: false, entrySuccess: action.payload?.status === 'success' };
        }
        case INVENTORY_USER_ACTIONS.CREATE_USER: {
            return { ...state, userSuccess: false };
        }
        case INVENTORY_USER_ACTIONS.CREATE_USER_RESPONSE: {
            let userState = _.cloneDeep(state.inventoryUsers);
            userState.push(action.payload.body);
            return { ...state, userSuccess: true, inventoryUsers: userState };
        }
        default:
            return state;
    }
}
