/**
 * Model for get SMS keys api request
 * Get call
 * API:: /company/:companyUniqueName/sms-key
 */

import { INameUniqueName } from './Inventory';

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

export class SmsKeyClass {
    public senderId: string;
    public authKey: string;
}

export class EmailKeyClass {
    public subject: string;
    public authKey: string;
}

export class RazorPayClass {
    public userName: string;
    public password: string;
    public account: INameUniqueName;
    public autoCapturePayment: boolean;
}

export class PayPalClass {
    public email: string;
    public account: INameUniqueName;
    public message?: string;
}


export class RazorPayDetailsResponse {
    public companyName?: string;
    public userName: string;
    public account: INameUniqueName;
    public autoCapturePayment: boolean;
    public password?: string;
}

export class PaypalDetailsResponse {
    public companyName?: string;
    public userName: string;
    public account: INameUniqueName;
}

export class CashfreeClass {
    public userName: string;
    public password: string;
    public account: INameUniqueName;
    public autoCapturePayment: boolean;
    public fakeAccObj: boolean;
}

export class AmazonSellerClass {
    public sellerId: string;
    public mwsAuthToken: string;
    public accessKey: string;
    public secretKey: string;
}

/** For payment request/response   */
export class PaymentClass {
    public corpId: string;
    public loginId: string;
    public userId: string;
    public accountNo: string;
    public aliasId: string;
    public userAmountRanges: UserAmountRangeRequests[] = [new UserAmountRangeRequests()]
    public accountUniqueName: string;
    public message?: string;
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
export class UserAmountRangeRequests {
    public amount: number;
    public otpType: string;
    public approvalUniqueName: string;
    public maxBankLimit: string;
    constructor() {
        this.amount = null;
        this.otpType = 'BANK';
        this.approvalUniqueName = '';
        this.maxBankLimit = "max";
    }
}

export class Account {
    name: string;
    uniqueName: string;
}

export class UserAmountRange {
    amount?: number;
    otpType: string;
    approvalUniqueName?: any;
    approvalDetails?: any;
    maxBankLimit: boolean;
}

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


