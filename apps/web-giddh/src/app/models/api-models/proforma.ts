import { CommonPaginatedResponse } from './BaseResponse';
import { InvoiceReceiptFilter } from './recipt';
import { INameUniqueName } from '../interfaces/nameUniqueName.interface';
import { CommonPaginatedRequest } from './Invoice';

export class ProformaFilter extends InvoiceReceiptFilter {
    public estimateNumber: string;
    public proformaNumber: string;
}

export class ProformaResponse extends CommonPaginatedResponse<ProformaItem | any> {
    items: any;
}

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

export class ProformaGetRequest {
    public estimateNumber?: string;
    public proformaNumber?: string;
    public accountUniqueName: string;
    public emailId?: string[];
}

export class ProformaDownloadRequest extends ProformaGetRequest {
    fileType?: string;
}

export class ProformaUpdateActionRequest extends ProformaGetRequest {
    action: string;
}

export class ProformaGetAllVersionRequest extends CommonPaginatedRequest {
    public estimateNumber?: string;
    public proformaNumber?: string;
    public accountUniqueName: string;
}

export class ProformaGetAllVersionsResponse extends CommonPaginatedResponse<ProformaVersionItem> {
}

export class ProformaVersionItem {
    user: INameUniqueName;
    grandTotal: number;
    estimateDate: string;
    versionDate: string;
    versionNumber: string;
    action: string;
}

export class PreviousInvoicesVm {
    versionNumber: string;
    account: INameUniqueName;
    grandTotal: any;
    date: string;
    uniqueName?: string;
}
