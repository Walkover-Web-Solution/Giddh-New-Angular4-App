
export const ACCOUNTING_API = {
    CREATE_PROJECT: `company/:companyUniqueName/project?branchUniqueName=:branchUniqueName`,
    UPDATE_PROJECT: `company/:companyUniqueName/project/:projectUniqueName?branchUniqueName=:branchUniqueName:`,
    GET_ALL_PROJECTS: `company/:companyUniqueName/project/all?branchUniqueName=:branchUniqueName&sort=:sort&sortBy=:sortBy&page=:page&count=:count&q=:q`,
    GET_PROJECT: `company/:companyUniqueName/project/:projectUniqueName?category=:category&branchUniqueName=:branchUniqueName`,
    DELETE_PROJECT: `company/:companyUniqueName/project/:projectUniqueName?branchUniqueName=:branchUniqueName`,
    GET_NET_PROFIT: `company/:companyUniqueName/project/:projectUniqueName/net-profit?from=:from&to=:to`,
};