let COMMON_URL = 'company/:companyUniqueName/stock/:stockUniqueName/manufacture';
export const MANUFACTURING_API = {
    CREATE: COMMON_URL,
    UPDATE: COMMON_URL + '/:manufacturingUniqueName',
    DELETE: COMMON_URL + '/:manufacturingUniqueName',
    MF_REPORT: 'company/:companyUniqueName/stock/manufacture-report?',
    GET_STOCK_WITH_RATE: 'company/:companyUniqueName/stock/:stockUniqueName/link-with-rates',
    GET_RECIPE: 'company/:companyUniqueName/stock/:stockUniqueName/recipe/get?withRate=:withRate',
    GET_RATE_FOR_STOCK: 'company/:companyUniqueName/stock/:stockUniqueName/rate-for-stock-v2',
    CREATE_V2: 'v2/' + COMMON_URL,
    CREATE_RECIPE: 'company/:companyUniqueName/stock/:stockUniqueName/recipe',
    GET_MANUFACTURING: 'v2/company/:companyUniqueName/manufacture/:manufactureUniqueName',
    GET_STOCK_UNITS: 'company/:companyUniqueName/stock-unit/:stockUnitUniqueName/linked-stock-units'
};
