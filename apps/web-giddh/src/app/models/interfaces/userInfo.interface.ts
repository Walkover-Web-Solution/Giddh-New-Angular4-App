import { INameUniqueName } from '../api-models/Inventory';

export interface IUserInfo extends INameUniqueName {
    email: string;
    mobileNo: string;
}