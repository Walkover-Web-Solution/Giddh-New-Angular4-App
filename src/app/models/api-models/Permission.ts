/**
 * Created by arpit meena on 13-07-2017.
 */

export interface ISingleRole {
  name: string;
  scopes: Scope[];
  uniqueName: any;
  isFixed: boolean;
}

export interface PermissionResponse extends ISingleRole {
  companyUniqueName: string;
}

export interface PermissionRequest {
  companyUniqueName: string;
}

export interface NewRole {
  name: string;
  scopes: Scope[];
  copyoption: string;
  pages: any;
}

/*
 * Model for create-new-role api request
 * POST call
 * API:: (create-new-role) /company/:companyUniqueName/role
 * used to create new role
 * its response will be hash as CreateNewRoleRespone
 */

export interface Permission {
  code: string;
  isSelected?: boolean;
}

export interface Scope {
  name: string;
  permissions: Permission[];
}

export interface CreateNewRoleRequest {
  name: string;
  scopes: Scope[];
}

export interface UpdateRoleRequest {
  scopes: Scope[];
  roleUniqueName: string;
  uniqueName?: string;
}

export class CreateNewRoleRespone {
  private isFixed: boolean;
  private scopes: Scope[];
  private uniqueName: string;
  private name: string;
  private companyUniqueName: string;
}

export class UpdateRoleRespone {
}

export class LoadAllPageNamesResponse {
}