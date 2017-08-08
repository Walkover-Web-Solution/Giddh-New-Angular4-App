/**
 * Model for get SMS keys api request
 * Get call
 * API:: /company/:companyUniqueName/sms-key
 */

export interface IntegrationPage {
  smsForm: any;
  emailForm: any;
}

export class IntegrationPageClass {
  public smsForm: SmsKeyClass;
  public emailForm: EmailKeyClass;
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
  public account: any;
  public autoCapturePayment: boolean;
}
