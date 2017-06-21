import { IAccountsInfo } from './accountInfo.interface';
import { IUserInfo } from './userInfo.interface';
import { INameUniqueName } from './nameUniqueName.interface';
import { IGstDetailListItem } from './gstDetailListItem.interface';

export interface IAccount extends INameUniqueName {
    address?: string;
    attentionTo?: string;
    companyName?: string;
    description?: string;
    email?: string;
    mobileNo?: string;
    openingBalance?: any;
    openingBalanceDate?: string;
    openingBalanceType?: string;
    gstDetails?: IGstDetailListItem[];
}

export interface IAccountCreate extends IAccount, IAccountsInfo {
    city?: string;
    pincode?: string;
    country?: string;
    createdAt?: string;
    updatedAt?: string;
    updatedBy?: IUserInfo;
    sacNumber?: string;
    attentionTo?: string;
    stateCode?: string;
    createdBy?: IUserInfo;
    parentGroups?: INameUniqueName[];
    applicableTaxes?: INameUniqueName[];
    isFixed?: boolean;
    yodleeAdded?: boolean;
    accountType?: string;
    hsnNumber?: string;
    state?: string;
    role?: INameUniqueName;
}
