import { GraphTypesResponse } from "../../models/api-models/Dashboard";

export const DASHBOARD_API = {
    DASHBOARD: 'company/:companyUniqueName/dashboard?from=:from&to=:to&interval=:interval&refresh=:refresh', // get call
    GROUP_HISTORY: 'company/:companyUniqueName/group-history?from=:from&to=:to&interval=:interval&refresh=:refresh', // post call
    // CLOSING_BALANCE: 'company/:companyUniqueName/groups/:groupUniqueName/closing-balance?from=:fromDate&to=:toDate&refresh=:refresh', // get call
    CLOSING_BALANCE: 'v2/company/:companyUniqueName/groups/:groupUniqueName/closing-balance?from=:fromDate&to=:toDate&refresh=:refresh', // get call
    BANK_ACCOUNTS: 'company/:companyUniqueName/ebanks', // Get call
    REFRESH_BANK_ACCOUNT: 'company/:companyUniqueName/login/:loginId/token/refresh', // get call
    RECONNECT_BANK_ACCOUNT: 'company/:companyUniqueName/login/:loginId/token/reconnect',
    RATIO_ANALYSIS: 'company/:companyUniqueName/calculateRatios?date=:date&refresh=:refresh',
    REVENUE_GRAPH_TYPES: 'ui/graph-types',
    REVENUE_GRAPH_DATA: 'company/:companyUniqueName/dashboard/graph?currentFrom=:currentFrom&currentTo=:currentTo&previousFrom=:previousFrom&previousTo=:previousTo&interval=:interval&type=:type&uniqueName=:uniqueName&refresh=:refresh'
};
