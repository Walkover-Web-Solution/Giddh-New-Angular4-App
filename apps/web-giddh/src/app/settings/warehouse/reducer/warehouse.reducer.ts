import { Action } from '@ngrx/store';

export interface WarehouseState {
    warehouses: any[];
    selectedWarehouse: any;
    isLoading: boolean;
    error: string | null;
    warehouseCreated: boolean;
    warehouseUpdated: boolean;
    defaultWarehouseData: any;
}

export const initialWarehouseState: WarehouseState = {
    warehouses: [],
    selectedWarehouse: null,
    isLoading: false,
    error: null,
    warehouseCreated: false,
    warehouseUpdated: false,
    defaultWarehouseData: null
};

export function warehouseReducer(state = initialWarehouseState, action: Action): WarehouseState {
    switch (action.type) {
        default:
            return state;
    }
}
