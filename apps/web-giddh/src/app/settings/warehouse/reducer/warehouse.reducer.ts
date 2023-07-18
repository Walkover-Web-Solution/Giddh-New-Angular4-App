import { cloneDeep } from '../../../lodash-optimized';
import { CustomActions } from '../../../store/custom-actions';
import { WarehouseActions } from '../action/warehouse.action';

/**
 * Warehouse state interface
 *
 * @export
 * @interface WarehouseState
 */
export interface WarehouseState {
    warehouseCreated: boolean;
    warehouseUpdated: boolean;
    defaultWarehouseData: number | undefined;
    warehouses: Array<any> | null;
}

/** Initial warehouse state */
export const initialState: WarehouseState = {
    warehouseCreated: false,
    warehouseUpdated: false,
    defaultWarehouseData: undefined,
    warehouses: null
};

/**
 * Warehouse reducer
 *
 * @export
 * @param {WarehouseState} [state=initialState] Warehouse state
 * @param {CustomActions} action Action related to warehouse
 * @returns {WarehouseState} New warehouse state
 */
export function warehouseReducer(state: WarehouseState = initialState, action: CustomActions): WarehouseState {
    switch (action.type) {
        case WarehouseActions.CREATE_WAREHOUSE_RESPONSE:
            if (action.payload && action.payload.status === 'success') {
                return { ...state, warehouseCreated: true };
            } else {
                return { ...state, warehouseCreated: false };
            }
        case WarehouseActions.RESET_CREATE_WAREHOUSE:
            return { ...state, warehouseCreated: false };
        case WarehouseActions.GET_ALL_WAREHOUSE_RESPONSE:
            if (action.payload) {
                return { ...state, warehouses: cloneDeep(action.payload.body) };
            }
            return state;
        case WarehouseActions.UPDATE_WAREHOUSE_RESPONSE:
            return { ...state, warehouseUpdated: true };
        case WarehouseActions.SET_AS_DEFAULT_WAREHOUSE_RESPONSE:
            return { ...state, defaultWarehouseData: action.payload };
        case WarehouseActions.RESET_DEFAULT_WAREHOUSE_DATA:
            return { ...state, defaultWarehouseData: null };
        case WarehouseActions.RESET_UPDATE_WAREHOUSE:
            return { ...state, warehouseUpdated: false };
            case WarehouseActions.RESET_WAREHOUSES:
            return { ...state, warehouses: null };
        default: return state;
    }
}
