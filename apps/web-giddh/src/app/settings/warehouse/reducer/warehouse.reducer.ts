import { Action } from '@ngrx/store';

export interface WarehouseState {
    warehouses: any[];
    selectedWarehouse: any;
    isLoading: boolean;
    error: string | null;
}

export const initialWarehouseState: WarehouseState = {
    warehouses: [],
    selectedWarehouse: null,
    isLoading: false,
    error: null
};

export function warehouseReducer(state = initialWarehouseState, action: Action): WarehouseState {
    switch (action.type) {
        default:
            return state;
    }
}
