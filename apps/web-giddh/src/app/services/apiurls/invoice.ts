export const INVOICE_API = {
    // GET_USER_TEMPLATES: 'templates-v2/sample-templates',
    GET_USER_TEMPLATES: 'v2/sample-templates',
    // CREATE_NEW_TEMPLATE: 'company/:companyUniqueName/templates-v2', // POST
    CREATE_NEW_TEMPLATE: 'v2/company/:companyUniqueName/templates', // POST
    UPDATE_TEMPLATE: 'v2/company/:companyUniqueName/templates/:templateUniqueName', // PUT
    // GET_CREATED_TEMPLATES: 'company/:companyUniqueName/templates-v2', // GET
    GET_CREATED_TEMPLATES: 'v2/company/:companyUniqueName/templates?type=:voucherType', // GET
    // GET_CUSTOM_TEMPLATE: 'company/:companyUniqueName/templates-v2/:templateUniqueName', // GET
    GET_CUSTOM_TEMPLATE: 'v2/company/:companyUniqueName/templates/:templateUniqueName', // GET
    // SET_AS_DEFAULT: 'company/:companyUniqueName/templates-v2/:templateUniqueName/default', // PATCH
    SET_AS_DEFAULT: 'v2/company/:companyUniqueName/templates/:templateUniqueName/default?type=:voucherType', // PATCH
    // DELETE_TEMPLATE: 'company/:companyUniqueName/templates-v2/:templateUniqueName', // DELETE
    DELETE_TEMPLATE: 'v2/company/:companyUniqueName/templates/:templateUniqueName', // DELETE
    UPLOAD_LOGO: 'company/:companyUniqueName/images', // POST
};
