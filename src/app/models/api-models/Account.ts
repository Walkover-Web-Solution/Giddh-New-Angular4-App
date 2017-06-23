import { IAccountCreate, IAccount } from '../interfaces/accountCreate.interface';
import { IGstDetailListItem } from '../interfaces/gstDetailListItem.interface';
import { IUserInfo } from '../interfaces/userInfo.interface';
import { INameUniqueName } from '../interfaces/nameUniqueName.interface';
import { IFlattenAccountsResultItem } from '../interfaces/flattenAccountsResultItem.interface';
import { IInheritedTaxes } from '../interfaces/inheritedTaxes.interface';

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
}

/*
 * Model for move account to a group api request
 * API:: (Move-account-to_group) company/:companyUniqueName/accounts/:accountUniqueName/move
 * its response will be success message in body
 */
export class AccountMoveRequest {
  public uniqueName: string;
}

/*
 * Model for share account api request
 * API:: (share account) company/:companyUniqueName/accounts/:accountUniqueName/share
 * its response will be success message in body
 */
export class ShareAccountRequest {
  public role: string;
  public user: string;
}

/*
 * Model for shared-with account to a group api request
 * API:: (share account) company/:companyUniqueName/accounts/:accountUniqueName/shared-with
 * response will be array of AccountSharedWithResponse
 */
export class AccountSharedWithResponse {
  public role: INameUniqueName;
  public userEmail: string;
  public userName: string;
  public userUniqueName: string;
}

/*
 * Model for flatten accounts api response
 * GET call
 * API:: (flatten accounts) company/:companyUniqueName/flatten-accounts?q=&refresh=
 * used to filter accounts while searching on right side searchbox of popup
 * you can pass query parameters in this as page, query as q and refresh and count which is sent 5
 * to get next 5 accounts
 * response will be hash as FlattenAccountsResponse
 */
export class FlattenAccountsResponse {
  public count: number;
  public page: number;
  public results: IFlattenAccountsResultItem[];
  public size: number;
  public totalItems: number;
  public totalPages: number;
}

/*
 * Model for tax-hierarchy api response
 * GET call
 * API:: (accounts tax-hierarchy) company/:companyUniqueName/accounts/:accountUniqueName/tax-hierarchy
 * response will be hash as AccountsTaxHierarchyResponse
 */
export class AccountsTaxHierarchyResponse {
  public applicableTaxes: INameUniqueName[];
  public inheritedTaxes: IInheritedTaxes[];
}
