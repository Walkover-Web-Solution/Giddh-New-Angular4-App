import { Action } from '@ngrx/store';
import { AccountFlat, SearchDataSet, SearchRequest, SearchResponse } from '../../models/api-models/Search';
import { SearchActions } from '../../services/actions/search.actions';
import * as _ from 'lodash';

export interface SearchState {
  value?: AccountFlat[];
  searchLoader: boolean;
  search: boolean;
  searchDataSet: SearchDataSet[];
  searchRequest: SearchRequest;
}

export const initialState: SearchState = {
  value: [],
  searchLoader: false,
  search: false,
  searchRequest: null,
  searchDataSet: [{
    queryType: '',
    balType: 'CREDIT',
    queryDiffer: '',
    amount: ''
  }]
};

export function searchReducer(state = initialState, action: Action): SearchState {
  switch (action.type) {

    case SearchActions.SEARCH_RESPONSE: {
      return Object.assign({}, state, {
        value: flattenSearchGroupsAndAccounts(action.payload),
        searchLoader: false,
        search: true
      });
    }
    case SearchActions.SEARCH_REQUEST: {
      return Object.assign({}, state, {
        searchLoader: true,
        searchRequest: action.payload
      });
    }

    case SearchActions.SET_DIRTY_SEARCH_FORM: {
      return Object.assign({}, state, {
        search: false
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
      uniqueList = flattenSearchGroupsAndAccounts(obj.childGroups as SearchResponse[]) as AccountFlat[];
      _.each(obj.accounts, (account) => {
        let accountFlat: AccountFlat = {
          parent: obj.groupName,
          closeBalType: account.closingBalance.type,
          closingBalance: Number(account.closingBalance.amount),
          openBalType: account.openingBalance.type,
          creditTotal: Number(account.creditTotal),
          debitTotal: Number(account.debitTotal),
          openingBalance: Number(account.openingBalance),
          uniqueName: account.uniqueName,
          name: account.name
        };
        console.log(accountFlat);
        uniqueList.push(accountFlat);
        return accountFlat.openingBalance = account.openingBalance.amount;
      });
      return uniqueList;
    } else {
      _.each(obj.accounts, (account) => {
        let accountFlat: AccountFlat = {
          parent: obj.groupName,
          closeBalType: account.closingBalance.type,
          closingBalance: Number(account.closingBalance.amount),
          openBalType: account.openingBalance.type,
          creditTotal: Number(account.creditTotal),
          debitTotal: Number(account.debitTotal),
          openingBalance: Number(account.openingBalance),
          uniqueName: account.uniqueName,
          name: account.name
        };
        uniqueList.push(accountFlat);
        return accountFlat.openingBalance = account.openingBalance.amount;
      });
      return uniqueList;
    }
  });
  return _.flatten(listofUN);
};

// const flattenSearchGroupsAndAccounts = (rawList) => {
//   let listofUN;
//   listofUN = _.map(rawList, (obj: any) => {
//     let uniqueList;
//     if (!(_.isNull(obj.childGroups)) && obj.childGroups.length > 0) {
//       uniqueList = flattenSearchGroupsAndAccounts(obj.childGroups);
//       _.each(obj.accounts, (account) => {
//         account.parent = obj.groupName;
//         account.closeBalType = account.closingBalance.type;
//         account.closingBalance = account.closingBalance.amount;
//         account.openBalType = account.openingBalance.type;
//         return account.openingBalance = account.openingBalance.amount;
//       });
//       uniqueList.push(obj.accounts);
//       return uniqueList;
//     } else {
//       _.each(obj.accounts, (account) => {
//         account.parent = obj.groupName;
//         account.closeBalType = account.closingBalance.type;
//         account.closingBalance = account.closingBalance.amount;
//         account.openBalType = account.openingBalance.type;
//         return account.openingBalance = account.openingBalance.amount;
//       });
//       return obj.accounts;
//     }
//   });
//   return _.flatten(listofUN);
// };
