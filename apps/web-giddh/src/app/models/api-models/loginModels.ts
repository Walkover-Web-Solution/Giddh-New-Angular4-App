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
