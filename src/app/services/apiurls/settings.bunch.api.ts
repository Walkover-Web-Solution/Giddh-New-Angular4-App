
const COMMON = 'company/:companyUniqueName/';

export const SETTINGS_BUNCH_API = {
  CREATE_BUNCH: COMMON + 'bunch', // POST
  UPDATE_BUNCH: COMMON + 'bunch/:bunchUniqueName', // PACTH
  GET_BUNCH: COMMON + 'bunch/:bunchUniqueName', // GET
  GET_ALL_BUNCH: COMMON + 'bunch', // GET
  DELETE_BUNCH: COMMON + 'bunch/:bunchUniqueName', // DELETE
  ADD_COMPANIES: COMMON + 'bunch/add_companies', // POST
  DELETE_COMPANIES_FROM_BUNCH: COMMON + 'bunch/remove_companies', // DELETE
  GET_COMPANIES_FROM_BUNCH: COMMON + 'bunch/remove_companies', // PATCH
};
