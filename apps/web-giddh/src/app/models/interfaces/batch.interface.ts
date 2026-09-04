/** Selected batch line used on vouchers / ledger entries. */
export interface VoucherSelectedBatch {
    uniqueName: string;
    name?: string;
    batchNumber?: string;
    quantity: number;
    rate?: number;
    availableQuantity?: number;
    expiryDate?: string;
}

/** Input data for the batch select aside dialog. */
export interface BatchSelectDialogData {
    stockName: string;
    stockUniqueName: string;
    variantUniqueName?: string;
    variantName?: string;
    hasVariants?: boolean;
    inventoryType?: string;
    warehouseName?: string;
    warehouseUniqueName?: string;
    unitCode?: string;
    lineQuantity: number;
    selectedBatches: VoucherSelectedBatch[];
    currencySymbol?: string;
    localeData?: any;
    commonLocaleData?: any;
}

/** Result returned when the batch select aside closes with a selection. */
export interface BatchSelectDialogResult {
    batches: VoucherSelectedBatch[];
    allocatedQuantity: number;
    overrideLineQuantity?: boolean;
}
