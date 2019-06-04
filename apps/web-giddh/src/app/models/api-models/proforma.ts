import { CommonPaginatedResponse } from './BaseResponse';
import { InvoiceReceiptFilter } from './recipt';

export class ProformaFilter extends InvoiceReceiptFilter {
}

export class ProformaResponse extends CommonPaginatedResponse<ProformaItem> {
}

export class ProformaItem {
  public status: string;
  public customerName: string;
  public expiryDate: string;
  public proformaNumber: string;
  public grandTotal: number;
  public proformaDate: string;
  public action: string;
}

export class ProformaGetRequest {
  public estimateNumber?: string;
  public proformaNumber?: string;
  public accountUniqueName: string;
}
