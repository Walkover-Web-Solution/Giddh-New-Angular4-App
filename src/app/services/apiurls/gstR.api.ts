const COMMON_URL_FOR_GSTR = 'company/:companyUniqueName/gstreturn';

export const GSTR_API = {
  GET_OVERVIEW: COMMON_URL_FOR_GSTR + '/gstr2-transactions/summary?monthYear=:mmyyyy&gstin=:gstin',
  GET_TRANSACTIONS: COMMON_URL_FOR_GSTR + '/gstr2-transactions'
};
