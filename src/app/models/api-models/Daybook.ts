
    export interface DayBookApiModel {
        status: string;
        body: Body;
    }
    export interface Body {
        entries: Entry[];
        page: number;
        count: number;
        totalPages: number;
        totalItems: number;
        fromDate: string;
        toDate: string;
        creditTotal: number;
        debitTotal: number;
    }
    export interface Entry {
        uniqueName: string;
        voucher: string;
        particular: Particular;
        voucherNo: number;
        otherTransactions: OtherTransaction[];
        createdAt: string;
        entryDate: string;
        creditAmount?: number;
        debitAmount?: number;
    }
    export interface OtherTransaction {
        particular: Particular;
        amount: number;
        type: string;
    }
    export interface Particular {
        uniqueName: string;
        name: string;
    }



    





