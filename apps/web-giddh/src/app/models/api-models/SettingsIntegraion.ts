/**
 * Model for get SMS keys api request
 * Get call
 * API:: /company/:companyUniqueName/sms-key
 */

import { INameUniqueName } from './Inventory';

/**
 * IntegrationPage interface definition
 * Defines the structure and contract for IntegrationPage objects
 */
export interface IntegrationPage {
    smsForm: any;
    emailForm: any;
    razorPayForm: any;
    paypalForm: any;
    payoutForm: any;
    autoCollect: CashfreeClass;
    paymentGateway: CashfreeClass;
    amazonSeller: AmazonSellerClass[];
    paymentForm: any;
}

/**
 * IntegrationPageClass class
 * Implements IntegrationPageClass functionality
 */
export class IntegrationPageClass {
    public smsForm: SmsKeyClass;
    public emailForm: EmailKeyClass;
    public paypalForm: PaypalDetailsResponse;
    public razorPayForm: RazorPayDetailsResponse;
    public payoutForm: CashfreeClass;
    public autoCollect: CashfreeClass;
    public paymentGateway: CashfreeClass;
    public amazonSeller: AmazonSellerClass[];
    public paymentForm: PaymentClass;

}

/**
 * SmsKeyClass class
 * Implements SmsKeyClass functionality
 */
export class SmsKeyClass {
    public senderId: string;
    public authKey: string;
}

/**
 * EmailKeyClass class
 * Implements EmailKeyClass functionality
 */
export class EmailKeyClass {
    public subject: string;
    public authKey: string;
}

/**
 * RazorPayClass class
 * Implements RazorPayClass functionality
 */
export class RazorPayClass {
    public userName: string;
    public password: string;
    public account: INameUniqueName;
    public autoCapturePayment: boolean;
}

/**
 * PayPalClass class
 * Implements PayPalClass functionality
 */
export class PayPalClass {
    public email: string;
    public account: INameUniqueName;
    public message?: string;
}


/**
 * RazorPayDetailsResponse class
 * Implements RazorPayDetailsResponse functionality
 */
export class RazorPayDetailsResponse {
    public companyName?: string;
    public userName: string;
    public account: INameUniqueName;
    public autoCapturePayment: boolean;
    public password?: string;
}

/**
 * PaypalDetailsResponse class
 * Implements PaypalDetailsResponse functionality
 */
export class PaypalDetailsResponse {
    public companyName?: string;
    public userName: string;
    public account: INameUniqueName;
}

/**
 * CashfreeClass class
 * Implements CashfreeClass functionality
 */
export class CashfreeClass {
    public userName: string;
    public password: string;
    public account: INameUniqueName;
    public autoCapturePayment: boolean;
    public fakeAccObj: boolean;
}

/**
 * AmazonSellerClass class
 * Implements AmazonSellerClass functionality
 */
export class AmazonSellerClass {
    public sellerId: string;
    public mwsAuthToken: string;
    public accessKey: string;
    public secretKey: string;
}

/** For payment request/response   */
/**
 * PaymentClass class
 * Implements PaymentClass functionality
 */
export class PaymentClass {
    public corpId: string;
    public loginId: string;
    public userId: string;
    public accountNo: string;
    public aliasId: string;
    public userAmountRanges: UserAmountRangeRequests[] = [new UserAmountRangeRequests()]
    public accountUniqueName: string;
    public message?: string;
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.corpId = '';
        this.loginId = '';
        this.userId = '';
        this.accountNo = '';
        this.aliasId = '';
        this.accountUniqueName = '';
    }
}

/** Payment range for request/response   */
/**
 * UserAmountRangeRequests class
 * Implements UserAmountRangeRequests functionality
 */
export class UserAmountRangeRequests {
    public amount: number;
    public otpType: string;
    public approvalUniqueName: string;
    public maxBankLimit: string;
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.amount = null;
        this.otpType = 'BANK';
        this.approvalUniqueName = '';
        this.maxBankLimit = "max";
    }
}

/**
 * Account class
 * Implements Account functionality
 */
export class Account {
    name: string;
    uniqueName: string;
}

/**
 * UserAmountRange class
 * Implements UserAmountRange functionality
 */
export class UserAmountRange {
    amount?: number;
    otpType: string;
    approvalUniqueName?: any;
    approvalDetails?: any;
    maxBankLimit: boolean;
}

/**
 * IntegratedBankList class
 * Implements IntegratedBankList functionality
 */
export class IntegratedBankList {
    loginId: string;
    corpId: string;
    userId: string;
    accountNo: string;
    accountUniqueName?: any;
    account: Account;
    aliasId: string;
    bankName?: any;
    userAmountRanges: UserAmountRange[];
    message?: any;
    bankUserId: string;
}
/**
 * InstitutionsRequest class
 * Implements InstitutionsRequest functionality
 */
export class InstitutionsRequest {
    public count: number;
    public page: number;
    public countryCode: string;
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.count = 250;
        this.page = 1;
    }
}



