export const INVOICE_API = {
    GET_USER_TEMPLATES: 'v2/company/:companyUniqueName/sample-templates',
    CREATE_NEW_TEMPLATE: 'v2/company/:companyUniqueName/templates', // POST
    UPDATE_TEMPLATE: 'v2/company/:companyUniqueName/templates/:templateUniqueName', // PUT
    GET_CREATED_TEMPLATES: 'v2/company/:companyUniqueName/templates?type=:voucherType', // GET
    SET_AS_DEFAULT: 'v2/company/:companyUniqueName/templates/:templateUniqueName/default?type=:voucherType', // PATCH
    DELETE_TEMPLATE: 'v2/company/:companyUniqueName/templates/:templateUniqueName', // DELETE
    UPLOAD_LOGO: 'company/:companyUniqueName/images', // POST
};
