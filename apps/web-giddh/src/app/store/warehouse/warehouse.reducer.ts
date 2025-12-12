import { createReducer, on } from '@ngrx/store';

export interface WarehouseState {
  warehouses: any[];
  selectedWarehouse: any;
  isLoading: boolean;
  error: string | null;
  warehouseCreated: boolean;
  warehouseUpdated: boolean;
  defaultWarehouseData: any;
}

export const initialState: WarehouseState = {
  warehouses: [],
  selectedWarehouse: null,
  isLoading: false,
  error: null,
  warehouseCreated: false,
  warehouseUpdated: false,
  defaultWarehouseData: null
};

export const warehouseReducer = createReducer(
  initialState,
  // Add actions here when needed
);
