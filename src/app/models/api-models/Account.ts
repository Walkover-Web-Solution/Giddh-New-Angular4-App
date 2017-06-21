import { IAccountCreate, IAccount } from '../interfaces/accountCreate.interface';
import { IGstDetailListItem } from '../interfaces/gstDetailListItem.interface';
import { IUserInfo } from '../interfaces/userInfo.interface';
import { INameUniqueName } from '../interfaces/nameUniqueName.interface';

/**
 * Model for create account api response
 * API:: (create-account) /company/companyUniqueName/groups/:groupUniqueName:/accounts
 */
export class AccountResponse implements IAccountCreate {
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

/**
 * Model for create account api request
 * API:: (create-account) /company/companyUniqueName/groups/:groupUniqueName:/accounts
 */

export class AccountRequest implements IAccount {
  public address?: string;
  public attentionTo?: string;
  public companyName?: string;
  public description?: string;
  public email?: string;
  public mobileNo?: string;
  public openingBalance?: any;
  public openingBalanceDate?: string;
  public openingBalanceType?: string;
  public name: string;
  public uniqueName: string;
  public gstDetails?: IGstDetailListItem[];
  public hsnNumber: string;
  public city: string;
  public pincode: string;
  public country: string;
  public sacNumber: string;
  public stateCode: string;

  constructor(account: IAccount) {
      this.address = account.address;
      this.attentionTo = account.attentionTo;
      this.companyName = account.companyName;
      this.description = account.description;
      this.email = account.email;
      this.mobileNo = account.mobileNo;
      this.openingBalance = account.openingBalance;
      this.openingBalanceDate = account.openingBalanceDate;
      this.openingBalanceType = account.openingBalanceType;
      this.name = account.name;
      this.uniqueName = account.uniqueName;
      this.gstDetails = account.gstDetails;
      this.hsnNumber = account.hsnNumber;
      this.city = account.city;
      this.pincode = account.pincode;
      this.country = account.country;
      this.sacNumber = account.sacNumber;
      this.stateCode = account.stateCode;
  }
}

/**
 * Model for merge account api request
 * API:: (create-account) /company/{companyUniqueName}/accounts/{accountUniqueName}/merge
 * Takes an array of account uniquenames
 * This request will take array of AccountMergeRequest as payload
 * its response will be success message in body
 */
export class AccountMergeRequest {
  public uniqueName: string;

  constructor(acount: AccountMergeRequest) {
    this.uniqueName = acount.uniqueName;
  }
}

/**
 * Model for unmerge account api request
 * API:: (create-account) /company/{companyUniqueName}/accounts/{accountUniqueName}/un-merge
 * This request will take array of AccountUnMergeRequest as payload
 * its response will be success message in body
 */
export class AccountUnMergeRequest {
  public uniqueNames: string[];
  public moveTo: string;

  constructor(account: AccountUnMergeRequest) {
    this.uniqueNames = account.uniqueNames;
    this.moveTo = account.moveTo;
  }
}
