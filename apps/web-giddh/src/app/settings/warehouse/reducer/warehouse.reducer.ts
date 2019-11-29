import * as _ from '../../../lodash-optimized';
import { CustomActions } from '../../../store/customActions';
import { WarehouseActions } from '../action/warehouse.action';

/**
 * Warehouse state interface
 *
 * @export
 * @interface WarehouseState
 */
export interface WarehouseState {
    warehouseCreated: boolean,
    warehouses: Array<any> | null
}

/** Initial warehouse state */
export const initialState: WarehouseState = {
    warehouseCreated: false,
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
            return { ...state, warehouseCreated: true };
        case WarehouseActions.RESET_CREATE_WAREHOUSE:
            return { ...state, warehouseCreated: false };
        case WarehouseActions.GET_ALL_WAREHOUSE_RESPONSE:
            if (action.payload) {
                return { ...state, warehouses: _.cloneDeep(action.payload.body.results) };
            }
            return state;
        default: return state;
    }
}
