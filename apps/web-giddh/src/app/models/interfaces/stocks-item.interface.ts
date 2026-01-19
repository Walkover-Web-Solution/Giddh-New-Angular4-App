import { IPagination } from './paginated-response.interface';
import { INameUniqueName } from '../api-models/Inventory';

/**
 * IStocksItem interface definition
 * Defines the structure and contract for IStocksItem objects
 */
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
    manufacturingUnitCode?: any;
    rate?: number;
    warehouse?: any;
    variant?: IStockItem;
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

/**
 * IStockReportItem interface definition
 * Defines the structure and contract for IStockReportItem objects
 */
export interface IStockReportItem {
    amount: number;
    quantity: number;
    stockUnit: string;
}

/**
 * IStockTransaction interface definition
 * Defines the structure and contract for IStockTransaction objects
 */
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

/**
 * IStockReport interface definition
 * Defines the structure and contract for IStockReport objects
 */
export interface IStockReport extends IPagination {
    closingBalance: IStockReportItem;
    openingBalance: IStockReportItem;
    stockUnit: string;
    stockUnitQtyMap: any;
    transactions: IStockTransaction[];
}

/**
 * IUnitRateItem interface definition
 * Defines the structure and contract for IUnitRateItem objects
 */
export interface IUnitRateItem {
    stockUnit?: any;
    stockUnitUniqueName?: any;
    rate: number;
    stockUnitCode?: any;
}

/**
 * IAccountDetails interface definition
 * Defines the structure and contract for IAccountDetails objects
 */
export interface IAccountDetails {
    accountUniqueName: string;
    unitRates: IUnitRateItem[];
}

/**
 * IStockItemDetail class
 * Implements IStockItemDetail functionality
 */
export class IStockItemDetail {
    public stockUniqueName: string;
    public quantity: number;
    public stockUnitCode: string;
    public stockUnitUniqueName?: string;
    public rate?: number;
    public amount?: number;
    public manufacturingUnit?: string;
}

/**
 * IManufacturingDetails interface definition
 * Defines the structure and contract for IManufacturingDetails objects
 */
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

/**
 * IStockUnitItem interface definition
 * Defines the structure and contract for IStockUnitItem objects
 */
export interface IStockUnitItem extends IStockItem {
    hierarchicalQuantity: number;
    quantityPerUnit: number;
}

/**
 * IStockDetail interface definition
 * Defines the structure and contract for IStockDetail objects
 */
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

/**
 * IStockUnitResponse interface definition
 * Defines the structure and contract for IStockUnitResponse objects
 */
export interface IStockUnitResponse extends IStockItem, IStockUnit {
    hierarchicalQuantity: number;
}

/**
 * IInventory interface definition
 * Defines the structure and contract for IInventory objects
 */
export interface IInventory {
    amount: number;
    quantity: number;
    rate: number;
    stock: INameUniqueName;
    unit: IStockUnitResponse;
}
