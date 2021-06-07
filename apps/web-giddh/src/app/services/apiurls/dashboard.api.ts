export const DASHBOARD_API = {
    CLOSING_BALANCE: 'v2/company/:companyUniqueName/groups/:groupUniqueName/closing-balance?from=:fromDate&to=:toDate&refresh=:refresh', // get call
    RATIO_ANALYSIS: 'company/:companyUniqueName/calculateRatios?date=:date&refresh=:refresh',
    REVENUE_GRAPH_TYPES: 'ui/graph-types',
    REVENUE_GRAPH_DATA: 'company/:companyUniqueName/dashboard/graph?currentFrom=:currentFrom&currentTo=:currentTo&previousFrom=:previousFrom&previousTo=:previousTo&interval=:interval&type=:type&uniqueName=:uniqueName&refresh=:refresh'
};
