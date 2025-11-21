const COMMON = 'company/:companyUniqueName/role';

export const SETTINGS_COMPANY_AUTH_KEY_API = {
    COMMON,
    UPDATE_AUTH_KEY: COMMON + '/:userRoleUniqueName/update-auth',
    GET_ALL_AUTH_KEYS: COMMON + '/auth-key/all',
    GET_AUTH_KEY: COMMON + '/auth-key/:roleUser',
    CREATE_AUTH_KEY: COMMON + '/:roleUniqueName/generate-auth-key',
    DELETE_AUTH_KEY: COMMON + '/:userRoleUniqueName/remove-auth-key'
};
