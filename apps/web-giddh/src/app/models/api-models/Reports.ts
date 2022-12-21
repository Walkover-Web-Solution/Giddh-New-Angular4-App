/*
* Report Model to be iterated and displayed in tabular format
* */
export class ReportsModel {
    public particular: string;
    public sales: number = 0;
    public returns: number = 0;
    public taxTotal: number = 0;
    public discountTotal: number = 0;
    public tcsTotal: number = 0;
    public tdsTotal: number = 0;
    public netSales: number = 0;
    public cumulative: number = 0;
    public reportType: string;
    public from?: string;
    public to?: string;
    public interval?: string;
    public selectedMonth?: string;
}
/*
* Report Response Model to be bind with get sales report API
* */
export class ReportsResponseModel {
    public openingBalance: Balance;
    public creditTotal: number;
    public debitTotal: number;
    public closingBalance: Balance;
    public balance: Balance;
    public from: Date;
    public to: Date
}
/*
* Report Model to be sent in get sales report API
* */
export class ReportsRequestModel {
    public interval: string;
    public from: string;
    public to: string;
    public branchUniqueName?: string;
}
export class ReportsDetailedRequestFilter {
    public q?: string;
    public from: string;
    public to: string;
    public sort?: string;
    public sortBy?: string;
    public page?: number
    public count?: number
    public branchUniqueName?: string;
}
export class Balance {
    public amount: number;
    public type: string;
}

export interface Account {
    name: string;
    uniqueName: string;
}

export interface Stock {
    name: string;
    uniqueName: string;
}

export interface Unit {
    code: string;
    hierarchicalQuantity: number;
    parentStockUnit?: any;
    quantityPerUnit: number;
    displayQuantityPerUnit: number;
    name: string;
}

export interface Stocks {
    stock: Stock;
    quantity: number;
    amount: number;
    rate?: any;
    unit: Unit;
    warehouse?: any;
    stockLocation?: any;
    hsnNumber?: any;
    sacNumber?: any;
    skuCode?: any;
}

export interface Item {
    account: Account;
    voucherType: string;
    voucherNumber: string;
    creditTotal: number;
    debitTotal: number;
    type: string;
    uniqueName: string;
    discountTotal: number;
    taxTotal: number;
    tdsTotal: number;
    tcsTotal: number;
    stocks: Stocks[];
    roundOff?: any;
    netTotal: number;
    date: string;
}

export interface NetTotal {
    amount: number;
    type: string;
}

export interface SalesRegisteDetailedResponse {
    items: Item[];
    creditTotal: number;
    debitTotal: number;
    discountTotal: number;
    taxTotal: number;
    tdsTotal: number;
    tcsTotal: number;
    netTotal: NetTotal;
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
    from: string;
    to: string;
    quantityTotal: number;
    rateTotal: number;
}

export class PurchaseReportsModel {
    public particular: string;
    public purchase: number = 0;
    public returns: number = 0;
    public taxTotal: number = 0;
    public discountTotal: number = 0;
    public tcsTotal: number = 0;
    public tdsTotal: number = 0;
    public netPurchase: number = 0;
    public cumulative: number = 0;
    public reportType: string;
    public from?: string;
    public to?: string;
    public interval?: string;
    public selectedMonth?: string;
}

export interface PurchaseRegisteDetailedResponse {
    items: Item[];
    creditTotal: number;
    debitTotal: number;
    discountTotal: number;
    taxTotal: number;
    tdsTotal: number;
    tcsTotal: number;
    netTotal: NetTotal;
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
    from: string;
    to: string;
    quantityTotal: number;
    rateTotal: number;
}

/** Request object model for get all advance receipts API */
export interface GetAllAdvanceReceiptsRequest {
    companyUniqueName: string;
    sortBy?: string;
    page?: number;
    sort?: 'asc' | 'desc';
    count?: number;
    from?: string;
    to?: string;
    receiptNumber?: string;
    baseAccountName?: string;
    particularName?: string;
    invoiceNumber?: string;
    receiptTypes?: Array<string>;
    totalAmount?: number;
    totalAmountOperation?: string;
    unUsedAmount?: number
    unUsedAmountOperation?: string;
    branchUniqueName?: string;
}

/** Request object model for advance receipts summary API */
export interface AdvanceReceiptSummaryRequest {
    companyUniqueName: string;
    from?: string;
    to?: string;
    branchUniqueName?: string;
}

export class ColumnarResponseResult {
    entryId: number;
    accountId: number;
    date: string;
    baseAccount: string;
    address: string;
    voucherType: string;
    voucherNumber: string;
    voucherRefNo?: string;
    voucherRefDate: string;
    taxNumber: string;
    narration?: string;
    stockName?: any;
    quantity: string;
    stockUnitCode?: any;
    rate?: any;
    value?: any;
    grossTotal: string;
    balance?: any;
    accountNameAndAmountMap?: any;
    accountNameAndBalanceMap: any;
}

/** Request object model for payment summary API */
export interface PaymentSummaryRequest {
    companyUniqueName: string;
    from?: string;
    to?: string;
    branchUniqueName?: string;
}