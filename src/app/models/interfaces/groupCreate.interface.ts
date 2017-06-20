import { IUserInfo } from './userInfo.interface';
import { INameUniqueName } from './nameUniqueName.interface';
import { IGroup } from './group.interface';

export interface ICreateGroup extends IGroup {
  applicableTaxes: INameUniqueName[];
  description?: string;
  fixed: boolean;
  groups: ICreateGroup[];
  hsnNumber?: string;
  role: INameUniqueName;
  ssnNumber?: string;
  createdAt: string;
  createdBy: IUserInfo;
  updatedAt: string;
  updatedBy: IUserInfo;
}
