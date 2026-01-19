/**
 * Created by arpit meena on 13-07-2017.
 * Model for create-new-role api request
 * POST call
 * API:: (create-new-role) /company/:companyUniqueName/role
 * used to create new role
 */

import { INameUniqueName } from './Inventory';
import { ICommonItem } from './Company';

/**
 * Permission interface definition
 * Defines the structure and contract for Permission objects
 */
export interface Permission {
    code: string;
    isSelected?: boolean;
}

/**
 * Scope interface definition
 * Defines the structure and contract for Scope objects
 */
export interface Scope {
    name: string;
    permissions: Permission[];
    selectAll?: boolean;
}

/**
 * CreateNewRoleResponse interface definition
 * Defines the structure and contract for CreateNewRoleResponse objects
 */
export interface CreateNewRoleResponse {
    isFixed: boolean;
    scopes: Scope[];
    uniqueName: string;
    name: string;
}

/**
 * CreateNewRoleRequest interface definition
 * Defines the structure and contract for CreateNewRoleRequest objects
 */
export interface CreateNewRoleRequest {
    name: string;
    scopes: Scope[];
    isFixed?: boolean;
    uniqueName?: string;
}

/**
 * IRoleCommonResponseAndRequest interface definition
 * Defines the structure and contract for IRoleCommonResponseAndRequest objects
 */
export interface IRoleCommonResponseAndRequest {
    name: string;
    scopes: Scope[];
    isFixed?: boolean;
    uniqueName?: string;
}

/**
 * ShareRequestForm class
 * Implements ShareRequestForm functionality
 */
export class ShareRequestForm {
    public emailId: string;
    public from: string; // dd-MM-yyyy format
    public to: string; // dd-MM-yyyy format
    public duration: number; // numeric
    public period: string; // DAY
    public allowedIps: any[]; // array of strings
    public allowedCidrs: any[]; // array of strings
    public ipsStr?: string; // converted from array for UI
    public cidrsStr?: string; // converted from array for UI
    public entity: string;
    public entityUniqueName: string;
    public userEmail?: string;
    public userName?: string;
    public userUniqueName?: string;
    public roleName?: string;
    public roleUniqueName?: string;
    public uniqueName?: string;
    public dateRange?: any;
    public isLoggedInUser?: boolean;
}

/**
 * IUpdatePermissionResponse interface definition
 * Defines the structure and contract for IUpdatePermissionResponse objects
 */
export interface IUpdatePermissionResponse extends INameUniqueName {
    name: string;
    uniqueName: string;
    allowedCidrs: any[];
    allowedIps: any[];
    period?: any;
    from?: any;
    to?: any;
    sharedBy: ICommonItem;
    sharedWith: ICommonItem;
    duration?: any;
    entity: Entity;
    role: any;
}

/**
 * Entity interface definition
 * Defines the structure and contract for Entity objects
 */
export interface Entity extends INameUniqueName {
    entity: string;
}
