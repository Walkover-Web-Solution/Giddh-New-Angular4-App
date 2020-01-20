export interface IGetEbankTokenResponse {
	connectUrl: string;
	token: string;
	token_URL: string;
}

export interface IGetAllEbankAccountResponse {
	accounts: IEbankAccount[];
	siteId: number;
	siteName: string;
}

export interface IEbankAccount {
	loginId: string;
	reconnect: boolean;
	transactionDate: string;
	currencyCode: string;
	amount: number;
	accountId: number;
	linkedAccount?: any;
	accountNumber: string;
	name: string;
	isDatePickerOpen?: boolean;
	showAccList?: boolean;
	itemAccountId?: number;
	giddhAccount?: any;
	status?: string;
	providerAccount: { providerAccountId: number };
}

export interface IAccessTokenResponse {
	user: IAccessToken;
	rsession: string;
}

export interface IAccessToken {
	accessTokens: IAccessTokenObj[];
}

export interface IAccessTokenObj {
	appId: string;
	value: string;
	url: string;
}
