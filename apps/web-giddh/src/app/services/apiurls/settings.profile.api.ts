const COMMON = 'company/:companyUniqueName';

export const SETTINGS_PROFILE_API = {
    GET: COMMON,
    UPDATE_COMPANY_PLAN: `${COMMON}/plan`,
    GET_BRANCH_INFO: `${COMMON}/branch/:branchUniqueName`,
    UPDATE_BRANCH_INFO: `${COMMON}/branch/:branchUniqueName`,
    GET_COMPANY_ADDRESSES: `${COMMON}/address/all`
};
