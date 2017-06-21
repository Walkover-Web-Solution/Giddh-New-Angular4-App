export class VerifyEmailModel {
  public email: string;
  public verificationCode: string;
}

export class VerifyEmailResponseModel {
  public user: UserDetails;
  public authKey: string;
  public isNewUser: boolean;
  public contactNumber: string;
  public countryCode: string;
  public statusCode: string;
  public text: string;
}

export class UserDetails {
  public name: string;
  public email: string;
  public contactNo: string;
  public uniqueName: string;
  public anAdmin: boolean;
}

export class SignupWithMobile {
  public mobileNumber: number;
  public countryCode: number = 91;
}
export class SignupWithMobileResponse {
  public code: string;
}

export class VerifyMobileModel {
  public mobileNumber: number;
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
}
