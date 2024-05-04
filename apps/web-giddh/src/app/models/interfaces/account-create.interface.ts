import { IAccountsInfo } from './account-info.interface';
import { IUserInfo } from './user-info.interface';
import { INameUniqueName } from '../api-models/Inventory';
import { IGstDetailListItem } from './gst-detail-list-item.interface';

export interface ICountryClass {
    countryName: string;
    countryCode: string;
}

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
    hsnNumber?: string;
    city?: string;
    pincode?: string;
    country?: ICountryClass;
    sacNumber?: string;
    stateCode?: string;
}

export interface IAccountCreate extends IAccount, IAccountsInfo {
    createdAt?: string;
    updatedAt?: string;
    updatedBy?: IUserInfo;
    attentionTo?: string;
    createdBy?: IUserInfo;
    parentGroups?: INameUniqueName[];
    applicableTaxes?: INameUniqueName[];
    isFixed?: boolean;
    yodleeAdded?: boolean;
    accountType?: string;
    state?: string;
    role?: INameUniqueName;
    email?: string;
}
