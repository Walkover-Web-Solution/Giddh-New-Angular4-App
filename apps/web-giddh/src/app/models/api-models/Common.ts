/**
 * CountryRequest class
 * Implements CountryRequest functionality
 */
export class CountryRequest {
    formName: string;
}

/**
 * CountryResponse class
 * Implements CountryResponse functionality
 */
export class CountryResponse {
    alpha2CountryCode: string;
    alpha3CountryCode: string;
    callingCode: string;
    countryName: string;
    currency: {
        code: string;
        symbol: string;
    };
}

/**
 * CurrencyResponse class
 * Implements CurrencyResponse functionality
 */
export class CurrencyResponse {
    code: string;
    symbol: string;
}

/**
 * CallingCodesResponse class
 * Implements CallingCodesResponse functionality
 */
export class CallingCodesResponse {
    callingCodes: [];
}

/**
 * OnboardingFormRequest class
 * Implements OnboardingFormRequest functionality
 */
export class OnboardingFormRequest {
    formName: string;
    country: string;
}

/**
 * OnboardingFormResponse class
 * Implements OnboardingFormResponse functionality
 */
export class OnboardingFormResponse {
    mobileNumber: {
        callingCode: string;
        regex: string;
    };
    applicableTaxes: [{
        name: string;
        uniqueName: string;
    }];
    currency: {
        code: string;
        symbol: string;
    };
    fields: [{
        regex: string;
        name: string;
        label: string;
    }];
    businessType: Array<string>;
}

/**
 * CurrentPage class
 * Implements CurrentPage functionality
 */
export class CurrentPage {
    name: string;
    url: string;
    additional: string;
}

/**
 * CommandKRequest class
 * Implements CommandKRequest functionality
 */
export class CommandKRequest {
    page: any;
    q: string;
    group: string;
    totalPages: number;
    isMobile: any;
}
