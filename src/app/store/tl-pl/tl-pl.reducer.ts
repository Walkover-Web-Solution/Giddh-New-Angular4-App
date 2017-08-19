import { Action } from '@ngrx/store';
import { TBPlBsActions } from '../../services/actions/tl-pl.actions';
import { AccountDetails, ProfitLossData } from '../../models/api-models/tb-pl-bs';
import * as _ from 'lodash';
import { ChildGroup } from '../../models/api-models/Search';

interface TbState {
  data?: AccountDetails;
  exportData: any;
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

export interface TBPlBsState {
  tb?: TbState;
  pl?: PlState;
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
  }
};

export function tbPlBsReducer(state = initialState, action: Action): TBPlBsState {
  switch (action.type) {
    case TBPlBsActions.GET_TRIAL_BALANCE_RESPONSE: {
      let data: AccountDetails = _.cloneDeep(action.payload) as AccountDetails;
      data.groupDetails = removeZeroAmountAccount((data.groupDetails));
      let noData = false;
      let showLoader = false;
      if (data.closingBalance.amount === 0 && data.creditTotal === 0 && data.debitTotal === 0 && data.forwardedBalance.amount === 0) {
        noData = true;
      }
      return Object.assign({}, state, {
        tb: { data, noData, showLoader }
      });
    }
    case TBPlBsActions.GET_TRIAL_BALANCE_REQUEST: {
      return { ...state, tb: { ...state.tb, showLoader: true } };
    }

    case TBPlBsActions.GET_PROFIT_LOSS_RESPONSE: {
      let data: ProfitLossData = prepareProfitLossData(_.cloneDeep(action.payload));
      console.log(data);
      return { ...state, pl: { ...state.pl, showLoader: false, data } };
    }

    case TBPlBsActions.GET_PROFIT_LOSS_REQUEST: {
      return { ...state, pl: { ...state.pl, showLoader: true } };
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

const removeZeroAmountGroup = (grpList) => {
  return _.each(grpList, (grp) => {
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
  _.each(data, (grp) => {
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
  _.each(data, grp => {
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
    plData.expenseTotal += plData.closingBalance;
  }
  if (plData.incomeTotal < plData.expenseTotal) {
    plData.inProfit = false;
    plData.incomeTotal += plData.closingBalance;
  }
  return plData;
};

const calculateTotalIncome = data => {
  let eTtl;
  eTtl = 0;
  _.each(data, item => {
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
  _.each(data, item => {
    if (item.closingBalance.type === 'CREDIT') {
      return eTtl -= Number(item.closingBalance.amount);
    } else {
      return eTtl += Number(item.closingBalance.amount);
    }
  });
  return Number(eTtl.toFixed(2));
};
