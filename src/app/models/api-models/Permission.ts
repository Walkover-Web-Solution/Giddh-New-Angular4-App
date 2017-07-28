/**
 * Created by arpit meena on 13-07-2017.
 * Model for create-new-role api request
 * POST call
 * API:: (create-new-role) /company/:companyUniqueName/role
 * used to create new role
 */

export interface Permission {
  code: string;
  isSelected?: boolean;
}

export interface Scope {
  name: string;
  permissions: Permission[];
  selectAll?: boolean;
}

export interface UpdateRoleRequest {
  scopes: Scope[];
  roleUniqueName: string;
  uniqueName?: string;
}

export class CreateNewRoleResponse {
  public isFixed: boolean;
  public scopes: Scope[];
  public uniqueName: string;
  public name: string;
}

export class CreateNewRoleRequest {
  public name: string;
  public scopes: Scope[];
  public isFixed?: boolean;
  public uniqueName?: string;
}

export class CreateNewRoleResponseAndRequest {
  public name: string;
  public scopes: Scope[];
  public isFixed?: boolean;
  public uniqueName?: string;
}

export interface ISingleRole {
  name: string;
  scopes: Scope[];
  uniqueName: any;
  isFixed: boolean;
}
