import { IPagination } from './paginatedResponse.interface';
import { INameUniqueName } from '../api-models/Inventory';

export interface IStocksItem extends INameUniqueName {
    mappedPurchaseAccount: INameUniqueName;
    mappedSalesAccount: INameUniqueName;
    stockGroup: INameUniqueName;
    stockUnit: IStockUnitItem;
    date?: any;
    voucherNumber?: any;
    stockName?: any;
    manufacturingQuantity?: any;
    linkedStocks?: any;
    manufacturingUnit?: any;
    rate?: number;
    warehouse?: any;
}

/**
 * interface for stocks-unit
 * Used in unitytypes api call also in stocks-unit api call
 */
export interface IStockItem {
    name: string;
    code: string;
    uniqueName: string;
}

export interface IStockReportItem {
    amount: number;
    quantity: number;
    stockUnit: string;
}

export interface IStockTransaction extends IStockReportItem {
    account: INameUniqueName;
    closingQuantity: number;
    entryDate: string;
    isManufacturingTransaction: boolean;
    rate: number;
    type: string;
    voucherNo: number;
    voucherType: string;
}

export interface IStockReport extends IPagination {
    closingBalance: IStockReportItem;
    openingBalance: IStockReportItem;
    stockUnit: string;
    stockUnitQtyMap: any;
    transactions: IStockTransaction[];
}

export interface IUnitRateItem {
    stockUnitUniqueName?: any;
    rate: number;
    stockUnitCode: string;
}

export interface IAccountDetails {
    accountUniqueName: string;
    unitRates: IUnitRateItem[];
}

export class IStockItemDetail {
    public stockUniqueName: string;
    public quantity: number;
    public stockUnitCode: string;
    public stockUnitUniqueName?: string;
    public rate?: number;
    public amount?: number;
    public manufacturingUnit?: string;
}

export interface IManufacturingDetails {
    manufacturingUnitUniqueName?: any;
    manufacturingQuantity: number;
    manufacturingUnitCode: string;
    linkedStocks: IStockItemDetail[];
    date?: string;
    grandTotal?: string;
    otherExpenses?: any[]; // Not sure about this field so keeping it as any for now
    multipleOf?: number;
}

export interface IStockUnitItem extends IStockItem {
    hierarchicalQuantity: number;
    quantityPerUnit: number;
}

export interface IStockDetail extends INameUniqueName {
    manufacturingDetails: IManufacturingDetails;
    openingAmount: number;
    openingQuantity: number;
    purchaseAccountDetails?: IAccountDetails;
    salesAccountDetails?: IAccountDetails;
    stockGroup: INameUniqueName;
    stockUnit: IStockUnitItem;
    stockUnitCode?: string;
}

/**
 * interface for stock
 * Used in create stock api call
 */
export interface Istock extends INameUniqueName {
    manufacturingDetails: IManufacturingDetails;
    openingAmount: number;
    openingQuantity: number;
    purchaseAccountDetails?: IAccountDetails;
    salesAccountDetails?: IAccountDetails;
    stockUnitCode?: string;
    isFsStock: boolean;
}

/**
 * interface for stockUnit
 * Used in create stockunit create api call
 */
export interface IStockUnit extends IStockItem {
    parentStockUnit?: IStockItem;
    quantityPerUnit: number;
}

export interface IStockUnitResponse extends IStockItem, IStockUnit {
    hierarchicalQuantity: number;
}

export interface IInventory {
    amount: number;
    quantity: number;
    rate: number;
    stock: INameUniqueName;
    unit: IStockUnitResponse;
}
