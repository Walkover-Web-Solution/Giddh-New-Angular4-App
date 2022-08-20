export interface SubscriptionPlan {
    amount: number;
    paymentFrequency: string;
    planName: string;
    transactionLimit: number;
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

// New Subscription model

export interface SubscriptionsUser {
    companies?: any;
    companiesWithTransactions: CompaniesWithTransaction[];
    totalTransactions: number;
    additionalTransactions: number;
    userDetails: UserDetails;
    totalCompanies: number;
    subscriptionId: string;
    balance: number;
    expiry: string;
    startedAt: string;
    companyTotalTransactions?: any;
    planDetails: PlanDetails;
    additionalCharges?: any;
    createdAt: string;
    status: string;
    remainingTransactions: number;
    remainingDays?:number
}

export class PlanDetails {
    countries: any[];
    name: string;
    amount: number;
    createdAt: string;
    ratePerExtraTransaction: number;
    isCommonPlan: boolean;
    duration: number;
    companiesLimit: number;
    durationUnit: string;
    uniqueName: string;
    transactionLimit: number;
}

export class UserDetails {
    name: string;
    uniqueName: string;
    email: string;
    signUpOn?: string;
    mobileno?: any;
}

export class CompaniesWithTransaction {
    uniqueName: string;
    name: string;
    transactions: number;
}
