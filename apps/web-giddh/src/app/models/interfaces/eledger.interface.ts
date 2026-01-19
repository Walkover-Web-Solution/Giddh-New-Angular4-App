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

/**
 * IEledgerTransaction interface definition
 * Defines the structure and contract for IEledgerTransaction objects
 */
export interface IEledgerTransaction {
    remarks: IEledgerTransactionRemarks;
    amount: number;
    type: string;
}
