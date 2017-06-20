import { IAccount } from '../../interfaces/accountCreate.interface';
import { IGstDetailListItem } from '../../interfaces/gstDetailListItem.interface';
import { IUserInfo } from '../../interfaces/userInfo.interface';
import { INameUniqueName } from '../../interfaces/nameUniqueName.interface';

export class Account implements IAccount {
    public gstDetails: IGstDetailListItem[];
    public city?: string;
    public pincode?: string;
    public email: string;
    public country?: string;
    public createdAt: string;
    public updatedAt: string;
    public updatedBy: IUserInfo;
    public mobileNo: string;
    public sacNumber?: string;
    public attentionTo: string;
    public stateCode?: string;
    public createdBy: IUserInfo;
    public companyName: string;
    public parentGroups: INameUniqueName[];
    public openingBalanceDate: string;
    public applicableTaxes: INameUniqueName[];
    public isFixed: boolean;
    public yodleeAdded: boolean;
    public accountType?: string;
    public hsnNumber?: string;
    public openingBalanceType: string;
    public openingBalance: number;
    public state?: string;
    public description?: string;
    public address: string;
    public role: INameUniqueName;
    public stocks?: any[];
    public mergedAccounts: string;
    public uniqueName: string;
    public name: string;

    constructor(gstDetails: IGstDetailListItem[], city: string, pincode: string, email: string,
                country: string, createdAt: string, updatedAt: string, updatedBy: IUserInfo,
                mobileNo: string, sacNumber: string, attentionTo: string, stateCode: string,
                createdBy: IUserInfo, companyName: string, parentGroups: INameUniqueName[],
                openingBalanceDate: string, applicableTaxes: INameUniqueName[], isFixed: boolean,
                yodleeAdded: boolean, accountType: string, hsnNumber: string, state: string,
                openingBalanceType: string, openingBalance: number, description: string,
                address: string, role: INameUniqueName, stocks: any[], mergedAccounts: string,
                uniqueName: string, name: string) {
    this.gstDetails = gstDetails;
    this.city = city;
    this.pincode = pincode;
    this.email = email;
    this.country = country;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.mobileNo = mobileNo;
    this.sacNumber = sacNumber;
    this.attentionTo = attentionTo;
    this.stateCode = stateCode;
    this.createdBy = createdBy;
    this.companyName = companyName;
    this.parentGroups = parentGroups;
    this.openingBalanceDate = openingBalanceDate;
    this.applicableTaxes = applicableTaxes;
    this.isFixed = isFixed;
    this.yodleeAdded = yodleeAdded;
    this.accountType = accountType;
    this.hsnNumber = hsnNumber;
    this.openingBalanceType = openingBalanceType;
    this.openingBalance = openingBalance;
    this.state = state;
    this.description = description;
    this.address = address;
    this.role = role;
    this.stocks = stocks;
    this.mergedAccounts = mergedAccounts;
    this.uniqueName = uniqueName;
    this.name = name;
    }
}
