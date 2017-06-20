import { IUserInfo } from "../../interfaces/userInfo.interface";

export class UserDetail {
  public email: string;
  public mobileNo: string;
  public name: string;
  public uniqueName: string;
  public authenticateTwoWay: boolean;
  public availableCredit: number;
  public isNewUser: boolean;
  public subUser: boolean;
  public subUsers: any[];
  public createdAt: string;
  public createdBy: IUserInfo;
  public updatedAt: string;
  public updatedBy: IUserInfo;

  constructor(email: string, mobileNo: string, name: string, uniqueName: string,
              authenticateTwoWay: boolean, availableCredit: number, isNewUser: boolean,
              subUser: boolean, subUsers: any[], createdAt: string, createdBy: IUserInfo,
              updatedAt: string, updatedBy: IUserInfo) {

    this.email = email;
    this.mobileNo = mobileNo;
    this.name = name;
    this.uniqueName = uniqueName;
    this.authenticateTwoWay = authenticateTwoWay;
    this.availableCredit = availableCredit;
    this.isNewUser = isNewUser;
    this.subUser = subUser;
    this.subUsers = subUsers;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }
}
