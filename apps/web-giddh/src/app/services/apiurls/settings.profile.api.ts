const COMMON = 'company/:companyUniqueName';

export const SETTINGS_PROFILE_API = {
    GET: COMMON,
    UPDATE_COMPANY_PLAN: `${COMMON}/plan`,
    GET_BRANCH_INFO: `${COMMON}/branch/:branchUniqueName`,
    CREATE_BRANCH: `${COMMON}/branch`,
    UPDATE_BRANCH_INFO: `${COMMON}/branch/:branchUniqueName`,
    GET_COMPANY_ADDRESSES: `${COMMON}/address/all`,
    GET_LINKED_ENTITIES: `${COMMON}/sources`,
    CREATE_NEW_ADDRESS: `${COMMON}/address`,
    UPDATE_ADDRESS: `${COMMON}/address/:addressUniqueName`,
    DELETE_ADDRESS: `${COMMON}/address/:addressUniqueName`,
    CREATE_NEW_WAREHOUSE: `${COMMON}/warehouse`,
    EDIT_WAREHOUSE: `${COMMON}/warehouse/:warehouseUniqueName`
};
