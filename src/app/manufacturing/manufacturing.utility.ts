
export class MfStockSearchRequestClass {
  public product: string;
  public searchOperation: string;
  public searchBy: string;
  public searchValue: string;
  public from: string;
  public to: string;
}

/*
product( string: uniquename stock ) ,
searchOperation(greaterThan , lessThan, greaterThanOrEquals, lessThanOrEquals, equals),
searchBy (quantityInward , quantityOutward, voucherNumber),
searchValue( any integer number),
from (date string),
to(date string)
*/
