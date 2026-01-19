import { LedgerViewEnum } from "../../models/api-models/Ledger";

/** Settings integration tabs */
/**
 * SettingsIntegrationTab enumeration
 * Defines constant values for SettingsIntegrationTab
 */
export enum SettingsIntegrationTab {
    Communication = 0,
    Email = 1,
    Collection = 2,
    ECommerce = 3,
    Payment=4
}

/** Settings integration tabs V1 */
/**
 * SettingsIntegrationTabV1 enumeration
 * Defines constant values for SettingsIntegrationTabV1
 */
export enum SettingsIntegrationTabV1 {
    Email = 0,
    Collection = 1,
    ECommerce = 2,
    Payment = 3
}

/** Country interface for Organization profile */
/**
 * Country interface definition
 * Defines the structure and contract for Country objects
 */
export interface Country {
    countryName: string;
    countryCode: string;
    currencyName: string;
    currencyCode: string;
}

/** Organization (company or branch) profile interface for Settings > Profile */
/**
 * OrganizationProfile interface definition
 * Defines the structure and contract for OrganizationProfile objects
 */
export interface OrganizationProfile {
    name: string;
    uniqueName: string;
    companyName: string,
    logo?: string;
    alias?: string;
    parent?: any;
    country?: Country;
    baseCurrencySymbol?: string;
    baseCurrency?: string;
    businessTypes?: Array<any>;
    businessType?: string;
    nameAlias?: string;
    headQuarterAlias?: string;
    balanceDecimalPlaces?: number;
    balanceDisplayFormat?: string;
    taxType: string;
    isMultipleCurrency?: boolean;
    manageInventory?: boolean;
    portalDomain?: string;
    withPay?: any;
    ledgerView?: LedgerViewEnum.TView
}

/** Form type in setting aside component */
/**
 * SettingsAsideFormType enumeration
 * Defines constant values for SettingsAsideFormType
 */
export enum SettingsAsideFormType {
    CreateAddress = 'createAddress',
    EditAddress = 'editAddress',
    CreateBranchAddress = 'createBranchAddress',
    EditBranch = 'editBranch',
    EditWarehouse = 'editWarehouse',
}

/** Aside configuration for settings */
/**
 * SettingsAsideConfiguration interface definition
 * Defines the structure and contract for SettingsAsideConfiguration objects
 */
export interface SettingsAsideConfiguration {
    type: SettingsAsideFormType;
    stateList?: Array<any>;
    countyList?: Array<any>;
    tax?: {
        name: string,
        validation: Array<any>
    };
    linkedEntities?: Array<any>;
}

/** Amount Limit Duration options for integration of bank account */
/**
 * SettingsAmountLimitDuration enumeration
 * Defines constant values for SettingsAmountLimitDuration
 */
export enum SettingsAmountLimitDuration {
    Daily = 'DAILY',
    Weekly = 'WEEKLY',
    Monthly = 'MONTHLY'
}

/** Unlimited amount limit text */
export const UNLIMITED_LIMIT = "UNLIMITED";
/** Status for ICICI bank registered */
export const ACCOUNT_REGISTERED_STATUS = "Registered";