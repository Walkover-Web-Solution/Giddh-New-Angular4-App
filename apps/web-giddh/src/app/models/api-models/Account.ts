import { IAccount, IAccountCreate, ICountryClass } from '../interfaces/accountCreate.interface';
import { IGstDetailListItem } from '../interfaces/gstDetailListItem.interface';
import { IUserInfo } from '../interfaces/userInfo.interface';
import { INameUniqueName } from './Inventory';
import { IFlattenAccountsResultItem } from '../interfaces/flattenAccountsResultItem.interface';
import { IInheritedTaxes } from '../interfaces/inheritedTaxes.interface';
import { IPaginatedResponse } from '../interfaces/paginatedResponse.interface';
import { IDiscountList } from './SettingsDiscount';
import { StateList } from './Company';

/**
 * Model for create account api response
 * API:: (create-account) /company/companyUniqueName/groups/:groupUniqueName:/accounts
 * same model can be use in v2 api here are the details
 * missing keys - gstDetails, state, stateCode, address
 * new keys - [addresses] will be an array of IAccountAddress
 */
export class AccountResponse implements IAccountCreate {
    public gstDetails?: IGstDetailListItem[];
    public stateCode?: string;
    public state?: string;
    public city?: string;
    public address?: string;
    public addresses?: IAccountAddress[];
    public pincode?: string;
    public email: string;
    public country?: ICountryClass;
    public createdAt: string;
    public updatedAt: string;
    public updatedBy: IUserInfo;
    public mobileNo: string;
    public sacNumber?: string;
    public attentionTo: string;
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
    public description?: string;
    public role: INameUniqueName;
    public stocks?: any[];
    public mergedAccounts: string;
    public uniqueName: string;
    public name: string;
    public isComposite?: boolean;
    public currency?: string;
    public currencySymbol?: string;
    public inheritedDiscounts: any[];
    public applicableDiscounts?: any[];
    public category?: string;
    public otherApplicableTaxes?: any[];
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
    public country: any;
    public state?: string;
    public sacNumber: string;
    public stateCode: string;
    public isComposite?: boolean;

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
    public moveTo?: string;
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
export class FlattenAccountsResponse implements IPaginatedResponse {
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

export class IAccountAddress {
    public gstNumber: string;
    public address: string;
    public state: StateList;
    public stateCode: string;
    public isDefault: boolean;
    public isComposite: boolean;
    public partyType: string;
    public stateCodeName: string;
}
export class AccountRequestV2 {
    public addresses: IAccountAddress[];
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
    public hsnNumber: string;
    public country: { countryCode: string };
    public sacNumber: string;
    public mobileCode?: string;
    public accountBankDetails?: AccountBankDetails[];
    public currency?: string;
    public applicableDiscounts?: any[];
    public inheritedDiscounts?: any[];
    public customFields?: CustomFieldsData[];
}

export class AccountResponseV2 {
    public name: string;
    public country: { countryCode: string, countryName: string };
    public stocks?: any[];
    public hsnNumber?: string;
    public openingBalanceDate?: string;
    public applicableTaxes: INameUniqueName[];
    public isFixed: boolean;
    public yodleeAdded: boolean;
    public accountType: any;
    public mobileNo: string;
    public sacNumber?: string;
    public attentionTo: string;
    public openingBalanceType: string;
    public openingBalance: number;
    public companyName: string;
    public parentGroups: INameUniqueName[];
    public description?: string;
    public role: INameUniqueName;
    public email: string;
    public mergedAccounts: string;
    public createdAt: string;
    public createdBy: IUserInfo;
    public updatedAt: string;
    public updatedBy: IUserInfo;
    public city?: string;
    public pincode?: string;
    public uniqueName: string;
    public addresses: IAccountAddress[];
    public accountBankDetails: AccountBankDetails[];
    public cashFreeVirtualAccountData: CashFreeVirtualAccount;
    public closingBalanceTriggerAmount: number;
    public closingBalanceTriggerAmountType: string;
    public discounts?: IDiscountList[];
    public currencySymbol?: string;
    public currency?: string;
    public applicableDiscounts?: any[];
    public inheritedDiscounts: any[];
    public customFields?: CustomFieldsData[];
    public category?: string;
    public otherApplicableTaxes?: any[];
}

/*
 * Model for share Account, Group, company
 * POST call
 * API:: company/:companyUniqueName/role/:roleUniqueName/assign
 */
export class ShareEntityRequest {
    public emailId: string;
    public entity: string;
    public entityUniqueName: string;
}

export class AccountBankDetails {
    public bankName?: string;
    public bankAccountNo: string;
    public ifsc: string;
}

export class CashFreeVirtualAccount {
    public name: string;
    public virtualAccountNumber: string;
    public ifscCode: string;
}

export class AddAccountRequest {
    activeGroupUniqueName: string;
    accountRequest: AccountRequestV2
}

export class UpdateAccountRequest {
    accountRequest: AccountRequestV2;
    value: {
        groupUniqueName: string;
        accountUniqueName: string;
    }
}

export class CustomFieldsData {
    uniqueName: string;
    value: AccountRequestV2
    isMandatory?: boolean;
}
