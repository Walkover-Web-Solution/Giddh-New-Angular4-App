let COMMON_URL = 'company/:companyUniqueName/role';

export const PERMISSION_API = {
    GET_ROLE: COMMON_URL,
    CREATE_ROLE: COMMON_URL,
    DELETE_ROLE: COMMON_URL + '/:roleUniqueName',
    UPDATE_ROLE: COMMON_URL + '/:roleUniqueName',
    GET_ALL_PAGE_NAMES: 'scope-v2',
    SHARE_COMPANY: 'company/:companyUniqueName/share',
    UN_SHARE_COMPANY: 'company/:companyUniqueName/unshare',
    COMPANY_SHARED_WITH: 'company/:companyUniqueName/shared-with',
};
