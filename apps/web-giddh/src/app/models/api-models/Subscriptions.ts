export interface ISubscriptions {
  subscribedOn: string;
  subscriptionId: string;
  status: boolean;
  renewalDate: string;
  plan: SubscriptionPlan;
  companies: SubscriptionCompanies[];
}

export interface SubscriptionPlan {
  amount: number;
  paymentFrequency: string;
  planName: string;
  transactionLimit: number;
}

export interface SubscriptionCompanies {
  name: string;
  uniqueName: string;
}

export interface ITransactions {
  additionalCharges: number;
  currentTransactionCount: number;
  from: string;
  previousTransactionCount: number;
  to: string;
  totalTransactionCount: number;
  transactionBalance: number;
}

export interface ICompanyTransactions {
  currentPlanTransactionCount: number;
  currentTransactionCount: number;
  from: string;
  previousPlanTransactionCount: number;
  previousTransactionCount: number;
  to: string;
  totalPlanTransactionCount: number;
  totalTransactionCount: number;
}

export interface ICompanies {
  isSuspended: boolean;
  name: string;
  transactionCount: number;
  uniqueName: string;
}
