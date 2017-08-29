import { Action } from '@ngrx/store';
import { AccountFlat, SearchResponse } from '../../models/api-models/Search';
import * as _ from 'lodash';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { FlyAccountsActions } from '../../services/actions/fly-accounts.actions';

export interface FlyAccountsState {
  flattenGroupsAccounts: IFlattenGroupsAccountsDetail[];
  showAccountList: boolean;
  noGroups: boolean;
  flyAccounts: boolean;
}

export const initialState: FlyAccountsState = {
  flattenGroupsAccounts: [],
  showAccountList: false,
  noGroups: false,
  flyAccounts: false
};

export function FlyAccountsReducer(state = initialState, action: Action): FlyAccountsState {
  switch (action.type) {
    case FlyAccountsActions.GET_FLAT_ACCOUNT_W_GROUP_RESPONSE:
      return Object.assign({}, state, { flattenGroupsAccounts: prepare(action.payload.results ? action.payload.results : []) });
    case FlyAccountsActions.RESET_FLAT_ACCOUNT_W_GROUP:
      return Object.assign({}, state, { flattenGroupsAccounts: prepare([]) });
    default: {
      return state;
    }
  }
}

const prepare = (data: IFlattenGroupsAccountsDetail[]) => {
  return data.map(p => {
    return {
      accountDetails: p.accountDetails,
      groupName: p.groupName,
      applicableTaxes: p.applicableTaxes,
      groupSynonyms: p.groupSynonyms,
      isOpen: false,
      groupUniqueName: p.groupUniqueName
    };
  });
};
const flattenSearchGroupsAndAccounts = (rawList: SearchResponse[]) => {
  let listofUN;
  listofUN = rawList.map((obj) => {
    let uniqueList: AccountFlat[] = [];
    if (!(_.isNull(obj.childGroups)) && obj.childGroups.length > 0) {
      uniqueList = flattenSearchGroupsAndAccounts(obj.childGroups as SearchResponse[]) as AccountFlat[];
      _.each(obj.accounts, (account) => {
        let accountFlat: AccountFlat = {
          parent: obj.groupName,
          closeBalanceType: account.closingBalance.type,
          closingBalance: Number(account.closingBalance.amount),
          openBalanceType: account.openingBalance.type,
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
    } else {
      _.each(obj.accounts, (account) => {
        let accountFlat: AccountFlat = {
          parent: obj.groupName,
          closeBalanceType: account.closingBalance.type,
          closingBalance: Number(account.closingBalance.amount),
          openBalanceType: account.openingBalance.type,
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
