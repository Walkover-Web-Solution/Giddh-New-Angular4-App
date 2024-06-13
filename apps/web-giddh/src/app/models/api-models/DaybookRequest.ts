import { PAGINATION_LIMIT } from '../../app.constant';

export class DaybookQueryRequest {
    public q: string = '';
    public page: number = 0;
    public count: number = PAGINATION_LIMIT;
    public from: string = '';
    public to: string = '';
    public format: 'pdf' | 'xlsx' = 'pdf';
    public type: string = 'admin-condensed';
    public sort: 'asc' | 'desc' = 'asc';
    public branchUniqueName: string;
}

export class ExportBodyRequest {
    from?: string;
    to?: string;
    sort?: string;
    showVoucherNumber?: boolean;
    showVoucherTotal?: boolean;
    showEntryVoucher?: boolean;
    showEntryVoucherNo?: boolean;
    showDescription?: boolean;
    groupUniqueName?: string;
    accountUniqueName?: string;
    exportType?: string;
    branchUniqueName?: string;
    fileType?: string;
    tagName?: string;
    interval?: string;
    isExpanded?: boolean;
    columnsToExport?: any[];
    q?: any;
    tagNames?: any[];
    includeTag?: boolean;
    groupUniqueNames?: any;
}

export interface DayBookRequestModel {
    amountLessThan: boolean;
    includeAmount: boolean;
    amountEqualTo: boolean;
    amountGreaterThan: boolean;
    amount: string;
    includeParticulars: boolean;
    includeVouchers: boolean;
    chequeNumber: string;
    dateOnCheque: string;
    particulars: any[];
    vouchers: any[];
    inventory: Inventory;
    tags?: any[];
}

export interface Inventory {
    includeInventory: boolean;
    inventories: any[];
    quantity?: any;
    includeQuantity: boolean;
    quantityLessThan: boolean;
    quantityEqualTo: boolean;
    quantityGreaterThan: boolean;
    includeItemValue: boolean;
    itemValue?: any;
    includeItemLessThan: boolean;
    includeItemEqualTo: boolean;
    includeItemGreaterThan: boolean;
}
