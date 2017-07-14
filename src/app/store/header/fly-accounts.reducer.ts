import { Action } from '@ngrx/store';
import { AccountFlat, SearchResponse } from '../../models/api-models/Search';
import * as _ from 'lodash';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';

export interface FlyAccountsState {
  flattenGroupsAccounts: IFlattenGroupsAccountsDetail[];
  showAccountList: boolean;
}

export const initialState: FlyAccountsState = {
  flattenGroupsAccounts: [],
  showAccountList: false
};

export function FlyAccountsReducer(state = initialState, action: Action): FlyAccountsState {
  switch (action.type) {
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
        debugger;
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

