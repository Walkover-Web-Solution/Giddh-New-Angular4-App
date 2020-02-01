import { CommonPaginatedRequest } from '../../../models/api-models/Invoice';

/** Purchase record model for update flow, model required to
 * to show the updated invoice data on preview screen
 */
export interface PurchaseRecordUpdateModel {
    invoiceNumber: string,
    purchaseRecordUniqueName: string,
    mergedRecordUniqueName: string
};

/**
 * Purchase record advance search request model
 *
 * @export
 * @class PurchaseRecordAdvanceSearch
 * @extends {CommonPaginatedRequest}
 */
export class PurchaseRecordAdvanceSearch extends CommonPaginatedRequest {
    public purchaseDate?: string;
    public purchaseDateOperation?: string;
    public grandTotal?: string;
    public grandTotalOperation?: string;
    public dueDate?: string;
    public dueDateOperation?: string;
    public q?: any;
};

/** Purchase record grand total operation for advance search */
export const PURCHASE_RECORD_GRAND_TOTAL_OPERATION = {
    GREATER_THAN: 'GREATER_THAN',
    GREATER_THAN_OR_EQUALS: 'GREATER_THAN_OR_EQUALS',
    LESS_THAN: 'LESS_THAN',
    LESS_THAN_OR_EQUALS: 'LESS_THAN_OR_EQUALS',
    EQUALS: 'EQUALS',
    NOT_EQUALS: 'NOT_EQUALS'
};

/** Purchase record date operation for advance search */
export const PURCHASE_RECORD_DATE_OPERATION = {
    ON: 'ON',
    AFTER: 'AFTER',
    BEFORE: 'BEFORE'
};

/** Purchase record due date operation for advance search */
export const PURCHASE_RECORD_DUE_DATE_OPERATION = {
    ON: 'ON',
    AFTER: 'AFTER',
    BEFORE: 'BEFORE'
};

/** Purchase record balance due operation for advance search */
export const PURCHASE_RECORD_BALANCE_DUE_OPERATION = {
    GREATER_THAN: 'GREATER_THAN',
    GREATER_THAN_OR_EQUALS: 'GREATER_THAN_OR_EQUALS',
    LESS_THAN: 'LESS_THAN',
    LESS_THAN_OR_EQUALS: 'LESS_THAN_OR_EQUALS',
    EQUALS: 'EQUALS',
    NOT_EQUALS: 'NOT_EQUALS'
};