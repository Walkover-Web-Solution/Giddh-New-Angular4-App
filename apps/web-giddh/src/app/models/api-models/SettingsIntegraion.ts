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
    payoutForm: any;
    autoCollect: CashfreeClass;
    paymentGateway: CashfreeClass;
    amazonSeller: AmazonSellerClass[];
    paymentForm: any;
}

export class IntegrationPageClass {
    public smsForm: SmsKeyClass;
    public emailForm: EmailKeyClass;
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

export class RazorPayDetailsResponse {
    public companyName?: string;
    public userName: string;
    public account: INameUniqueName;
    public autoCapturePayment: boolean;
    public password?: string;
}

export class CashfreeClass {
    public userName: string;
    public password: string;
    public account: INameUniqueName;
    public autoCapturePayment: boolean;
    public fakeAccObj: boolean;
}

export class CashfreeClassResponse {
    public userName: string;
    public password: string;
    public account: INameUniqueName;
    public autoCapturePayment: boolean;
}

export class AmazonSellerClass {
    public sellerId: string;
    public mwsAuthToken: string;
    public accessKey: string;
    public secretKey: string;
}

export class PaymentClass {
    public corpId: string;
    public userId: string;
    public accountNo: string;
    public accountUniqueName: string;

    constructor() {
        this.corpId = '';
        this.userId = '';
        this.accountNo = '';
        this.accountUniqueName = '';
    }
}
