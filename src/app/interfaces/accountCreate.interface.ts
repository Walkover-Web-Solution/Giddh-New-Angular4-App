import { IAccountsInfo } from './accountInfo.interface';
import { IUserInfo } from './userInfo.interface';
import { INameUniqueName } from './nameUniqueName.interface';
import { IGstDetailListItem } from './gstDetailListItem.interface';

export interface IAccount extends IAccountsInfo {
    gstDetails: IGstDetailListItem[];
    city?: string;
    pincode?: string;
    email: string;
    country?: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: IUserInfo;
    mobileNo: string;
    sacNumber?: string;
    attentionTo: string;
    stateCode?: string;
    createdBy: IUserInfo;
    companyName: string;
    parentGroups: INameUniqueName[];
    openingBalanceDate: string;
    applicableTaxes: INameUniqueName[];
    isFixed: boolean;
    yodleeAdded: boolean;
    accountType?: string;
    hsnNumber?: string;
    openingBalanceType: string;
    openingBalance: number;
    state?: string;
    description?: string;
    address: string;
    role: INameUniqueName;
}
