/** Nested stock/variant/warehouse identity returned by batch APIs. */
export interface BatchEntityRef {
    name?: string;
    uniqueName: string;
}

/** Warehouse-level quantities on a batch detail. */
export interface BatchWarehouseQuantity {
    warehouse?: BatchEntityRef;
    availableQuantity?: number;
    openingQuantity?: number;
    openingAmount?: number;
    rate?: number;
}

/** One row in the batch report list. */
export interface BatchReportItem {
    uniqueName: string;
    name: string;
    batchNumber: string;
    archive?: boolean;
    manufacturingDate?: string;
    expiryDate?: string;
    availableQuantity?: number;
    daysRemaining?: number;
    stock?: BatchEntityRef;
    variant?: BatchEntityRef;
    warehouse?: BatchEntityRef;
    openingQuantity?: number;
    rate?: number;
}

/** Paginated batch list response body. */
export interface BatchReportListBody {
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
    results: BatchReportItem[];
}

/** Filter payload for get-all batches. */
export interface BatchReportFilter {
    stockUniqueNames?: string[];
    variantUniqueNames?: string[];
    warehouseUniqueNames?: string[];
    batchUniqueNames?: string[];
    batchNumbers?: string[];
    withinDays?: number;
    expiredOnly?: boolean;
    categoryUniqueNames?: string[];
}

/** Create / update batch payload. */
export interface BatchSaveRequest {
    batchNumber: string;
    name: string;
    stock: BatchEntityRef;
    warehouse: BatchEntityRef;
    variant: BatchEntityRef;
    openingQuantity: number;
    rate: number;
    manufacturingDate?: string;
    expiryDate?: string;
    categoryUniqueNames?: string[];
}

/** Batch details response body used on the edit screen. */
export interface BatchDetails {
    uniqueName: string;
    name: string;
    batchNumber: string;
    archive?: boolean;
    manufacturingDate?: string;
    expiryDate?: string;
    availableQuantity?: number;
    daysRemaining?: number;
    stock?: BatchEntityRef;
    variant?: BatchEntityRef;
    warehouse?: BatchEntityRef;
    warehouses?: BatchWarehouseQuantity[];
    openingQuantity?: number;
    openingAmount?: number;
    rate?: number;
}
