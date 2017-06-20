import { IUserInfo } from './userInfo.interface';

interface InameUniqueName {
  uniqueName: string;
  name: string;
}

export class Group {
  public applicableTaxes: InameUniqueName[];
  public description?: string;
  public fixed: boolean;
  public groups: Group[];
  public hsnNumber?: string;
  public name: string;
  public role: InameUniqueName;
  public ssnNumber?: string;
  public synonyms?: string;
  public uniqueName: string;
  public createdAt: string;
  public createdBy: IUserInfo;
  public updatedAt: string;
  public updatedBy: IUserInfo;

  constructor(applicableTaxes: InameUniqueName[], description: string, fixed: boolean,
              groups: Group[], hsnNumber: string, name: string, role: InameUniqueName,
              ssnNumber: string, synonyms: string, uniqueName: string, createdAt: string,
              createdBy: IUserInfo, updatedAt: string, updatedBy: IUserInfo) {

    this.applicableTaxes = applicableTaxes;
    this.description = description;
    this.fixed = fixed;
    this.groups = groups;
    this.hsnNumber = hsnNumber;
    this.name = name;
    this.role = role;
    this.ssnNumber = ssnNumber;
    this.synonyms = synonyms;
    this.uniqueName = uniqueName;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }
}
