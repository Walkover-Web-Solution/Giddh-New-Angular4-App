import { INameUniqueName } from './Inventory';
import { IManufacturingDetails } from '../interfaces/stocks-item.interface';

export interface Stock {
    uniqueName: string;
}

export interface StockUnit {
    code: string;
}

export interface InventoryUser {
    name: string;
    uniqueName: string;
}

export interface EntityDetails {
    entity: string;
    uniqueName: string;
}


export interface Transaction {
    type: string;
    quantity: number;
    inventoryUser: InventoryUser;
    stock: Stock;
    entityDetails: EntityDetails,
    stockUnit: StockUnit;
    manufacturingDetails?: IManufacturingDetails;
}

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
export class AdvanceFilterOptions {
    public filterCategory?: string;
    public filterCategoryType?: string;
    public filterValueCondition?: string;
    public filterAmount?: string;
}

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
