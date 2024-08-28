import { API_COUNT_LIMIT, PAGINATION_LIMIT } from "../../app.constant";

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
    duration: any;
    additionalCharges?: any;
    createdAt: string;
    status: string;
    remainingTransactions: number;
    remainingDays?: number
}

export class PlanDetails {
    countries: any[];
    name: string;
    amount: number;
    createdAt: string;
    ratePerExtraTransaction: number;
    isCommonPlan: boolean;
    duration: any;
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

export class SubscriptionReportRequest {
    public totalItems?: number;
    public totalPages?: number;
    public count: number;
    public page: number;
    public sort: string;
    public sortBy: string;
    constructor() {
        this.count = PAGINATION_LIMIT;
        this.page = 1;
    }
}

export class SearchSubscriptionRequest {
    public q: any;
    public count: number;
    public page: number;
    public totalItems?: number;
    public totalPages?: number;
    public loadMore?: boolean;
    public fromMoveCompany?: boolean;
    constructor() {
        this.count = 200;
        this.page = 1;
        this.fromMoveCompany = true;
    }
}
