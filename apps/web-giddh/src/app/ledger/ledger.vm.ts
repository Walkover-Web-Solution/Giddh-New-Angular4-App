export class BlankLedgerVM {
    public uniqueName?: string;
    public name?: string;
    public openingBalance?: number;
    public closingBalance?: number;
    public debitTotal?: number;
    public creditTotal?: number;
    public forwardedBalance?: {
        amount?: number;
        type?: string;
    };
    public transactions?: any[];
    public accountDetails?: any;
    public baseCurrencyToDisplay?: any;
    public foreignCurrencyToDisplay?: any;
    public otherTaxModal?: any;

    constructor() {
        this.uniqueName = '';
        this.name = '';
        this.openingBalance = 0;
        this.closingBalance = 0;
        this.debitTotal = 0;
        this.creditTotal = 0;
        this.forwardedBalance = {
            amount: 0,
            type: 'DEBIT'
        };
        this.transactions = [];
        this.accountDetails = null;
    }
}

export interface LedgerResponse {
    body?: BlankLedgerVM;
    status?: string;
    queryString?: any;
}

export interface LedgerRequest {
    accountUniqueName?: string;
    from?: string;
    to?: string;
    sort?: string;
    page?: number;
    count?: number;
}
