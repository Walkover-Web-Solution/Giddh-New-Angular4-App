export class IMagicLinkLedgerResponse {
    public ledgerTransactions: LedgerTransactions;
    public account: {
        uniqueName: string;
        name: string;
    };
    public companyName: string;
    public fromDate: string;
    public toDate: string;
}

export interface IMagicLinkLedgerRequest {
    data: Model;
}

interface Model {
    id: string;
    from?: string;
    to?: string;
}

interface LedgerTransactions {
    forwardedBalance: ForwardedBalance;
    creditTotal: number;
    debitTotal: number;
    balance: Balance;
    ledgers: any[];
    totalTransactions: number;
    totalCreditTransactions: number;
    totalDebitTransactions: number;
}

interface Balance {
    amount: number;
    type: string;
}

interface ForwardedBalance {
    amount: number;
    type: string;
    description: string;
}
