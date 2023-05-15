export const SEARCH_API = {
    SEARCH: 'v2/company/:companyUniqueName/groups/:groupName/account-closing-balance?count=:count&from=:from&to=:to&refresh=:refresh&page=:page', // POST call
    ACCOUNT_SEARCH: 'company/:companyUniqueName/:version/account-search',
    ACCOUNT_SEARCH_V2: 'company/:companyUniqueName/account-search-2',
    ACCOUNT_DETAIL: ':version/company/:companyUniqueName/particular/:accountUniqueName',
};
