/**
 * Created by arpit meena on 13-07-2017.
 */

export interface PermissionResponse {
  name: string,
  scopes: any,
  uniqueName: string,
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
 * API:: (create-stock-unit) company/:companyUniqueName/stock-unit
 * used to create new role
 * its response will be hash as StockUnitResponse
 */
export class CreateNewRoleRequest { //chages requied here
  public name: string;
  public code: string;
}

export class CreateNewRoleRespone { //chages requied here
  public name: string;
  public code: string;
}