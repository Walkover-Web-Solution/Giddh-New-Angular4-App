export const TB_PL_BS_API = {
    // GET_TRIAL_BALANCE: 'company/:companyUniqueName/trial-balance', // get call
    GET_V2_TRIAL_BALANCE: 'v2/company/:companyUniqueName/trial-balance', // get call
    GET_TRIAL_BALANCE: 'v2/company/:companyUniqueName/multibranch/trial-balance', // get call
    // GET_BALANCE_SHEET: 'company/:companyUniqueName/v2/balance-sheet',
    GET_BALANCE_SHEET: 'v2/company/:companyUniqueName/multibranch/balance-sheet',
    // GET_PROFIT_LOSS: 'company/:companyUniqueName/v2/profit-loss',
    // GET_PROFIT_LOSS: 'company/:companyUniqueName/v3/profit-loss?tax=30', // tax by Shubhendra sir
    GET_PROFIT_LOSS: 'v2/company/:companyUniqueName/multibranch/profit-loss?tax=30', // tax by Shubhendra sir
    GET_COGS: 'v2/company/:companyUniqueName/cogs', // tax by Shubhendra sir
    DOWNLOAD_TRIAL_BALANCE_EXCEL: 'company/:companyUniqueName/trial-balance-export',
    DOWNLOAD_BALANCE_SHEET_EXCEL: 'company/:companyUniqueName/v2/balance-sheet-collapsed-download',
    DOWNLOAD_PROFIT_LOSS_EXCEL: 'company/:companyUniqueName/v2/profit-loss-collapsed-download',
};

