/** Settings integration tabs */
export enum SettingsIntegrationTab {
    Sms = 0,
    Email,
    Collection,
    ECommerce,
    Payment
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
    balanceDecimalPlaces?: number;
    balanceDisplayFormat?: string;
}

export enum SettingsAsideFormType {
    CreateAddress = 'createAddress',
    EditAddress = 'editAddress',
    CreateBranchAddress = 'createBranchAddress',
    EditBranch = 'editBranch'
}

export interface SettingsAsideConfiguration {
    type: SettingsAsideFormType;
    stateList?: Array<any>;
    tax?: {
        name: string,
        validation: Array<any>
    };
    linkedEntities?: Array<any>;
}
