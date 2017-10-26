import { ITax, ITaxDetail } from '../interfaces/tax.interface';
import { INameUniqueName } from '../interfaces/nameUniqueName.interface';

export class CompanyRequest {
  public name: string;
  public uniqueName: string;
  public address: string;
  public city: string;
  public state: string;
  public country: string;
  public pincode: string;
  public contactNo: string;
  public email: string;

}

export class StateDetailsRequest {
  public lastState: string;
  public companyUniqueName: string;
}

export class StateDetailsResponse {
  public lastState: string;
  public companyUniqueName: string;
}

export class AddressList {
  public stateCode: string;
  public address: string;
  public isDefault: boolean;
  public stateName: string;
}

export class GstDetail {
  public addressList: AddressList[];
  public gstNumber: string;
}

export class CompanyResponse {
  public canUserSwitch: boolean;
  public companyIdentity: any[];
  public activeFinancialYear: ActiveFinancialYear;
  public email: string;
  public city: string;
  public pincode: string;
  public country: string;
  public updatedAt: string;
  public updatedBy: UpdatedBy;
  public createdAt: string;
  public createdBy: UpdatedBy;
  public uniqueName: string;
  public baseCurrency: string;
  public contactNo: string;
  public companySubscription: CompanySubscription;
  public financialYears: ActiveFinancialYear[];
  public userEntityRoles: UserEntityRole[];
  public address: string;
  public state: string;
  public alias?: any;
  public name: string;
  public gstDetails: GstDetail[];
  public panNumber?: string;
  public isMultipleCurrency?: boolean;
}

export interface UserEntityRole {
  sharedWith: ICommonShareItems;
  sharedBy: ICommonShareItems;
  fixedRole: FixedRole;
  allowedCidrs: any[];
  allowedIps: any[];
  period?: any;
  from?: any;
  to?: any;
  duration?: any;
  entity: Entity;
  role: Role;
}

export interface ICommonShareItems extends INameUniqueName {
  email: string;
  mobileNo: string;
}

export interface FixedRole extends INameUniqueName  {
  isFixed: boolean;
  scopes: Scope2[];
}

export interface Entity extends INameUniqueName  {
  entity: string;
}

export interface Permission2 {
  code: string;
}

export interface Scope2 {
  permissions: Permission2[];
  name: string;
}

export interface Role extends INameUniqueName  {
  isFixed?: boolean;
  scopes?: Scope2[];
}

export interface CompanySubscription {
  discount: number;
  subscriptionDate: string;
  nextBillDate: string;
  autoDeduct: boolean;
  paymentMode: string;
  servicePlan: ServicePlan;
  paymentDue: boolean;
  remainingPeriod: number;
  primaryBillerConfirmed: boolean;
  billAmount: number;
  primaryBiller?: any;
  createdAt: string;
  createdBy: UpdatedBy;
}

export interface ServicePlan {
  planName: string;
  servicePeriod: number;
  amount: number;
}

export interface UpdatedBy {
  name: string;
  email: string;
  uniqueName: string;
  mobileNo: string;
}

export interface ActiveFinancialYear {
  financialYearStarts: string;
  financialYearEnds: string;
  isLocked: boolean;
  uniqueName: string;
}

/*
 * Model for taxes api request
 * GET call
 * API:: (taxes) company/:companyUniqueName/tax
 * response will be array of TaxResponse
 */
export class TaxResponse implements ITax {
  public account?: INameUniqueName;
  public accounts?: INameUniqueName;
  public taxType?: string = '';
  public duration: string = '';
  public taxDetail: ITaxDetail[];
  public taxFileDate: number;
  public taxNumber: string;
  public name: string;
  public uniqueName: string;
  public date?: any;
  public taxValue?: any;
}

export class States {
  public name: string;
  public code: string;
}

export class GetCouponResp {
  public validUntil: string;
  public maxAmount: number;
  public code: string;
  public count: number;
  public value: number;
  public type: string;
}
