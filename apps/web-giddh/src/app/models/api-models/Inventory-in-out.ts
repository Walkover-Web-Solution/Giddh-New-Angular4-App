import { INameUniqueName } from './Inventory';
import { IManufacturingDetails } from '../interfaces/stocks-item.interface';

/**
 * Stock interface definition
 * Defines the structure and contract for Stock objects
 */
export interface Stock {
    uniqueName: string;
}

/**
 * StockUnit interface definition
 * Defines the structure and contract for StockUnit objects
 */
export interface StockUnit {
    code: string;
}

/**
 * InventoryUser interface definition
 * Defines the structure and contract for InventoryUser objects
 */
export interface InventoryUser {
    name: string;
    uniqueName: string;
}

/**
 * EntityDetails interface definition
 * Defines the structure and contract for EntityDetails objects
 */
export interface EntityDetails {
    entity: string;
    uniqueName: string;
}


/**
 * Transaction interface definition
 * Defines the structure and contract for Transaction objects
 */
export interface Transaction {
    type: string;
    quantity: number;
    inventoryUser: InventoryUser;
    stock: Stock;
    entityDetails: EntityDetails,
    stockUnit: StockUnit;
    manufacturingDetails?: IManufacturingDetails;
}

/**
 * InventoryEntry interface definition
 * Defines the structure and contract for InventoryEntry objects
 */
export interface InventoryEntry {
    inventoryEntryDate?: string;
    transferProducts?: boolean;
    transferDate?: string;
    source?: {
        uniqueName: string;
        entity: string;
    };
    destination?: {
        uniqueName: string;
        entity: string;
    };
    product?: {
        uniqueName: string;
        entity: string;
    };
    transfers?: Transaction[];
    description?: string;
    transactions?: Transaction[];
    isManufactured?: boolean;
}

/**
 * InventoryFilter interface definition
 * Defines the structure and contract for InventoryFilter objects
 */
export interface InventoryFilter {
    page?: number,
    quantity?: number;
    quantityNotEquals?: boolean;
    quantityGreaterThan?: boolean;
    quantityLessThan?: boolean;
    quantityEqualTo?: boolean;
    includeSenders?: boolean;
    senders?: string[];
    includeReceivers?: boolean;
    receivers?: string[];
    sort?: string;
    sortBy?: string;
    advanceFilterOptions?: AdvanceFilterOptions;
    voucherType?: any[];
    jobWorkTransactionType?: any[];
    filterCategory?: string;
    filterAmount?: string;
    senderName?: string; // for search
    receiverName?: string; // for search
}
/**
 * AdvanceFilterOptions class
 * Implements AdvanceFilterOptions functionality
 */
export class AdvanceFilterOptions {
    public filterCategory?: string;
    public filterCategoryType?: string;
    public filterValueCondition?: string;
    public filterAmount?: string;
}

/**
 * InventoryReportTransactions interface definition
 * Defines the structure and contract for InventoryReportTransactions objects
 */
export interface InventoryReportTransactions {
    uniqueName: string;
    date: string;
    quantity: number;
    description: string;
    stockUnit: {
        name: string;
        code: string;
    };
    sender: INameUniqueName;
    receiver: INameUniqueName;
    closingQuantity: number;
    stock: INameUniqueName;
}

/**
 * InventoryReport interface definition
 * Defines the structure and contract for InventoryReport objects
 */
export interface InventoryReport {
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
    fromDate: string;
    toDate: string;
    stock: INameUniqueName;
    stockUnit: {
        name: string;
        code: string;
    };
    openingQuantity: number;
    closingQuantity: number;
    transactions: InventoryReportTransactions[];
}
