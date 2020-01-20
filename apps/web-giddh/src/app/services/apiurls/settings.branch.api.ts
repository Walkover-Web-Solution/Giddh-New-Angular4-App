const COMMON = 'company/:companyUniqueName/';

export const SETTINGS_BRANCH_API = {
    GET_ALL_BRANCHES: COMMON + 'children?from=:from&to=:to', // GET
    GET_PARENT: COMMON + 'parent', // GET
    CREATE_BRANCHES: COMMON + 'set-branches', // POST
    REMOVE_BRANCH: COMMON + 'child/:childUniqueName', // DELETE
    GET_PARENT_COMPANY: COMMON + 'parent', // GET
};

