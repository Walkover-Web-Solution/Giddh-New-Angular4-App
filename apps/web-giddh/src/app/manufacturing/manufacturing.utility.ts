export class MfStockSearchRequestClass {
    public product: string;
    public searchOperation: string;
    public searchBy: string;
    public searchValue: string;
    public from: string;
    public to: string;
    public count: number;
    public page: number;
    public branchUniqueName: string;
}

export class LinkedStocks {
    public stockUniqueName: string;
    public rate: number;
    public quantity: number;
    public amount: number;
}