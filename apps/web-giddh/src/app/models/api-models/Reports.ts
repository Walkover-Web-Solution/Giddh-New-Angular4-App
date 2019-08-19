/*
* Report Model to be iterated and displayed in tabular format
* */
export class ReportsModel {
  public particular: string ;
  public sales : number = 0;
  public returns: number = 0;
  public netSales : number = 0;
  public cumulative: number = 0;
  public reportType: string ;
}
/*
* Report Response Model to be bind with get sales report API
* */
export class ReportsResponseModel {
  public openingBalance: Balance;
  public creditTotal: number;
  public debitTotal : number;
  public closingBalance : Balance;
  public balance: Balance;
  public from: Date;
  public to: Date
}
/*
* Report Model to be sent in get sales report API
* */
export class ReportsRequestModel {
  public interval: string;
  public from: string;
  public to: string
}
export class Balance{
  public amount : number;
  public type : string;
}

