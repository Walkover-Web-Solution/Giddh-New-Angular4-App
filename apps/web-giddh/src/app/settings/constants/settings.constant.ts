/** Settings integration tabs */
export enum SettingsIntegrationTab {
    //Sms = 0,
    Email = 0,
    Collection,
    ECommerce,
    Payment,
    Tally
}

/** Country interface for Organization profile */
export interface Country {
    countryName: string;
    countryCode: string;
    currencyName: string;
    currencyCode: string;
}

/** Organization (company or branch) profile interface for Settings > Profile */
export interface OrganizationProfile {
    name: string;
    uniqueName: string;
    companyName: string,
    logo?: string;
    alias?: string;
    parent?: any;
    country?: Country;
    businessTypes?: Array<any>;
    businessType?: string;
    nameAlias?: string;
    headQuarterAlias?: string;
    balanceDecimalPlaces?: number;
    balanceDisplayFormat?: string;
    taxType: string;
    isMultipleCurrency?: boolean;
    manageInventory?: boolean;
}

/** Form type in setting aside component */
export enum SettingsAsideFormType {
    CreateAddress = 'createAddress',
    EditAddress = 'editAddress',
    CreateBranchAddress = 'createBranchAddress',
    EditBranch = 'editBranch',
    EditWarehouse = 'editWarehouse',
}

/** Aside configuration for settings */
export interface SettingsAsideConfiguration {
    type: SettingsAsideFormType;
    stateList?: Array<any>;
    tax?: {
        name: string,
        validation: Array<any>
    };
    linkedEntities?: Array<any>;
}

/** Amount Limit Duration options for integration of bank account */
export enum SettingsAmountLimitDuration {
    Daily = 'DAILY',
    Weekly = 'WEEKLY',
    Monthly = 'MONTHLY'
}

/** Unlimited amount limit text */
export const UNLIMITED_LIMIT = "UNLIMITED";
/** Status for ICICI bank registered */
export const ACCOUNT_REGISTERED_STATUS = "Registered";
