const COMMON = 'company/:companyUniqueName/';

export const SETTINGS_TAG_API = {
    GET_ALL_TAGS: COMMON + 'tags', // GET
    CREATE_TAG: COMMON + 'tags', // POST
    UPDATE_TAG: COMMON + 'tags/:tagUniqueName', // PUT
    DELETE_TAG: COMMON + 'tags/:tagUniqueName' // DELETE
};
