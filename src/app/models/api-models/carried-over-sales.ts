
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

export interface Body {
  totalSales: TotalSales[];
  newSales: NewSales[];
  carriedSales: CarriedSales[];

}

export interface CarriedOverSalesResponse {
  status: string;
  body: Body[];

}
