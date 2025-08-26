
export const ACCOUNTING_API = {
    CREATE_PROJECT: `company/:companyUniqueName/project?branchUniqueName=:branchUniqueName`,
    UPDATE_PROJECT: `company/:companyUniqueName/project/:projectUniqueName?branchUniqueName=:branchUniqueName`,
    GET_ALL_PROJECTS: `company/:companyUniqueName/project/all?branchUniqueName=:branchUniqueName&sort=:sort&sortBy=:sortBy&page=:page&count=:count&q=:searchQuery&queryColumn=:queryColumn`,
    DELETE_PROJECT: `company/:companyUniqueName/project/:projectUniqueName?branchUniqueName=:branchUniqueName`,
    GET_NET_PROFIT: `company/:companyUniqueName/project/:projectUniqueName/net-profit?from=:from&to=:to`,
    GET_PROJECT: `company/:companyUniqueName/project/:projectUniqueName?branchUniqueName=:branchUniqueName`,
    CREATE_AND_DELETE_ENTRY: `company/:companyUniqueName/project/:projectUniqueName/entry`,
    UPDATE_ENTRY: `company/:companyUniqueName/project/:projectUniqueName/entry/:entryUniqueName`,
    ENTRY_SEARCH: `company/:companyUniqueName/accounts/:accountUniqueName/project-entries?from=:from&to=:to&page=:page&count=:count&branchUniqueName=:branchUniqueName&q=:q&categoryType=:category`,
    GET_ALL_ENTRY: `company/:companyUniqueName/project/:projectUniqueName/entries?category=:category&branchUniqueName=:branchUniqueName&page=:page&count=:count`,
    GET_PROJECT_PROFIT_LOSS: `company/:companyUniqueName/project/:projectUniqueName/profit-loss?from=:from&to=:to`,
    GET_TOTAL_REVENUE_EXPENSES: "company/:companyUniqueName/project/:projectUniqueName/category-total?category=:category"
};