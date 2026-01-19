import { Permission, Scope } from '../models/api-models/Permission';

/**
 * NewRoleClass class
 * Implements NewRoleClass functionality
 */
export class NewRoleClass {
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        public name: string,
        public scopes: Scope[],
        public isFixed?: boolean,
        public uniqueName?: string,
        public isUpdateCase?: boolean,
    ) {
    }
}

/**
 * NewPermissionObj class
 * Implements NewPermissionObj functionality
 */
export class NewPermissionObj {
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        public code: string,
        public isSelected: boolean
    ) {
    }
}

/**
 * IPageStr interface definition
 * Defines the structure and contract for IPageStr objects
 */
export interface IPageStr {
    [index: number]: string;
}

/**
 * IPage interface definition
 * Defines the structure and contract for IPage objects
 */
export interface IPage {
    name: string;
    isSelected: boolean;
}

/**
 * GetAllPermissionResponse interface definition
 * Defines the structure and contract for GetAllPermissionResponse objects
 */
export interface GetAllPermissionResponse {
    name: string;
    scopes: Scope[];
    isFixed?: boolean;
    uniqueName?: string;
    isUpdateCase?: boolean;
}

/**
 * Pages interface definition
 * Defines the structure and contract for Pages objects
 */
export interface Pages {
    name: string;
    permissions: Permission[];
}

/**
 * NewRoleFormClass class
 * Implements NewRoleFormClass functionality
 */
export class NewRoleFormClass implements INewRoleFormObj {
    public name: string;
    public isFresh: boolean;
    public uniqueName?: string;
    public isSelectedAllPages?: any;
    public pageList?: any;
}

/**
 * INewRoleFormObj interface definition
 * Defines the structure and contract for INewRoleFormObj objects
 */
export interface INewRoleFormObj {
    name: string;
    isFresh: boolean;
    uniqueName?: string;
    isSelectedAllPages?: any;
    pageList?: any;
}
