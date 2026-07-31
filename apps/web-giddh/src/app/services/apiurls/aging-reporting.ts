const COMMON_URL_FOR_DUEDAYSRANGE_V2 = 'dev/company/:companyUniqueName/due-days-range?vendorCustomerType=:vendorCustomerType';
const COMMON_URL_FOR_DUEAMOUNTREPORT_V2 = 'company/:companyUniqueName/due-amount-report?q=:q&page=:page&count=:count&sort=:sort&sortBy=:sortBy&rangeCol=:rangeCol&vendorCustomerType=:vendorCustomerType';


export const DUEDAYSRANGE_API_V2 = {
    CREATE: COMMON_URL_FOR_DUEDAYSRANGE_V2
};

export const DUEAMOUNTREPORT_API_V2 = {
    GET: COMMON_URL_FOR_DUEAMOUNTREPORT_V2
};

export const AGINGREPORT_API = {
    // Export Aging Report
    EXPORT: 'company/:companyUniqueName/exports'
}


