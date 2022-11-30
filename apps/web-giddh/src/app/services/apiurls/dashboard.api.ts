export const DASHBOARD_API = {
    GET_PENDING_VOUCHERS_COUNT: 'company/:companyUniqueName/vouchers/voucher-status-count?from=:fromDate&to=:toDate&type=:type&voucherVersion=2',
    RATIO_ANALYSIS: 'company/:companyUniqueName/calculateRatios?date=:date&refresh=:refresh',
    REVENUE_GRAPH_TYPES: 'ui/graph-types',
    REVENUE_GRAPH_DATA: 'company/:companyUniqueName/dashboard/graph?currentFrom=:currentFrom&currentTo=:currentTo&previousFrom=:previousFrom&previousTo=:previousTo&interval=:interval&type=:type&uniqueName=:uniqueName&refresh=:refresh'
};
