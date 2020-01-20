let COMMON_URL = 'company/:companyUniqueName/stock/:stockUniqueName/manufacture';
export const MANUFACTURING_API = {
    GET: COMMON_URL + '/:manufacturingUniqueName',
    CREATE: COMMON_URL,
    UPDATE: COMMON_URL + '/:manufacturingUniqueName',
    DELETE: COMMON_URL + '/:manufacturingUniqueName',
    MF_REPORT: 'company/:companyUniqueName/stock/manufacture-report?',
    GET_STOCK_WITH_RATE: 'company/:companyUniqueName/stock/:stockUniqueName/link-with-rates'
};
