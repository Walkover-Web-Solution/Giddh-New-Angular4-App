import { IUserInfo } from './/user-info.interface';
import { ILedgerTransactionItem } from './ledger.interface';

/**
 * interface for logs request
 */
export interface ILogRequest {
    fromDate?: string;
    toDate?: string;
    operation: string;
    userUniqueName: string;
    accountUniqueName?: string;
    groupUniqueName?: string;
    entryDate?: string;
    logDate?: string;
    entity: string;
}

/**
 * interface for logs response
 */
export interface ILogsItem {
    createdAt: string;
    accountName: string;
    accountUniqueName: string;
    groupUniqueName: string;
    user: IUserInfo;
    operationType: string;
    entityType: string;
    ledgerUniqueName: string;
    companyUniqueName: string;
    companyName: string;
    log: ILogConcise;
    groupName: string;
}

export interface ILogConcise {
    logo?: ILogo;
    company?: ICompany;
    account?: IAccount;
    uniqueName: string;
    description?: string;
    tag?: string;
    voucherType: string;
    voucherNo: number;
    entryDate: string;
    sharedWith: IUser;
    transactions: ILedgerTransactionItem[];
    old: IOld;
    updated: IOld;
}

interface ILogo {
    path: string;
}

interface ICompany {
    name: string;
    data: any[];
}

interface IAccount {
    name: string;
    uniqueName: string;
    data: string[];
    attentionTo: string;
    email: string;
    mobileNumber: string;
}

interface IUser {
    name: string;
    email: string;
    uniqueName: string;
}

interface IOld {
    openingBalance: string;
    openingBalanceDate: string;
    uniqueName: string;
    description?: string;
    tag?: any;
    voucherType?: any;
    voucherNo?: number;
    entryDate?: string;
    transactions?: ITransaction[];
    name?: string;
    address?: string;
    currency?: ICurrency;
    city?: string;
    contactNo?: string;
    country?: string;
    email?: string;
    pincode?: string;
    state?: string;
}

interface ICurrency {
    code: string;
}

interface ITransaction {
    particular: IParticular;
    amount: number;
    type: string;
    inventory: IInventory | null;
    isTax: boolean;
    isBaseAccount: boolean;
}

interface IInventory {
    stock: IParticular;
    quantity: number;
    amount: number;
    rate: number;
    unit: IUnit;
}

interface IUnit {
    code: string;
    name: string;
}

interface IParticular {
    name: string;
    uniqueName: string;
}
