export const WAREHOUSE_API = {
    CREATE_WAREHOUSE: 'company/:companyUniqueName/warehouse',
    GET_ALL_WAREHOUSES: 'company/:companyUniqueName/warehouse',
    GET_WAREHOUSE: 'company/:companyUniqueName/warehouse/:warehouseUniqueName',
    UPDATE_WAREHOUSE: 'company/:companyUniqueName/warehouse/:warehouseUniqueName',
    DELETE_WAREHOUSE: 'company/:companyUniqueName/warehouse/:warehouseUniqueName',
    SET_DEFAULT_WAREHOUSE: 'company/:companyUniqueName/warehouse/:warehouseUniqueName/default',
    GET_WAREHOUSE_DETAILS: 'company/:companyUniqueName/warehouse/:warehouseUniqueName/details',
    UPDATE_WAREHOUSE_STATUS: 'company/:companyUniqueName/warehouse/:warehouseUniqueName/status',
    CREATE: 'company/:companyUniqueName/warehouse',
    FETCH: 'company/:companyUniqueName/warehouse',
    UPDATE: 'company/:companyUniqueName/warehouse/:warehouseUniqueName'
};

export const WAREHOUSE_CONSTANTS = {
    DEFAULT_WAREHOUSE_NAME: 'Main Warehouse',
    MAX_WAREHOUSES: 50,
    MIN_WAREHOUSE_NAME_LENGTH: 3,
    MAX_WAREHOUSE_NAME_LENGTH: 100
};

export interface WarehouseRequest {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    isDefault?: boolean;
}

export interface WarehouseResponse {
    uniqueName?: string;
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    isDefault?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
