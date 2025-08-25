export const INVOICE_API = {
    GET_USER_TEMPLATES: 'v2/company/:companyUniqueName/sample-templates?type=:voucherType',
    CREATE_NEW_TEMPLATE: 'v2/company/:companyUniqueName/templates', // POST
    UPDATE_TEMPLATE: 'v2/company/:companyUniqueName/templates/:templateUniqueName', // PUT
    GET_CREATED_TEMPLATES: 'v2/company/:companyUniqueName/templates?type=:voucherType', // GET
    GET_TEMPLATE_PREVIEW: 'v2/company/:companyUniqueName/templates/:templateUniqueName?type=:voucherType&voucherVersion=2', // GET
    SET_AS_DEFAULT: 'v2/company/:companyUniqueName/templates/:templateUniqueName/default?type=:voucherType', // PATCH
    DELETE_TEMPLATE: 'v2/company/:companyUniqueName/templates/:templateUniqueName', // DELETE
    UPLOAD_LOGO: 'company/:companyUniqueName/images' // POST
};
