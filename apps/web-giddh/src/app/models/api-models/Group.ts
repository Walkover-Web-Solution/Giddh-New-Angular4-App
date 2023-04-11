import { ICreateGroup } from '../interfaces/group-create.interface';
import { INameUniqueName } from './Inventory';
import { IUserInfo } from '../interfaces//user-info.interface';
import { IGroup } from '../interfaces/group.interface';
import { IAccountsInfo } from '../interfaces/account-info.interface';
import { IFlattenGroupsAccountsDetail } from '../interfaces/flatten-groups-accounts-detail.interface';
import { IInheritedTaxes } from '../interfaces/inherited-taxes.interface';
import { IPaginatedResponse } from '../interfaces/paginated-response.interface';

/**
 * Model for create group api response
 * API:: (create-group) /company/companyUniqueName/groups
 */

export class GroupResponse implements ICreateGroup {
    public applicableTaxes: INameUniqueName[];
    public description?: string;
    public fixed: boolean;
    public groups: ICreateGroup[];
    public hsnNumber?: string;
    public name: string;
    public role: INameUniqueName;
    public ssnNumber?: string;
    public synonyms?: string;
    public uniqueName: string;
    public createdAt: string;
    public createdBy: IUserInfo;
    public updatedAt: string;
    public updatedBy: IUserInfo;
    public closingBalanceTriggerAmount: number;
    public closingBalanceTriggerAmountType: string;
    public applicableDiscounts?: any[];
    public parentGroups?: any;
    public inheritedDiscounts?: any;
    public category?: string;
}

/**
 * Model for create group api request
 * API:: (create-group) /company/companyUniqueName/groups
 */
export class GroupCreateRequest implements IGroup {
    public description?: string;
    public name: string;
    public uniqueName: string;
    public parentGroupUniqueName: string;
    public path?: string[];

}

/**
 * Model for Update group api request
 * API:: (create-group) /company/companyUniqueName/groups
 */
export class GroupUpateRequest {
    public description?: string;
    public name?: string;
    public uniqueName?: string;
}

/**
 * Model for Shared-with api response
 * API:: (group-shared-with) company/:companyUniqueName/groups/:groupUniqueName/shared-with
 * its response will be array of GroupSharedWithResponse
 * Request is a GET call takes no arguments
 */
export class GroupSharedWithResponse {
    public role: INameUniqueName;
    public userEmail: string;
    public userName: string;
    public userUniqueName: string;
}

/**
 * Model for Shared-with api response
 * API:: (group-shared-with) 'company/:companyUniqueName/groups/:groupUniqueName/move'
 * its response will be array of MoveGroupResponse
 * Request is a PUT call takes MoveGroupRequest arguments
 */
export class MoveGroupRequest {
    public parentGroupUniqueName: string;
}

export class MoveGroupResponse {
    public applicableTaxes: INameUniqueName[];
    public uniqueName: string;
    public synonyms?: string;
    public accounts: IAccountsInfo[];
    public description?: any;
    public category?: any;
    public groups: ICreateGroup[];
    public name: string;
}

/*
 * Model for flatten-groups-accounts api response
 * GET call
 * API:: (flatten-groups-accounts) company/:companyUniqueName/groups/flatten-groups-accounts?q=&page=1&count=10&showEmptyGroups=
 * you can pass query parameters in this as page, query as q and showEmptyGroups and count which is sent 10
 * its response will be hash as FlattenGroupsAccountsResponse
 */
export class FlattenGroupsAccountsResponse implements IPaginatedResponse {
    public count: number;
    public page: number;
    public results: IFlattenGroupsAccountsDetail[];
    public size: number;
    public totalItems: number;
    public totalPages: number;
}

/*
 * Model for tax-hierarchy api response
 * GET call
 * API:: (groups tax-hierarchy) company/:companyUniqueName/groups/:groupUniqueName/tax-hierarchy
 * response will be hash as GroupsTaxHierarchyResponse
 */
export class GroupsTaxHierarchyResponse {
    public applicableTaxes: INameUniqueName[];
    public inheritedTaxes: IInheritedTaxes[];
}
