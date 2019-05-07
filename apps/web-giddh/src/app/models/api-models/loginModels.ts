import { IUserDetail } from '../interfaces/userInfo.interface';

export class LinkedInRequestModel {
  public email: string;
  public token: string;
}

export class VerifyEmailModel {
  public email: string;
  public verificationCode: string;
}
export class SignupwithEmaillModel {
  public email: string;
  public retryCount: number;
}

export class VerifyEmailResponseModel {
  public user: UserDetails;
  public session?: Session;
  public authKey?: string;
  public isNewUser: boolean;
  public contactNumber: string;
  public countryCode: string;
  public statusCode: string;
  public text: string;
}

export interface Session {
  id: string;
  expiresAt: string;
  createdAt: string;
}

export class UserDetails {
  public name: string;
  public email: string;
  public mobileNo: string;
  public contactNo: string;
  public uniqueName: string;
  public anAdmin: boolean;
  public authenticateTwoWay: boolean;
  public availableCredit: boolean;
  public isNewUser: boolean;
  public subUser: boolean;
  public subUsers: any[];
  public createdAt: string;
  public updatedAt: string;
  public createdBy: CreatedBy;
  public updatedBy: CreatedBy;
}

export class SignupWithMobile {
  public mobileNumber: string;
  public countryCode: number = 91;
}

export class SignupWithMobileResponse {
  public code: string;
}

export class VerifyMobileModel {
  public mobileNumber: string;
  public countryCode: number = 91;
  public oneTimePassword: string;
}

export class VerifyMobileResponseModel {
  public user: UserDetails;
  public authKey: string;
  public isNewUser: boolean;
  public contactNumber: string;
  public countryCode: string;
  public statusCode: string;
  public text: string;
  public session?: Session;
}

/**
 * Model for login-with-number api response
 * API:: (login-with-number) login-with-number?countryCode=:countryCode&mobileNumber=:mobileNumber
 * we have to pass a header named Access-Token in this request header
 * how to get access-token tou have to hit sendopt api for this and in response you will get this token
 */

export class LoginWithNumberResponse {
  public user: IUserDetail;
  public authKey: string;
  public isNewUser: boolean;
  public contactNumber?: string;
  public countryCode?: string;
  public statusCode?: string;
  public text?: string;
}

/**
 * Model for verify-login-otp api response
 * API:: (verify-login-otp) https://sendotp.msg91.com/api/verifyOTP
 * we have to pass a header named application-key in this request header
 * and VerifyMobileModel as request pauload
 * in return we get a response as success if otp is valid, which looks like:
 * {
 *   "status": "success",
 *  "response": {
 *       "code": "NUMBER_VERIFIED_SUCCESSFULLY",
 *       "refreshToken": "c7u0NE-Hdik8GIPmNY4vxqaOGS8DAF2cYb6Irrs8dXoEmxf3UGAFPd-luCG_o8ZrWAtVRdW0ioFc98qwNr3L3rQovoPtHDHUeLw5if0NJcIfZQ4GI0qZOmxnAeaMpLFKAxk8MIHT6S5ORRItGVJecw=="
 *   }
 * }
 * this refresh token is passed as token to login with mobile api
 */

export class VerifyLoginOTPResponse {
  public code: string;
  public refreshToken: string;
}

export class CreatedBy {
  public email: string;
  public mobileNo: string;
  public name: string;
  public uniqueName: string;
}

export class AuthKeyResponse {
  public authKey: string;
  public uniqueName: string;
}
