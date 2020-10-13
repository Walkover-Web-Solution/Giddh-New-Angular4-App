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
    currencyName: string;
    currencyCode: string;
}

/** Organization (company or branch) profile interface for Settings > Profile */
export interface OrganizationProfile {
    name: string;
    uniqueName: string;
    logo?: string;
    alias?: string;
    parent?: any;
    country?: Country;
    businessTypes?: Array<any>;
    businessType?: string;
    headquarterAlias?: string;
    balanceDecimalPlaces?: number;
    balanceDisplayFormat?: string;
}
