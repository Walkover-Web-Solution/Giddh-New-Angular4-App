import { Action } from '@ngrx/store';
import { AccountFlat, SearchDataSet, SearchResponse } from '../../models/api-models/Search';
import { SearchActions } from '../../services/actions/search.actions';
import * as _ from 'lodash';

export interface SearchState {
  value?: AccountFlat[];
  searchLoader: boolean;
  searchDataSet: SearchDataSet[];
}

export const initialState: SearchState = {
  value: [],
  searchLoader: false,
  searchDataSet: [{
    queryType: '',
    balType: 'CREDIT',
    queryDiffer: '',
    amount: '',
  }]
};

export function searchReducer(state = initialState, action: Action): SearchState {
  switch (action.type) {

    case SearchActions.SEARCH_RESPONSE: {
      return Object.assign({}, state, {
        value: flattenSearchGroupsAndAccounts(action.payload),
        searchLoader: false
      });
    }
    case SearchActions.SEARCH_REQUEST: {
      return Object.assign({}, state, {
        searchLoader: true
      });
    }
    default: {
      return state;
    }
  }
}

const flattenSearchGroupsAndAccounts = (rawList: SearchResponse[]) => {
  let listofUN;
  listofUN = rawList.map((obj) => {
    let uniqueList: AccountFlat[] = [];
    if (!(_.isNull(obj.childGroups)) && obj.childGroups.length > 0) {
      return flattenSearchGroupsAndAccounts(obj.childGroups as SearchResponse[]) as AccountFlat[];
    } else {
      _.each(obj.accounts, (account) => {
        let accountFlat: AccountFlat = {
          parent: obj.groupName,
          closeBalType: account.closingBalance.type,
          closingBalance: account.closingBalance.amount,
          openBalType: account.openingBalance.type,
          creditTotal: account.creditTotal,
          debitTotal: account.debitTotal,
          openingBalance: account.openingBalance,
          uniqueName: obj.uniqueName,
          name: obj.groupName
        };
        uniqueList.push(accountFlat);
        return accountFlat.openingBalance = account.openingBalance.amount;
      });
      return uniqueList;
    }
  });
  return _.flatten(listofUN);
};
