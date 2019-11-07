import { ITax, ITaxDetail } from '../interfaces/tax.interface';
import { INameUniqueName } from './Inventory';

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
  public isBranch?: boolean;
  public nameAlias?: string;
  public currency?: string;
}

export class SocketNewCompanyRequest {
  public CompanyName: string;
  public MobileNo: string;
  public LoggedInEmailID: string;
  public Timestamp: number;
  public Name: string;
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
  public updatedBy: ICommonItem;
  public createdAt: string;
  public createdBy: ICommonItem;
  public uniqueName: string;
  public baseCurrency: string;
  public contactNo: string;
  public companySubscription: CompanySubscription;
  public financialYears: ActiveFinancialYear[];
  public sharedEntity?: any;
  public address: string;
  public state: string;
  public shared: boolean;
  public alias?: any;
  public role: Role;
  public name: string;
  public gstDetails: GstDetail[];
  public panNumber?: string;
  public isMultipleCurrency?: boolean;
  public userEntityRoles?: UserEntityRole[];
  public nameAlias?: string;
  public balanceDisplayFormat?: string;
  public balanceDecimalPlaces?: string;
}

export interface UserEntityRole {
  sharedWith: ICommonItem;
  uniqueName: string;
  allowedCidrs: any[];
  allowedIps: any[];
  period?: any;
  from?: any;
  to?: any;
  sharedBy: ICommonItem;
  duration?: any;
  entity: IEntityItem;
  role: Role;
}

interface IEntityItem extends ICommonItem {
  entity: string;
}

export interface Role {
  uniqueName: string;
  name: string;
  scopes?: any[];
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
  createdBy: ICommonItem;
}

export interface ServicePlan {
  planName: string;
  servicePeriod: number;
  amount: number;
}

export interface ICommonItem extends INameUniqueName {
  email: string;
  mobileNo: string;
}

export interface ActiveFinancialYear {
  financialYearStarts: string;
  financialYearEnds: string;
  isLocked: boolean;
  uniqueName: string;
}

export interface ValidateInvoice {
  invoiceNumber: string;
}

export interface ExportInvoice {
  accountUniqueName: string;
}

/*
* Model for taxes api request
* GET call
* API:: (taxes) company/:companyUniqueName/tax
* response will be array of TaxResponse
*/
export class TaxResponse implements ITax {
  public account?: INameUniqueName;
  public accounts?: INameUniqueName[];
  public taxType?: string = '';
  public tdsTcsTaxSubTypes: string;
  public duration: string = '';
  public taxDetail: ITaxDetail[];
  public taxFileDate: number | string;
  public taxNumber: string;
  public name: string;
  public uniqueName: string;
  public date?: any;
  public taxValue?: any;
  public isChecked?: boolean;
  public isDisabled?: boolean;
}

export class StatesRequest {
  country: string;
}

export class States {
  public country: {
    alpha2CountryCode: string;
    alpha3CountryCode: string;
    callingCode: string;
    countryName: string;
    currency: {
      code: string;
      symbol: string;
    }
  };
  public stateList: [{
    stateGstCode: string;
    name: string;
    code: string;
  }]
}

export class GetCouponResp {
  public validUntil: string;
  public maxAmount: number;
  public code: string;
  public count: number;
  public value: number;
  public type: string;
}

export interface ICurrencyResponse {
  code: string;
  symbol: string;
}

export class BankTransferRequest {
  public URN: string;
  public transferAccountUniqueName: string;
  public otp: number;
  public amount: number;
  public payeeName: string;
  public remarks: string;
}

export class SubscriptionRequest {
  planUniqueName: string;
  subscriptionId: string;
  userUniqueName: string;
  licenceKey: string;
}

export interface AddressList {
  stateCode: string;
  address: string;
  isDefault: boolean;
  stateName: string;
}

// export interface GstDetail {
//     gstNumber: string;
//     addressList: AddressList[];
// }

export class BillingDetails {
  name: string;
  email: string;
  mobile: string;
  gstin: string;
  state: string;
  address: string;
  autorenew: any;
}

export class CompanyCreateRequest {
  name: string;
  country: string;
  phoneCode?: string;
  contactNo: string;
  uniqueName: string;
  isBranch?: boolean;
  subscriptionRequest?: SubscriptionRequest;
  gstDetails?: GstDetail[];
  bussinessNature?: string;
  bussinessType?: string;
  address?: string;
  industry?: string;
  baseCurrency: string;
  isMultipleCurrency?: boolean;
  city?: string;
  pincode?: string;
  email?: string;
  taxes?: string[];
  userBillingDetails?: BillingDetails;
  nameAlias?: string;
  paymentId?: string;
  amountPaid?: string;
  orderId?: string;
  razorpaySignature?: string;

}

export class CreateCompanyUsersPlan {
  companies: string[];
  totalCompanies: number;
  userDetails?: UserDetail;
  additionalTransactions: number;
  createdAt?: string;
  planDetails: PlanDetails;
  additionalCharges?: any;
  status?: string;
  subscriptionId?: string;
  balance?: number;
  expiry?: string;
  startedAt?: string;
  companiesWithTransactions?: any;
  companyTotalTransactions?: any;
  totalTransactions?: number;
}

export class PlanDetails {
  countries: any[];
  name: string;
  uniqueName: string;
  createdAt: string;
  amount: number;
  ratePerExtraTransaction: number;
  isCommonPlan: boolean;
  duration: number;
  companiesLimit: number;
  durationUnit: string;
  transactionLimit: number;
}

export class UserDetail {
  name: string;
  uniqueName: string;
  email: string;
  signUpOn: string;
  mobileno?: any;
}

export class CompanyCountry {
  baseCurrency: string;
  country: string;

}
