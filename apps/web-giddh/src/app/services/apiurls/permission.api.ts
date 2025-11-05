const COMMON_URL = 'company/:companyUniqueName/role';

export const PERMISSION_API = {
    GET_ROLE: COMMON_URL,
    CREATE_ROLE: COMMON_URL,
    DELETE_ROLE: COMMON_URL + '/:roleUniqueName',
    UPDATE_ROLE: COMMON_URL + '/:roleUniqueName',
    GET_ALL_PAGE_NAMES: 'scope-v2'
};

export const COMPANY_WISE_AUTH_KEY_API = {
    UPDATE_AUTH: COMMON_URL + '/:userRoleUniqueName/update-auth', //PUT
    GENERATE_AUTH_KEY: COMMON_URL + '/:userRoleUniqueName/:userRoleUniqueName/generate-auth-key', //POST
    REMOVE_AUTH_KEY: COMMON_URL + '/:userRoleUniqueName/remove-auth-key', //DELETE
    GET_ROLE_BY_UNIQUE_NAME: COMMON_URL + '/:userRoleUniqueName', // GET
    GET_ROLES: COMMON_URL // GET
};