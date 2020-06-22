const COMMON = 'company/:companyUniqueName';

export const SETTINGS_PERMISSION_API = {
    GET: COMMON + '/shared-with',
    GET_APPROVAL_NAME: COMMON + '/shared-with?sortBy=mobile_verified',
    UPDATE_PERMISSION: COMMON + '/uer/:ueruniquename'
};

