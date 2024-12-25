export interface DueRangeRequest {
    range: string[];
}

export class DueAmountReportQueryRequest {
    public q: string = '';
    public from?: string = '';
    public to?: string = '';
    public page: number = 0;
    public count: number = 20;
    public sortBy: string = 'name';
    public sort: 'asc' | 'desc' = 'asc';
    public rangeCol: number = 0;
}

export interface DueAmountReportRequest {
    totalDueAmountGreaterThan: boolean;
    totalDueAmountLessThan: boolean;
    totalDueAmountEqualTo: boolean;
    totalDueAmount: number;
    includeTotalDueAmount: boolean;
    name: string[];
}

export interface CurrentAndPastDueAmount {
    dueAmount: number;
    range: string;
}

export interface Result {
    name: string;
    groupName: string;
    totalDueAmount: number;
    futureDueAmount: number;
    currentAndPastDueAmount: CurrentAndPastDueAmount[];
}

export interface DueAmountReportResponse {
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
    results: Result[];
    size: number;
    overAllDueAmount?: number;
    overAllFutureDueAmount?: number;
}

export interface AgingDropDownoptions {
    fourth: number;
    fifth: number;
    sixth: number;
}

export class ContactAdvanceSearchCommonModal {
    category: string;
    amountType: string;
    amount: number;
}

export class ContactAdvanceSearchModal {
    openingBalance: number;
    openingBalanceType: string;
    openingBalanceGreaterThan: boolean;
    openingBalanceLessThan: boolean;
    openingBalanceEqual: boolean;
    closingBalance: number;
    closingBalanceType: string;
    closingBalanceGreaterThan: boolean;
    closingBalanceLessThan: boolean;
    closingBalanceEqual: boolean;
    creditTotal: number;
    creditTotalGreaterThan: boolean;
    creditTotalLessThan: boolean;
    creditTotalEqual: boolean;
    debitTotal: number;
    debitTotalGreaterThan: boolean;
    debitTotalLessThan: boolean;
    debitTotalEqual: boolean;
    openingBalanceNotEqual: boolean;
    closingBalanceNotEqual: boolean;
    creditTotalNotEqual: boolean;
    debitTotalNotEqual: boolean;
}

export class AgingAdvanceSearchModal {
    includeTotalDueAmount: boolean = false;
    totalDueAmountGreaterThan: boolean = false;
    totalDueAmountLessThan: boolean = false;
    totalDueAmountEqualTo: boolean = false;
    totalDueAmountNotEqualTo: boolean = false;
    totalDueAmount: number;
    name: string[];
}

export class CustomerVendorFiledFilter {
    public selectAll: boolean = false;
    public parentGroup: boolean = false;
    public contact: boolean = false;
    public state: boolean = false;
    public gstin: boolean = false;
    public comment: boolean = false;
    public openingBalance: boolean = false;

}

/**
 * bulk update request
 *
 * @export
 * @class BulkUpdateInvoice
 */
export class BulkUpdateInvoice {
    voucherNumbers: string[];
    voucherType: string;
}

/**
 * Bulk update invoices shipping details in all invoices request model
 *
 * @export
 * @interface BulkUpdateShippingDetails
 */
export interface BulkUpdateShippingDetails {
    gstNumber: string;
    address: string[];
    stateCode: string;
    stateName: string;
    panNumber: string;
}
/**
 * *  Bulk update invoices Notes in all invoices request model
 *
 * @export
 * @class BulkUpdateInvoiceNote
 * @extends {BulkUpdateInvoice}
 */
export class BulkUpdateInvoiceNote extends BulkUpdateInvoice {
    message1?: string = '';
    message2: string = '';
}

/**
 *  Bulk update invoices Templates type in all invoices request model
 *
 * @export
 * @class BulkUpdateInvoiceTemplates
 * @extends {BulkUpdateInvoice}
 */
export class BulkUpdateInvoiceTemplates extends BulkUpdateInvoice {
    templateUniqueName: string;
}
/**
 *
 * Bulk update invoices ImageSignature field in all invoices request model
 *
 * @export
 * @class BulkUpdateInvoiceImageSignature
 * @extends {BulkUpdateInvoice}
 */
export class BulkUpdateInvoiceImageSignature extends BulkUpdateInvoice {
    imageSignatureUniqueName: string;
}
/**
 * Bulk update invoices Slogan field in all invoices request model
 *
 * @export
 * @class BulkUpdateInvoiceSlogan
 * @extends {BulkUpdateInvoice}
 */
export class BulkUpdateInvoiceSlogan extends BulkUpdateInvoice {
    slogan: string = '';
}
/**
 * * Bulk update invoices DueDates field in all invoices request model
 *
 * @export
 * @class BulkUpdateInvoiceDueDates
 * @extends {BulkUpdateInvoice}
 */
export class BulkUpdateInvoiceDueDates extends BulkUpdateInvoice {
    dueDate: string;
}
/**
 * Bulk update invoices ShippingDetails field in all invoices request model
 *
 *
 * @export
 * @class BulkUpdateInvoiceShippingDetails
 */
export class BulkUpdateInvoiceShippingDetails {
    shippingDetails: BulkUpdateShippingDetails;
}
/**
 * Bulk update invoices custom field in all invoices request model
 *
 * @export
 * @class BulkUpdateInvoiceCustomfields
 */
export class BulkUpdateInvoiceCustomfields {
    customField1: string = '';
    customField2: string = '';
    customField3: string = '';
}

