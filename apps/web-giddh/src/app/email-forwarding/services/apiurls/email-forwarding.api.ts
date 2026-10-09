/**
 * API endpoints for email forwarding functionality
 */

/** Base URL for company-specific endpoints */
const COMPANY_BASE_URL = 'company/:companyUniqueName';

/** Base URL for email forwarding endpoints */
const EMAIL_FORWARDING_BASE_URL = `${COMPANY_BASE_URL}/email-forwarding`;

export const EMAIL_FORWARDING_API = {
    /** Generate email communication endpoint */
    GENERATE_EMAIL: `${COMPANY_BASE_URL}/communication/generate-email`,
    
    /** Get specific email forwarding configuration */
    GET_EMAIL_FORWARDING: `${EMAIL_FORWARDING_BASE_URL}/:uniqueName`,
    
    /** Get all email forwarding configurations */
    GET_ALL_EMAIL_FORWARDING: `${EMAIL_FORWARDING_BASE_URL}/get-all`,
    
    /** Delete email forwarding configuration */
    DELETE_EMAIL_FORWARDING: `${EMAIL_FORWARDING_BASE_URL}/:uniqueName`,
    
    /** Create new email forwarding configuration */
    CREATE_EMAIL_FORWARDING: EMAIL_FORWARDING_BASE_URL,
    
    /** Update email forwarding configuration */
    UPDATE_EMAIL_FORWARDING: `${EMAIL_FORWARDING_BASE_URL}/:uniqueName`
};
