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
