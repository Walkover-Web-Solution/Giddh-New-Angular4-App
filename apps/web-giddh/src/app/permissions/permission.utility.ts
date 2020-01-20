import { Permission, Scope } from '../models/api-models/Permission';
import { PermissionActions } from '../../../services/actions/permission/permission.action';

export class NewRoleClass {
    constructor(
        public name: string,
        public scopes: Scope[],
        public isFixed?: boolean,
        public uniqueName?: string,
        public isUpdateCase?: boolean,
    ) {
    }
}

export class NewPermissionObj {
    constructor(
        public code: string,
        public isSelected: boolean
    ) {
    }
}

export interface IPageStr {
    [index: number]: string;
}

export interface IPage {
    name: string;
    isSelected: boolean;
}

export interface GetAllPermissionResponse {
    name: string;
    scopes: Scope[];
    isFixed?: boolean;
    uniqueName?: string;
    isUpdateCase?: boolean;
}

export interface Pages {
    name: string;
    permissions: Permission[];
}

export class NewRoleFormClass implements INewRoleFormObj {
    public name: string;
    public isFresh: boolean;
    public uniqueName?: string;
    public isSelectedAllPages?: any;
    public pageList?: any;
}

export interface INewRoleFormObj {
    name: string;
    isFresh: boolean;
    uniqueName?: string;
    isSelectedAllPages?: any;
    pageList?: any;
}
