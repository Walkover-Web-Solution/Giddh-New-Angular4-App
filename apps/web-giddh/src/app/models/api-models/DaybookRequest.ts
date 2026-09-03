import { PAGINATION_LIMIT } from '../../app.constant';

export class DaybookQueryRequest {
    public q: string = '';
    public page: number = 1;
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
    haveToShowTaxBifurcation?: boolean;
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
    tagName?: string;
    fileType?: string;
    interval?: string;
    isExpanded?: boolean;
    columnsToExport?: any[];
    q?: any;
    tagNames?: any[];
    includeTag?: boolean;
    groupUniqueNames?: any;
    inventoryType?: string;
    attachmentExport?: boolean;
    voucherExport?: boolean;
    fileNameFormat?: string;
    ledgerView?: boolean;
    mergePdf?: boolean;
    copyTypes?: any[];
    showInAccountCurrency?: boolean;
    ledgerAdvanceFilter?: any;
    type?: string;
    groupBy?: string;
    selectAll?: boolean;
    accountUniqueNames?: string[];
    salesPersonUniqueNames?: string[];
    countryCodes?: string[];
    stateCodes?: string[];
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
    defaultVouchersLabel?: string;
    defaultTagsLabel?: string;
    defaultParticularsLabel?: string;
    includeTag?: boolean;
    salesPersonUniqueNames?: string[];
    selectAll?: boolean;
}

export interface Inventory {
    includeInventory: boolean;
    inventories: any[];
    defaultInventoriesLabel?: any[];
    selectAll?: boolean;
    quantity?: any;
    includeQuantity: boolean;
    quantityLessThan: boolean;
    quantityEqualTo: boolean;
    quantityGreaterThan: boolean;
    includeItemValue: boolean;
    itemValue?: any;
    itemValueLessThan: boolean;
    itemValueEqualTo: boolean;
    itemValueGreaterThan: boolean;
}
