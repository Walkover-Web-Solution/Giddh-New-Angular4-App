import { CommonPaginatedResponse } from './BaseResponse';
import { InvoiceReceiptFilter } from './recipt';

export class ProformaFilter extends InvoiceReceiptFilter {
}

export class ProformaResponse extends CommonPaginatedResponse<ProformaItem> {
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
  public expiredDays: number;
}

export class ProformaGetRequest {
  public estimateNumber?: string;
  public proformaNumber?: string;
  public accountUniqueName: string;
}

export class ProformaDownloadRequest extends ProformaGetRequest {
  fileType?: string;
}

export class ProformaUpdateActionRequest extends ProformaGetRequest {
  action: string;
}

export class EstimateGetVersionByVersionNoRequest extends ProformaGetRequest {
  estimateVersionNumber: string;
}
