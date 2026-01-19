/**
 * IGetAllEbankAccountResponse interface definition
 * Defines the structure and contract for IGetAllEbankAccountResponse objects
 */
export interface IGetAllEbankAccountResponse {
    accounts: IEbankAccount[];
    siteId: number;
    siteName: string;
}

/**
 * IEbankAccount interface definition
 * Defines the structure and contract for IEbankAccount objects
 */
export interface IEbankAccount {
    loginId: string;
    reconnect: boolean;
    transactionDate: string;
    currencyCode: string;
    amount: number;
    accountId: number;
    linkedAccount?: any;
    accountNumber: string;
    name: string;
    isDatePickerOpen?: boolean;
    showAccList?: boolean;
    itemAccountId?: number;
    giddhAccount?: any;
    status?: string;
    providerAccount: { providerAccountId: number };
}

/**
 * IAccessTokenResponse interface definition
 * Defines the structure and contract for IAccessTokenResponse objects
 */
export interface IAccessTokenResponse {
    user: IAccessToken;
    rsession: string;
}

/**
 * IAccessToken interface definition
 * Defines the structure and contract for IAccessToken objects
 */
export interface IAccessToken {
    accessTokens: IAccessTokenObj[];
}

/**
 * IAccessTokenObj interface definition
 * Defines the structure and contract for IAccessTokenObj objects
 */
export interface IAccessTokenObj {
    appId: string;
    value: string;
    url: string;
}
