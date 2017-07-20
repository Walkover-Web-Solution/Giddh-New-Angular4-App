/**
 * Created by arpit meena on 13-07-2017.
 */

export interface PermissionResponse {
  name: string,
  scopes: any,
  uniqueName: any,
  isFixed: boolean,
  companyUniqueName: string
}

export interface PermissionRequest {
  companyUniqueName: string;
}

export interface NewRole {
  name: string,
  scopes: any,
  copyoption: string,
  pages: any,
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
}

export class CreateNewRoleRespone {
  isFixed: boolean;
  scopes: Scope[];
  uniqueName: string;
  name: string;
  companyUniqueName: string;
}

export class UpdateRoleRespone {
}