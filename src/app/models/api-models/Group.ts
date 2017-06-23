import { ICreateGroup } from '../interfaces/groupCreate.interface';
import { INameUniqueName } from '../interfaces/nameUniqueName.interface';
import { IUserInfo } from '../interfaces/userInfo.interface';
import { IGroup } from '../interfaces/group.interface';
import { IAccountsInfo } from '../interfaces/accountInfo.interface';

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
 * Model for Share group api request
 * API:: (Share-group) company/:companyUniqueName/groups/:groupUniqueName/share
 * takes email as value for user field
 * its response will be success message in body
 */
export class ShareGroupRequest {
  public role: string;
  public user: string;
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
