export class CarriedOverSalesRequest {
  public type: string;
  public value: string;
}

export interface TotalSales {
  invoiceCount: number;
  total: number;
  month: string;
  uniqueCount: number;
}

export interface NewSales {
  invoiceCount: number;
  total: number;
  month: string;
  uniqueCount: number;
}

export interface CarriedSales {
  invoiceCount: number;
  total: number;
  month: string;
  uniqueCount: number;
}

export interface CarriedOverSalesResponse {
  totalSales: TotalSales;
  newSales: NewSales;
  carriedSales: CarriedSales[];
}
