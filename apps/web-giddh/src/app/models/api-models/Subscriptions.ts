import { PAGINATION_LIMIT } from "../../app.constant";

/**
 * SubscriptionPlan interface definition
 * Defines the structure and contract for SubscriptionPlan objects
 */
export interface SubscriptionPlan {
    amount: number;
    paymentFrequency: string;
    planName: string;
    transactionLimit: number;
}

/**
 * ITransactions interface definition
 * Defines the structure and contract for ITransactions objects
 */
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

/**
 * SubscriptionsUser interface definition
 * Defines the structure and contract for SubscriptionsUser objects
 */
export interface SubscriptionsUser {
    companies?: any;
    companiesWithTransactions: CompaniesWithTransaction[];
    totalTransactions: number;
    additionalTransactions: number;
    userDetails: UserDetails;
    totalCompanies: number;
    subscriptionId: string;
    paymentPending?: boolean;
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

/**
 * PlanDetails class
 * Implements PlanDetails functionality
 */
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

/**
 * UserDetails class
 * Implements UserDetails functionality
 */
export class UserDetails {
    name: string;
    uniqueName: string;
    email: string;
    signUpOn?: string;
    mobileno?: any;
}

/**
 * CompaniesWithTransaction class
 * Implements CompaniesWithTransaction functionality
 */
export class CompaniesWithTransaction {
    uniqueName: string;
    name: string;
    transactions: number;
}

/**
 * SubscriptionReportRequest class
 * Implements SubscriptionReportRequest functionality
 */
export class SubscriptionReportRequest {
    public totalItems?: number;
    public totalPages?: number;
    public count: number;
    public page: number;
    public sort: string;
    public sortBy: string;
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.count = PAGINATION_LIMIT;
        this.page = 1;
    }
}

/**
 * SearchSubscriptionRequest class
 * Implements SearchSubscriptionRequest functionality
 */
export class SearchSubscriptionRequest {
    public q: any;
    public count: number;
    public page: number;
    public totalItems?: number;
    public totalPages?: number;
    public loadMore?: boolean;
    public fromMoveCompany?: boolean;
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.count = PAGINATION_LIMIT;
        this.page = 1;
        this.fromMoveCompany = true;
    }
}
