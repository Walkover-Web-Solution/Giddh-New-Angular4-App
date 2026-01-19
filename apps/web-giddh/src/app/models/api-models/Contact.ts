/**
 * DueRangeRequest interface definition
 * Defines the structure and contract for DueRangeRequest objects
 */
export interface DueRangeRequest {
    range: string[];
}

/**
 * Interface for parameters required by getContactsEffect
 */
export interface GetContactsParams {
    fromDate: string;
    toDate: string;
    groupUniqueName: string;
    pageNumber: number;
    refresh: string;
    count: number;
    query?: string;
    sortBy?: string;
    order?: string;
    postData?: ContactAdvanceSearchModal;
    branchUniqueName?: string;
}


/**
 * DueAmountReportQueryRequest class
 * Implements DueAmountReportQueryRequest functionality
 */
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

/**
 * DueAmountReportRequest interface definition
 * Defines the structure and contract for DueAmountReportRequest objects
 */
export interface DueAmountReportRequest {
    totalDueAmountGreaterThan: boolean;
    totalDueAmountLessThan: boolean;
    totalDueAmountEqualTo: boolean;
    totalDueAmount: number;
    includeTotalDueAmount: boolean;
    name: string[];
}

/**
 * CurrentAndPastDueAmount interface definition
 * Defines the structure and contract for CurrentAndPastDueAmount objects
 */
export interface CurrentAndPastDueAmount {
    dueAmount: number;
    range: string;
}

/**
 * Result interface definition
 * Defines the structure and contract for Result objects
 */
export interface Result {
    name: string;
    groupName: string;
    totalDueAmount: number;
    futureDueAmount: number;
    currentAndPastDueAmount: CurrentAndPastDueAmount[];
}

/**
 * DueAmountReportResponse interface definition
 * Defines the structure and contract for DueAmountReportResponse objects
 */
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

/**
 * AgingDropDownoptions interface definition
 * Defines the structure and contract for AgingDropDownoptions objects
 */
export interface AgingDropDownoptions {
    fourth: number;
    fifth: number;
    sixth: number;
}

/**
 * ContactAdvanceSearchCommonModal class
 * Implements ContactAdvanceSearchCommonModal functionality
 */
export class ContactAdvanceSearchCommonModal {
    category: string;
    amountType: string;
    amount: number;
}

/**
 * ContactAdvanceSearchModal class
 * Implements ContactAdvanceSearchModal functionality
 */
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

/**
 * AgingAdvanceSearchModal class
 * Implements AgingAdvanceSearchModal functionality
 */
export class AgingAdvanceSearchModal {
    includeTotalDueAmount: boolean = false;
    totalDueAmountGreaterThan: boolean = false;
    totalDueAmountLessThan: boolean = false;
    totalDueAmountEqualTo: boolean = false;
    totalDueAmountNotEqualTo: boolean = false;
    totalDueAmount: number;
    name: string[];
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

/**
 * Send Bulk Email Template request model
 *
 * @export
 * @interface SendEmailTemplateRequest
 */
export interface SendBulkEmailTemplateRequest {
    customerVendorUniqueNames: string[];
    templateOf: string;
}
