import { Action } from '@ngrx/store';
import { TBPlBsActions } from '../../services/actions/tl-pl.actions';
import { AccountDetails, BalanceSheetData, ProfitLossData } from '../../models/api-models/tb-pl-bs';
import * as _ from 'lodash';
import { ChildGroup } from '../../models/api-models/Search';
import * as moment from 'moment';

interface TbState {
  data?: AccountDetails;
  exportData: ChildGroup[];
  count: 0;
  detailedGroups: any;
  showLoader: boolean;
  noData: boolean;
}

interface PlState {
  data?: ProfitLossData;
  exportData: any;
  showLoader: boolean;
  noData: boolean;
}

interface BsState {
  data?: BalanceSheetData;
  exportData: any;
  showLoader: boolean;
  noData: boolean;
}

export interface TBPlBsState {
  tb?: TbState;
  pl?: PlState;
  bs?: BsState;
}

export const initialState: TBPlBsState = {
  tb: {
    data: null,
    noData: true,
    showLoader: false,
    exportData: [],
    count: 0,
    detailedGroups: [],
  },
  pl: {
    data: null,
    noData: true,
    showLoader: false,
    exportData: [],
  },
  bs: {
    data: null,
    noData: true,
    showLoader: false,
    exportData: [],
  }
};

export function tbPlBsReducer(state = initialState, action: Action): TBPlBsState {
  switch (action.type) {
    case TBPlBsActions.GET_TRIAL_BALANCE_RESPONSE: {
      // no payload means error from server
      if (action.payload) {
        let data: AccountDetails = _.cloneDeep(action.payload) as AccountDetails;
        data.groupDetails = removeZeroAmountAccount((data.groupDetails));
        let noData = false;
        let showLoader = false;
        if (data.closingBalance.amount === 0 && data.creditTotal === 0 && data.debitTotal === 0 && data.forwardedBalance.amount === 0) {
          noData = true;
        }
        return {
          ...state,
          tb: { ...state.tb, data, noData, showLoader, exportData: data.groupDetails }
        };
      } else {
        return { ...state, tb: { ...state.tb, showLoader: false, exportData: [], data: null, noData: true } };
      }
    }
    case TBPlBsActions.GET_TRIAL_BALANCE_REQUEST: {
      return { ...state, tb: { ...state.tb, showLoader: true } };
    }

    case TBPlBsActions.GET_PROFIT_LOSS_RESPONSE: {
      let data: ProfitLossData = prepareProfitLossData(_.cloneDeep(action.payload));
      data.dates = _.cloneDeep(state.pl.data.dates);
      addVisibleFlag(data.incArr);
      addVisibleFlag(data.expArr);
      return { ...state, pl: { ...state.pl, showLoader: false, data: { ...state.pl.data, ...data } } };
    }

    case TBPlBsActions.GET_PROFIT_LOSS_REQUEST: {
      let from = moment(action.payload.from, 'DD-MM-YYYY').format('DD-MMMM-YYYY');
      let to = moment(action.payload.to, 'DD-MM-YYYY').format('DD-MMMM-YYYY');
      return {
        ...state,
        pl: { ...state.pl, showLoader: true, data: { ...state.pl.data, dates: { from, to } } }
      };
    }

    case TBPlBsActions.GET_BALANCE_SHEET_RESPONSE: {
      let data: BalanceSheetData = prepareBalanceSheetData(_.cloneDeep(action.payload));
      data.dates = _.cloneDeep(state.bs.data.dates);
      addVisibleFlag(data.assets);
      addVisibleFlag(data.liabilities);
      return { ...state, bs: { ...state.bs, showLoader: false, data: { ...state.bs.data, ...data } } };
    }

    case TBPlBsActions.GET_BALANCE_SHEET_REQUEST: {
      let from = moment(action.payload.from, 'DD-MM-YYYY').format('DD-MMMM-YYYY');
      let to = moment(action.payload.to, 'DD-MM-YYYY').format('DD-MMMM-YYYY');
      return {
        ...state,
        bs: { ...state.bs, showLoader: true, data: { ...state.bs.data, dates: { from, to } } }
      };
    }
    default: {
      return state;
    }
  }
}

// TB Functions
const removeZeroAmountAccount = (grpList: ChildGroup[]) => {
  _.each(grpList, (grp) => {
    let count = 0;
    let tempAcc = [];
    if (grp.closingBalance.amount > 0 || grp.forwardedBalance.amount > 0 || grp.creditTotal > 0 || grp.debitTotal > 0) {
      _.each(grp.accounts, (account) => {
        if (account.closingBalance.amount > 0 || account.openingBalance.amount > 0 || account.creditTotal > 0 || account.debitTotal > 0) {
          return tempAcc.push(account);
        } else {
          return count = count + 1;
        }
      });
    }
    if (tempAcc.length > 0) {
      grp.accounts = tempAcc;
    }
    if (grp.childGroups.length > 0) {
      return removeZeroAmountAccount(grp.childGroups);
    }
  });
  // console.log(grpList);

  return grpList;
};

// TB Functions
const addVisibleFlag = (grpList: ChildGroup[]) => {
  _.each(grpList, (grp) => {
    let count = 0;
    let tempAcc = [];
    grp.isVisible = false;
    _.each(grp.accounts, (account) => {
      account.isVisible = false;
    });

    if (tempAcc.length > 0) {
      grp.accounts = tempAcc;
    }
    if (grp.childGroups.length > 0) {
      return addVisibleFlag(grp.childGroups);
    }
  });
  return grpList;
};

const removeZeroAmountGroup = (grpList) => {
  return _.each(grpList, (grp: any) => {
    if (grp.childGroups.length > 0) {
      removeZeroAmountGroup(grp.childGroups);
    }
    return _.reject(grp.childGroups, (cGrp) => {
      // if (cGrp.closingBalance.amount === 0 && cGrp.forwardedBalance.amount === 0 && cGrp.creditTotal === 0 && cGrp.debitTotal === 0) {
      // //
      // }
    });
  });
};

const orderGroups = (data) => {
  let assets;
  let expenses;
  let income;
  let liabilities;
  let orderedGroups;
  orderedGroups = [];
  assets = [];
  liabilities = [];
  income = [];
  expenses = [];
  _.each(data, (grp: any) => {
    switch (grp.category) {
      case 'assets':
        return assets.push(grp);
      case 'liabilities':
        return liabilities.push(grp);
      case 'income':
        return income.push(grp);
      case 'expenses':
        return expenses.push(grp);
      default:
        return assets.push(grp);
    }
  });
  _.each(liabilities, (liability) => {
    return orderedGroups.push(liability);
  });
  _.each(assets, (asset) => {
    return orderedGroups.push(asset);
  });
  _.each(income, (inc) => {
    return orderedGroups.push(inc);
  });
  _.each(expenses, (exp) => {
    return orderedGroups.push(exp);
  });
  return orderedGroups;
};

// PL Functions

const filterProfitLossData = data => {
  let filterPlData: ProfitLossData = {};
  filterPlData.incArr = [];
  filterPlData.expArr = [];
  filterPlData.othArr = [];
  _.each(data, (grp: any) => {
    grp.isVisible = false;
    switch (grp.category) {
      case 'income':
        return filterPlData.incArr.push(grp);
      case 'expenses':
        return filterPlData.expArr.push(grp);
      default:
        return filterPlData.othArr.push(grp);
    }
  });
  return filterPlData;
};

const prepareProfitLossData = (data) => {
  let plData: ProfitLossData = filterProfitLossData(data.groupDetails);
  plData.expenseTotal = calculateTotalExpense(plData.expArr);
  plData.incomeTotal = calculateTotalIncome(plData.incArr);
  plData.closingBalance = Math.abs(plData.incomeTotal - plData.expenseTotal);
  if (plData.incomeTotal >= plData.expenseTotal) {
    plData.inProfit = true;
    // plData.expenseTotal += plData.closingBalance;
  }
  if (plData.incomeTotal < plData.expenseTotal) {
    plData.inProfit = false;
    // plData.incomeTotal += plData.closingBalance;
  }
  return plData;
};

const calculateTotalIncome = data => {
  let eTtl;
  eTtl = 0;
  _.each(data, (item: any) => {
    if (item.closingBalance.type === 'DEBIT') {
      return eTtl -= Number(item.closingBalance.amount);
    } else {
      return eTtl += Number(item.closingBalance.amount);
    }
  });
  return Number(eTtl.toFixed(2));
};

const calculateTotalExpense = data => {
  let eTtl;
  eTtl = 0;
  _.each(data, (item: any) => {
    if (item.closingBalance.type === 'CREDIT') {
      return eTtl -= Number(item.closingBalance.amount);
    } else {
      return eTtl += Number(item.closingBalance.amount);
    }
  });
  return Number(eTtl.toFixed(2));
};
// BS Functions

const filterBalanceSheetData = data => {
  let filterPlData: BalanceSheetData = {};
  filterPlData.assets = [];
  filterPlData.liabilities = [];
  filterPlData.othArr = [];
  _.each(data, (grp: any) => {
    grp.isVisible = false;
    switch (grp.category) {
      case 'assets':
        return filterPlData.assets.push(grp);
      case 'liabilities':
        return filterPlData.liabilities.push(grp);
      default:
        return filterPlData.othArr.push(grp);
    }
  });
  return filterPlData;
};

const prepareBalanceSheetData = (data) => {
  let bsData: BalanceSheetData = filterBalanceSheetData(data.groupDetails);
  bsData.assetTotal = calCulateTotalAssets(bsData.assets);
  bsData.liabTotal = calCulateTotalLiab(bsData.liabilities);
  return bsData;
};

const calCulateTotalAssets = data => {
  let total;
  total = 0;
  _.each(data, (obj: any) => {
    if (obj.closingBalance.type === 'CREDIT') {
      return total -= obj.closingBalance.amount;
    } else {
      return total += obj.closingBalance.amount;
    }
  });
  return total;
};
const calCulateTotalLiab = data => {
  let total;
  total = 0;
  _.each(data, (obj: any) => {
    if (obj.closingBalance.type === 'DEBIT') {
      return total -= obj.closingBalance.amount;
    } else {
      return total += obj.closingBalance.amount;
    }
  });
  return total;
};
