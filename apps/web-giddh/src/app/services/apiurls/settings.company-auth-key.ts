const COMMON = 'company/:companyUniqueName';

export const SETTINGS_COMPANY_AUTH_KEY_API = {
    COMMON,
    UPDATE_AUTH_KEY: `${COMMON}/auth/:authKeyUniqueName/update`,
    GET_ALL_AUTH_KEYS: `${COMMON}/auth/all`,
    GET_AUTH_KEY: `${COMMON}/auth/:authKeyUniqueName`,
    CREATE_AUTH_KEY: `${COMMON}/auth/generate`,
    DELETE_AUTH_KEY: `${COMMON}/auth/:authKeyUniqueName/remove`
};
