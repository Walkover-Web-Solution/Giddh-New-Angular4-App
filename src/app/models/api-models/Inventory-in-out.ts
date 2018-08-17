import { INameUniqueName } from './Inventory';
import { IManufacturingDetails } from '../interfaces/stocksItem.interface';

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

export interface Transaction {
  type: string;
  quantity: number;
  inventoryUser: InventoryUser;
  stock: Stock;
  stockUnit: StockUnit;
  manufacturingDetails?: IManufacturingDetails;
}

export interface InventoryEntry {
  inventoryEntryDate: string;
  description: string;
  transactions: Transaction[];
  isManufactured?: boolean;
}

export interface InventoryFilter {
  quantity?: number;
  quantityGreaterThan?: boolean;
  quantityLessThan?: boolean;
  quantityEqualTo?: boolean;
  includeSenders?: boolean;
  senders?: string[];
  includeReceivers?: boolean;
  receivers?: string[];
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
