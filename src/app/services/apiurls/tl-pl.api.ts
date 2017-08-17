import { Configuration } from '../../app.constant';

export const TB_PL_BS_API = {
  GET_TRIAL_BALANCE: Configuration.ApiUrl + '/company/:companyUniqueName/trial-balance', // get call
  GET_BALANCE_SHEET: Configuration.ApiUrl + '/company/:companyUniqueName/trial-balance/balance-sheet',
  GET_PROFIT_LOSS: Configuration.ApiUrl + '/company/:companyUniqueName/trial-balance/profit-loss',
  DOWNLOAD_TRIAL_BALANCE_EXCEL: Configuration.ApiUrl + '/company/:companyUniqueName/trial-balance/excel-export',
  DOWNLOAD_BALANCE_SHEET_EXCEL: Configuration.ApiUrl + '/company/:companyUniqueName/balance-sheet/balance-sheet-collapsed-download',
  DOWNLOAD_PROFIT_LOSS_EXCEL: Configuration.ApiUrl + '/company/:companyUniqueName/profit-loss/profit-loss-collapsed-download',
};
