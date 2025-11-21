export interface ICompanyAuthKey {
    emailId: string;
    from: string;
    to: string;
    duration: string;
    period: string;
    allowedIps: string[];
    allowedCidrs: string[];
    entity: string;
    entityUniqueName: string;
    roleName: string;
    roleUniqueName: string;
    userName: string;
    userEmail: string;
    userUniqueName: string;
    uniqueName: string;
    mobileVerified: boolean;
    mobileNumber: string;
    userIsSubscriber: boolean;
    companyUniqueName: string;
    comingFromAdminPanel: boolean;
    reGenerateAuthKey: boolean;
    authKey: string;
}

export class CreateCompanyAuthKeyRequest {
    public roleName: string;
    public allowedCidrs: string[];
    public allowedIps: string[];
    public from: string;
    public to: string;
    public duration: string;
    public reGenerateAuthKey?: boolean;
}

export class UpdateCompanyAuthKeyRequest {
    public roleName: string;
    public roleUniqueName: string;
    public reGenerateAuthKey: boolean;
    public allowedCidrs: string[];
    public allowedIps: string[];
    public from: string;
    public to: string;
    public duration: string;
}
