import { Action } from '@ngrx/store';
import { TBPlBsActions } from '../../actions/tl-pl.actions';
import { AccountDetails, BalanceSheetData, ProfitLossData } from '../../models/api-models/tb-pl-bs';
import * as _ from '../../lodash-optimized';
import { ChildGroup } from '../../models/api-models/Search';
import { CustomActions } from '../customActions';
import { DayBookApiModel } from 'app/models/api-models/Daybook';
import { DaybookActions } from 'app/actions/daybook/daybook.actions';
import { DayBookRequestModel, Inventory } from 'app/models/api-models/DaybookRequest';

interface Daybook {
  data?: DayBookRequestModel;
  exportData: Inventory;
  count: 0;
  // detailedGroups: any;
  showLoader: boolean;
  noData: boolean;
}

export const initialState: Daybook = {
    data: null,
    noData: true,
    showLoader: false,
    exportData: null,
    count: 0,
    // detailedGroups: [],
};

export function daybookReducer(state = initialState, action: CustomActions): Daybook {
  switch (action.type) {
    case DaybookActions.GET_DAYBOOK_RESPONSE: {
      // no payload means error from server
      if (action.payload) {
        let data: DayBookRequestModel = _.cloneDeep(action.payload) as DayBookRequestModel;
        //data.groupDetails = removeZeroAmountAccount((data.groupDetails));
        let noData = false;
        let showLoader = false;
        if (data === null ) {
          //&& data. === 0 && data.debitTotal === 0 && data.forwardedBalance.amount === 0
          noData = true;
        }
        return {...state, data, noData, showLoader, exportData: data.inventory };
      } else {
        return { ...state,  showLoader: false, exportData: null, data: null, noData: true };
      }
    }
    case TBPlBsActions.GET_TRIAL_BALANCE_REQUEST: {
      return { ...state, showLoader: true };
    }
    default: {
      return state;
    }
  }
}

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