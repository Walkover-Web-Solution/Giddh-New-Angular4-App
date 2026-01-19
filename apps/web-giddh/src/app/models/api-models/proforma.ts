import { CommonPaginatedResponse } from './BaseResponse';
import { InvoiceReceiptFilter } from './recipt';
import { INameUniqueName } from '../interfaces/name-unique-name.interface';
import { CommonPaginatedRequest } from './Invoice';

/**
 * ProformaFilter class
 * Implements ProformaFilter functionality
 */
export class ProformaFilter extends InvoiceReceiptFilter {
    public estimateNumber: string;
    public proformaNumber: string;
}

/**
 * ProformaResponse class
 * Implements ProformaResponse functionality
 */
export class ProformaResponse extends CommonPaginatedResponse<ProformaItem | any> {
    items: any;
}

/**
 * ProformaItem class
 * Implements ProformaItem functionality
 */
export class ProformaItem {
    public status: string;
    public customerName: string;
    public customerUniqueName: string;
    public expiryDate: string;
    public proformaNumber: string;
    public estimateNumber: string;
    public grandTotal: number;
    public proformaDate: string;
    public estimateDate: string;
    public action: string;
    public isSelected?: boolean;
    public uniqueName?: string;
    public invoiceDate?: string;
    public expiredDays: number;
    public voucherDate: string;
    public grandTotalTooltipText?: string;
    public amount?: any;
}

/**
 * ProformaGetRequest class
 * Implements ProformaGetRequest functionality
 */
export class ProformaGetRequest {
    public estimateNumber?: string;
    public proformaNumber?: string;
    public accountUniqueName: string;
    public emailId?: string[];
}

/**
 * ProformaDownloadRequest class
 * Implements ProformaDownloadRequest functionality
 */
export class ProformaDownloadRequest extends ProformaGetRequest {
    fileType?: string;
}

/**
 * ProformaUpdateActionRequest class
 * Implements ProformaUpdateActionRequest functionality
 */
export class ProformaUpdateActionRequest extends ProformaGetRequest {
    action: string;
}

/**
 * ProformaGetAllVersionRequest class
 * Implements ProformaGetAllVersionRequest functionality
 */
export class ProformaGetAllVersionRequest extends CommonPaginatedRequest {
    public estimateNumber?: string;
    public proformaNumber?: string;
    public accountUniqueName: string;
}

/**
 * ProformaGetAllVersionsResponse class
 * Implements ProformaGetAllVersionsResponse functionality
 */
export class ProformaGetAllVersionsResponse extends CommonPaginatedResponse<ProformaVersionItem> {
}

/**
 * ProformaVersionItem class
 * Implements ProformaVersionItem functionality
 */
export class ProformaVersionItem {
    user: INameUniqueName;
    grandTotal: number;
    estimateDate: string;
    versionDate: string;
    versionNumber: string;
    action: string;
}

/**
 * PreviousInvoicesVm class
 * Implements PreviousInvoicesVm functionality
 */
export class PreviousInvoicesVm {
    versionNumber: string;
    account: INameUniqueName;
    grandTotal: any;
    date: string;
    uniqueName?: string;
}
