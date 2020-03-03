const COMMON = 'company/:companyUniqueName/';

export const SETTINGS_FINANCIAL_YEAR_API = {
    GET_ALL_FINANCIAL_YEARS: COMMON + 'financial-year', // GET
    LOCK_FINANCIAL_YEAR: COMMON + 'financial-year-lock', // PATCH
    UNLOCK_FINANCIAL_YEAR: COMMON + 'financial-year-unlock', // PATCH
    SWITCH_FINANCIAL_YEAR: COMMON + 'active-financial-year', // PATCH
    ADD_FINANCIAL_YEAR: COMMON + 'financial-year', // POST
    UPDATE_FY_PERIOD: COMMON + 'financial-year', // PUT,
    ADD_FUTURE_FINANCIAL_YEAR: COMMON + 'future-financial-year', // POST
};
