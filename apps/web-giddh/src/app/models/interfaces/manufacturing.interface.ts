import { INameUniqueName } from '../api-models/Inventory';

// some common interface used in module everywhere
/**
 * IOnlyUniqueName interface definition
 * Defines the structure and contract for IOnlyUniqueName objects
 */
export interface IOnlyUniqueName {
    uniqueName: string;
    name?: string;
    defaultName?: string;
}

/**
 * IOnlyAmount interface definition
 * Defines the structure and contract for IOnlyAmount objects
 */
export interface IOnlyAmount {
    amount: number;
}

/**
 * IStockItem interface definition
 * Defines the structure and contract for IStockItem objects
 */
export interface IStockItem {
    stockName: string;
    stockUniqueName: string;
}

/**
 * IMfItem interface definition
 * Defines the structure and contract for IMfItem objects
 */
export interface IMfItem {
    manufacturingQuantity: number;
    manufacturingUnit: string;
}

/*
 * Model for get manufacturing item details
 */

/**
 * ICommonResponseOfManufactureItem interface definition
 * Defines the structure and contract for ICommonResponseOfManufactureItem objects
 */
export interface ICommonResponseOfManufactureItem extends IStockItem, IMfItem, IOnlyUniqueName {
    consumptionCost: number;
    costPerProduct: number;
    date: string;
    grandTotal: number;
    linkedStocks: ILinkedStock[];
    otherExpenses: OtherExpenses[];
    voucher: string;
    voucherNumber: number;
}

/**
 * ILinkedStock interface definition
 * Defines the structure and contract for ILinkedStock objects
 */
export interface ILinkedStock extends IOnlyAmount, IStockItem, IMfItem {
    rate: number;
}

/**
 * ITransaction interface definition
 * Defines the structure and contract for ITransaction objects
 */
export interface ITransaction extends IOnlyAmount {
    account: INameUniqueName;
    type: string;
}

/**
 * OtherExpenses interface definition
 * Defines the structure and contract for OtherExpenses objects
 */
export interface OtherExpenses extends IOnlyUniqueName {
    baseAccount: INameUniqueName;
    transactions: ITransaction[];
}

/**
 * IManufacturingUnqItemObj interface definition
 * Defines the structure and contract for IManufacturingUnqItemObj objects
 */
export interface IManufacturingUnqItemObj {
    stockUniqueName: string;
    manufacturingUniqueName: string;
}

/*
 * Model for create manufacturing item request
 */

/**
 * IManufacturingItemRequest interface definition
 * Defines the structure and contract for IManufacturingItemRequest objects
 */
export interface IManufacturingItemRequest {
    date: string;
    linkedStocks: ILinkedStockForCreate[];
    multipleOf?: number;
    manufacturingMultipleOf?: number;
    otherExpenses: IOtherExpensesForCreate[];
}

/**
 * ILinkedStockForCreate interface definition
 * Defines the structure and contract for ILinkedStockForCreate objects
 */
export interface ILinkedStockForCreate extends IStockItem {
    quantity: number;
    rate?: number;
    amount?: number;
    stockUnitCode?: string;
    manufacturingUnit?: string;
    manufacturingQuantity: number;
    stockUnitUniqueName?: string;
}

/**
 * Transaction interface definition
 * Defines the structure and contract for Transaction objects
 */
export interface Transaction extends IOnlyAmount {
    account: IOnlyUniqueName;
}

/**
 * IOtherExpensesForCreate interface definition
 * Defines the structure and contract for IOtherExpensesForCreate objects
 */
export interface IOtherExpensesForCreate {
    baseAccount: IOnlyUniqueName;
    transactions: Transaction[];
}

/**
 * ManufacturingItemRequest class
 * Implements ManufacturingItemRequest functionality
 */
export class ManufacturingItemRequest {
    public uniqueName?: string;
    public date: string;
    public stockUniqueName?: string;
    public quantity?: number;
    public multipleOf?: number;
    public linkedStocks: ILinkedStockForCreate[];
    public otherExpenses: IOtherExpensesForCreate[];
    public voucherNumber?: string;
    public manufacturingMultipleOf?: number;
    public warehouse?: any;
    public warehouseUniqueName?: any;
}

/*
 * Model for get stocks with rates and response of request
*/

/**
 * IMfStockSearchRequest interface definition
 * Defines the structure and contract for IMfStockSearchRequest objects
 */
export interface IMfStockSearchRequest {
    inventoryType?: string;
    product?: string;
    searchOperation?: string;
    searchBy?: string;
    searchValue?: string;
    from?: string;
    to?: string;
    count?: number;
    page?: number;
    dateRange?: Date[];
    branchUniqueName?: string;
    warehouseUniqueName?: any;
    productVariant?: string;
}