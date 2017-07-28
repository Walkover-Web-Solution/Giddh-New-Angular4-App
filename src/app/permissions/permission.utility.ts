
import { Scope, Permission } from '../models/api-models/Permission';
import { PermissionActions } from '../../../services/actions/permission/permission.action';

export class NewRoleClass {
  constructor(
    public name: string,
    public scopes: Scope[],
    public isFixed?: boolean,
    public uniqueName?: string
  ) {  }
}

export class NewPermissionObj {
  constructor(
    public code: string,
    public isSelected: boolean
  ) {  }
}

export interface IPage {
    name: string;
    selected?: boolean;
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
