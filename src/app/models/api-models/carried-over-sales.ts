export class CarriedOverSalesRequest {
  public type: string = 'month';
  public value: string = 'mm-YYYY';
}

export interface TotalSales {
  invoiceCount: number;
  total: number;
  month: string;
}

export interface NewSales {
  invoiceCount: number;
  total: string;
  month: string;
}

export interface CarriedSales {
  invoiceCount: number;
  total: string;
  month: string;
}

export interface CarriedOverSalesResponse {
  totalSales: TotalSales[];
  newSales: NewSales[];
  carriedSales: CarriedSales[];
}
