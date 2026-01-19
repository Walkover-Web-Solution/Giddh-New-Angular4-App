/**
 * ICompanyAuthKey interface definition
 * Defines the structure and contract for ICompanyAuthKey objects
 */
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

/**
 * CreateCompanyAuthKeyRequest class
 * Implements CreateCompanyAuthKeyRequest functionality
 */
export class CreateCompanyAuthKeyRequest {
    public roleName: string;
    public from: string; // dd-MM-yyyy format
    public to: string; // dd-MM-yyyy format
    public duration: string; // numeric
    public period: string; // DAY
    public allowedIps: any[]; // array of strings
    public allowedCidrs: any[]; // array of strings
    public ipsStr?: string; // converted from array for UI
    public cidrsStr?: string; // converted from array for UI
    public reGenerateAuthKey?: boolean;
    public roleUniqueName?: string;
    public dateRange?: any;
}

/**
 * UpdateCompanyAuthKeyRequest class
 * Implements UpdateCompanyAuthKeyRequest functionality
 */
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
