/**
 * VerifyEmailModel class
 * Implements VerifyEmailModel functionality
 */
export class VerifyEmailModel {
    public email: string;
    public verificationCode: string;
}
/**
 * SignupwithEmaillModel class
 * Implements SignupwithEmaillModel functionality
 */
export class SignupwithEmaillModel {
    public email: string;
    public retryCount: number;
}

/**
 * VerifyEmailResponseModel class
 * Implements VerifyEmailResponseModel functionality
 */
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

/**
 * Session interface definition
 * Defines the structure and contract for Session objects
 */
export interface Session {
    id: string;
    expiresAt: string;
    createdAt: string;
}

/**
 * UserDetails class
 * Implements UserDetails functionality
 */
export class UserDetails {
    public name: string;
    public email: string;
    public mobileNo: string;
    public contactNo: string;
    public uniqueName: string;
    public anAdmin: boolean;
    public authenticateTwoWay: boolean;
    public hasSubscriptionPermission?: boolean;
    public availableCredit: boolean;
    public isNewUser: boolean;
    public subUser: boolean;
    public subUsers: any[];
    public createdAt: string;
    public updatedAt: string;
    public createdBy: CreatedBy;
    public updatedBy: CreatedBy;
}

/**
 * SignupWithMobile class
 * Implements SignupWithMobile functionality
 */
export class SignupWithMobile {
    public mobileNumber: string;
    public countryCode: number = 91;
}


/**
 * VerifyMobileModel class
 * Implements VerifyMobileModel functionality
 */
export class VerifyMobileModel {
    public mobileNumber: string;
    public countryCode: number = 91;
    public oneTimePassword: string;
}

/**
 * VerifyMobileResponseModel class
 * Implements VerifyMobileResponseModel functionality
 */
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
 * CreatedBy class
 * Implements CreatedBy functionality
 */
export class CreatedBy {
    public email: string;
    public mobileNo: string;
    public name: string;
    public uniqueName: string;
}

/**
 * AuthKeyResponse class
 * Implements AuthKeyResponse functionality
 */
export class AuthKeyResponse {
    public authKey: string;
    public uniqueName: string;
}
