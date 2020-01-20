const COMMON = 'company/:companyUniqueName/';

export const SETTINGS_BUNCH_API = {
    CREATE_BUNCH: 'bunch', // POST
    UPDATE_BUNCH: 'bunch/:bunchUniqueName', // PACTH
    GET_BUNCH: 'bunch/:bunchUniqueName', // GET
    GET_ALL_BUNCH: 'bunch', // GET
    DELETE_BUNCH: 'bunch/:bunchUniqueName', // DELETE
    ADD_COMPANIES: 'bunch/add_companies', // POST
    DELETE_COMPANIES_FROM_BUNCH: 'bunch/remove_companies', // DELETE
    GET_COMPANIES_FROM_BUNCH: 'bunch/:bunchUniqueName/companies', // PATCH
};
