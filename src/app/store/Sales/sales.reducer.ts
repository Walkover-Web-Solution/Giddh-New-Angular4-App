import { Action } from '@ngrx/store';
import * as _ from 'lodash';
import { SALES_ACTIONS } from '../../services/actions/sales/sales.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AccountResponseV2, FlattenAccountsResponse } from '../../models/api-models/Account';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { IOption } from '../../shared/theme/index';
import { INameUniqueName } from '../../models/interfaces/nameUniqueName.interface';

export interface SalesState {
  invObj: any;
  acDtl: AccountResponseV2;
  hierarchicalStockGroups: IOption[];
  purchaseAcList: IOption[];
  salesAcList: IOption[];
  newlyCreatedGroup: INameUniqueName;
}
const initialState = {
  invObj: null,
  acDtl: null,
  hierarchicalStockGroups: null,
  purchaseAcList: null,
  salesAcList: null,
  newlyCreatedGroup: null
};

export function salesReducer(state = initialState, action: Action): SalesState {
  switch (action.type) {
    case SALES_ACTIONS.GET_ACCOUNT_DETAILS_RESPONSE : {
      let res: BaseResponse<AccountResponseV2, string> = action.payload;
      if (res.status === 'success') {
        return Object.assign({}, state, {
          acDtl: action.payload.body
        });
      }
      return state;
    }
    case SALES_ACTIONS.GET_HIERARCHICAL_STOCK_GROUPS_RESPONSE : {
      return Object.assign({}, state, {
        hierarchicalStockGroups: action.payload
      });
    }
    case SALES_ACTIONS.GET_PURCHASE_AC_LIST_RESPONSE : {
      let data: BaseResponse<FlattenAccountsResponse, { groupUniqueNames: string[] }> = action.payload;
      let purchaseAcList: IOption[] = [];
      if (data.status === 'success') {
        data.body.results.map(d => {
          purchaseAcList.push({ label: d.name, value: d.uniqueName });
        });
      }
      return Object.assign({}, state, { purchaseAcList });
    }
    case SALES_ACTIONS.GET_SALES_AC_LIST_RESPONSE : {
      let data: BaseResponse<FlattenAccountsResponse, { groupUniqueNames: string[] }> = action.payload;
      let salesAcList: IOption[] = [];
      if (data.status === 'success') {
        data.body.results.map(d => {
          salesAcList.push({ label: d.name, value: d.uniqueName });
        });
      }
      return Object.assign({}, state, { salesAcList });
    }
    case SALES_ACTIONS.STOCK_GROUP_SUCCESS: {
      let data = action.payload;
      return Object.assign({}, state, { newlyCreatedGroup: data });
    }
    default: {
      return state;
    }
  }
}
