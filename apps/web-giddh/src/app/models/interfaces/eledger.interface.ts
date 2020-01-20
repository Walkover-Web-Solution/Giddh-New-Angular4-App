/**
 * interface used in transaction item everywhere
 */
export interface IEledgerTransactionRemarks {
    description?: string;
    method?: string;
    email?: any;
    name?: any;
    chequeNumber?: any;
}

export interface IEledgerTransaction {
    remarks: IEledgerTransactionRemarks;
    amount: number;
    type: string;
}
