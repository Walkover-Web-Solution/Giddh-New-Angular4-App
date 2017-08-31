import { Configuration } from '../../app.constant';
const COMMON = Configuration.ApiUrl + 'company/:companyUniqueName/';

export const SETTINGS_FINANCIAL_YEAR_API = {
  GET_ALL_FINANCIAL_YEARS: COMMON + 'financial-year', // GET
  LOCK_FINANCIAL_YEAR: 'financial-year-lock', // PATCH
  UNLOCK_FINANCIAL_YEAR: '',
};
