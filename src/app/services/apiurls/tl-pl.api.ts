
export const TB_PL_BS_API = {
  GET_TRIAL_BALANCE: 'company/:companyUniqueName/trial-balance', // get call
  GET_BALANCE_SHEET: 'company/:companyUniqueName/v2/balance-sheet',
  // GET_PROFIT_LOSS: 'company/:companyUniqueName/v2/profit-loss',
  GET_PROFIT_LOSS: 'company/:companyUniqueName/v3/profit-loss',
  DOWNLOAD_TRIAL_BALANCE_EXCEL: 'company/:companyUniqueName/trial-balance-export',
  DOWNLOAD_BALANCE_SHEET_EXCEL: 'company/:companyUniqueName/v2/balance-sheet-collapsed-download',
  DOWNLOAD_PROFIT_LOSS_EXCEL: 'company/:companyUniqueName/v2/profit-loss-collapsed-download',
};
