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
}

export class IntegrationPageClass {
  public smsForm: SmsKeyClass;
  public emailForm: EmailKeyClass;
  public razorPayForm: RazorPayDetailsResponse;
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
