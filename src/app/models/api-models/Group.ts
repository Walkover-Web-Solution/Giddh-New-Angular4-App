import { ICreateGroup } from '../interfaces/groupCreate.interface';
import { INameUniqueName } from '../interfaces/nameUniqueName.interface';
import { IUserInfo } from '../interfaces/userInfo.interface';
import { IGroup } from '../interfaces/group.interface';

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

  constructor(applicableTaxes: INameUniqueName[], description: string, fixed: boolean,
              groups: ICreateGroup[], hsnNumber: string, name: string, role: INameUniqueName,
              ssnNumber: string, synonyms: string, uniqueName: string, createdAt: string,
              createdBy: IUserInfo, updatedAt: string, updatedBy: IUserInfo) {

    this.applicableTaxes = applicableTaxes;
    this.description = description;
    this.fixed = fixed;
    this.groups = groups;
    this.hsnNumber = hsnNumber;
    this.name = name;
    this.role = role;
    this.ssnNumber = ssnNumber;
    this.synonyms = synonyms;
    this.uniqueName = uniqueName;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }
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

  constructor(group: GroupCreateRequest) {
    this.description = group.description;
    this.name = group.name;
    this.uniqueName = group.uniqueName;
    this.parentGroupUniqueName = group.parentGroupUniqueName;
  }
}

/**
 * Model for Update group api request
 * API:: (create-group) /company/companyUniqueName/groups
 */
export class GroupUpateRequest {
  public description?: string;
  public name?: string;
  public uniqueName?: string;

  constructor(group: GroupUpateRequest) {
    this.description = group.description;
    this.name = group.name;
    this.uniqueName = group.uniqueName;
  }
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