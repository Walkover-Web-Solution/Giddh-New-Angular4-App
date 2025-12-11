/**
 * Placeholder types for commented imports during Angular 21 migration
 * These types provide temporary compatibility until modules are restored
 */

// Ledger related types
export interface BlankLedgerVM {
    [key: string]: any;
}

// Permission related types
export interface GetAllPermissionResponse {
    [key: string]: any;
}

// Purchase record related types
export interface PurchaseRecordUpdateModel {
    [key: string]: any;
}

// Warehouse related types
export namespace fromWarehouse {
    export interface WarehouseState {
        [key: string]: any;
    }

    export const warehouseReducer = (state: any, action: any) => state;
}

// Permission data service placeholder
export class PermissionDataService {
    [key: string]: any;
}

// Sales person service placeholder
export class SalesPersonService {
    [key: string]: any;
}

// Mobile number input component placeholder
export class MobileNumberInputComponent {
    [key: string]: any;
}
