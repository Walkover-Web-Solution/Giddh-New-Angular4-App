import { Action } from '@ngrx/store';
import { TBPlBsActions } from '../../services/actions/tl-pl.actions';
import { AccountDetails } from '../../models/api-models/tb-pl-bs';
import * as _ from 'lodash';
import { ChildGroup } from '../../models/api-models/Search';
import * as moment from 'moment';

export interface TlPlState {
  data?: AccountDetails;
  exportData: any;
  count: 0;
  detailedGroups: any;
  showTbplLoader: boolean;
  noData: boolean;
}

export const initialState: TlPlState = {
  data: null,
  noData: true,
  showTbplLoader: false,
  exportData: [],
  count: 0,
  detailedGroups: [],

};

export function tlPlReducer(state = initialState, action: Action): TlPlState {
  switch (action.type) {
    case TBPlBsActions.GET_TRIAL_BALANCE_RESPONSE: {
      let data: AccountDetails = _.cloneDeep(action.payload) as AccountDetails;
      addUIKey(data.groupDetails);
      data.groupDetails = removeZeroAmountAccount((data.groupDetails));
      let noData = false;
      let showTbplLoader = false;
      if (data.closingBalance.amount === 0 && data.creditTotal === 0 && data.debitTotal === 0 && data.forwardedBalance.amount === 0) {
        noData = true;
      }
      return Object.assign({}, state, {
        data, noData, showTbplLoader
      });
    }
    case TBPlBsActions.GET_TRIAL_BALANCE_REQUEST: {
      return Object.assign({}, state, {
        fromDate: moment(action.payload.fromDate, 'DD-MM-YYYY').toDate(),
        toDate: moment(action.payload.toDate, 'DD-MM-YYYY').toDate()
      });
    }

    case TBPlBsActions.GET_PROFIT_LOSS_RESPONSE: {
      //
      return;
    }

    case TBPlBsActions.GET_PROFIT_LOSS_REQUEST: {
      //
      return;
    }

    case TBPlBsActions.SET_DATE:
      return Object.assign({}, state, { fromDate: action.payload.fromDate, toDate: action.payload.toDate });
    default: {
      return state;
    }
  }
}

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
// const removeSd = (data) => {
//   let count = 0;
//   return _.each(data, (grp) => {
//     if (grp.childGroups.length > 0) {
//       return _.each(grp.childGroups, (ch) => {
//         count = $scope.countAccounts(ch);
//         if (ch.uniqueName === $rootScope.groupName.sundryDebtors) {
//           if (count > 50) {
//             ch.accounts = [];
//             if (ch.childGroups.length > 0) {
//               return $scope.removeAcc(ch);
//             }
//           }
//         }
//       });
//     }
//   });
// };

const addUIKey = (data: ChildGroup[]) => {
  return _.each(data, (grp) => {
    grp.isVisible = false;
    _.each(grp.accounts, (acc) => {
      return acc.isVisible = false;
    });
    return _.each(grp.childGroups, (chld) => {
      if (chld.accounts.length > 0) {
        _.each(chld.accounts, (acc) => {
          return acc.isVisible = false;
        });
      }
      chld.isVisible = false;
      if (chld.childGroups.length > 0) {
        return addUIKey(chld.childGroups);
      }
    });
  });
};
