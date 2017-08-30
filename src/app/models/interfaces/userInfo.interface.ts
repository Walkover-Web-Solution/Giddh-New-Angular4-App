import { INameUniqueName } from './nameUniqueName.interface';

export interface IUserInfo extends INameUniqueName {
  email: string;
  mobileNo: string;
}

export interface IUserDetail extends INameUniqueName {
  email: string;
  contactNo: string;
  anAdmin: boolean;
}
