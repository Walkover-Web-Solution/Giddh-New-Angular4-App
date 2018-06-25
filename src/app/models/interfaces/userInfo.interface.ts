import { INameUniqueName } from '../api-models/Inventory';

export interface IUserInfo extends INameUniqueName {
  email: string;
  mobileNo: string;
}

export interface IUserDetail extends INameUniqueName {
  email: string;
  contactNo: string;
  anAdmin: boolean;
}
