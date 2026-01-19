import { IUserInfo } from './user-info.interface';
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

/**
 * ILogConcise interface definition
 * Defines the structure and contract for ILogConcise objects
 */
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

/**
 * ILogo interface definition
 * Defines the structure and contract for ILogo objects
 */
interface ILogo {
    path: string;
}

/**
 * ICompany interface definition
 * Defines the structure and contract for ICompany objects
 */
interface ICompany {
    name: string;
    data: any[];
}

/**
 * IAccount interface definition
 * Defines the structure and contract for IAccount objects
 */
interface IAccount {
    name: string;
    uniqueName: string;
    data: string[];
    attentionTo: string;
    email: string;
    mobileNumber: string;
}

/**
 * IUser interface definition
 * Defines the structure and contract for IUser objects
 */
interface IUser {
    name: string;
    email: string;
    uniqueName: string;
}

/**
 * IOld interface definition
 * Defines the structure and contract for IOld objects
 */
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

/**
 * ICurrency interface definition
 * Defines the structure and contract for ICurrency objects
 */
interface ICurrency {
    code: string;
}

/**
 * ITransaction interface definition
 * Defines the structure and contract for ITransaction objects
 */
interface ITransaction {
    particular: IParticular;
    amount: number;
    type: string;
    inventory: IInventory | null;
    isTax: boolean;
    isBaseAccount: boolean;
}

/**
 * IInventory interface definition
 * Defines the structure and contract for IInventory objects
 */
interface IInventory {
    stock: IParticular;
    quantity: number;
    amount: number;
    rate: number;
    unit: IUnit;
}

/**
 * IUnit interface definition
 * Defines the structure and contract for IUnit objects
 */
interface IUnit {
    code: string;
    name: string;
}

/**
 * IParticular interface definition
 * Defines the structure and contract for IParticular objects
 */
interface IParticular {
    name: string;
    uniqueName: string;
}
