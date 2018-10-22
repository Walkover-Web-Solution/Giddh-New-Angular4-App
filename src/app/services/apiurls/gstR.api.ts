const COMMON_URL_FOR_GSTR = 'company/:companyUniqueName/gstreturn';

export const GSTR_API = {
  GET_OVERVIEW: COMMON_URL_FOR_GSTR + '/:gstType-transactions/summary?monthYear=:mmyyyy&gstin=:gstin',
  GET_TRANSACTIONS: COMMON_URL_FOR_GSTR + '/:gstType-transactions?monthYear=:mmyyyy&gstin=:gstin&entityType=:entityType&type=:type&Status=:status'
};
