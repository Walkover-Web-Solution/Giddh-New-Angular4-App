/**
 * MfStockSearchRequestClass class
 * Implements MfStockSearchRequestClass functionality
 */
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

/**
 * LinkedStocks class
 * Implements LinkedStocks functionality
 */
export class LinkedStocks {
    public stockUniqueName: string;
    public rate: number;
    public quantity: number;
    public amount: number;
}