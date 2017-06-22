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

export class ComapnyResponse {
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
  public sharedEntity?: any;
  public address: string;
  public state: string;
  public shared: boolean;
  public alias?: any;
  public role: Role;
  public name: string;
}

export interface Role {
  uniqueName: string;
  name: string;
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
