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

export interface CreateNewRoleResponse {
  isFixed: boolean;
  scopes: Scope[];
  uniqueName: string;
  name: string;
}

export interface CreateNewRoleRequest {
  name: string;
  scopes: Scope[];
  isFixed?: boolean;
  uniqueName?: string;
}

export interface IRoleCommonResponseAndRequest {
  name: string;
  scopes: Scope[];
  isFixed?: boolean;
  uniqueName?: string;
}
