import { Action } from '@ngrx/store';
import * as _ from 'lodash';
import { SALES_ACTIONS } from '../../services/actions/sales/sales.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AccountResponseV2 } from '../../models/api-models/Account';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';

export interface SalesState {
  invObj: any;
  acDtl: AccountResponseV2;
  groupList: GroupsWithAccountsResponse[];
}
const initialState = {
  invObj: null,
  acDtl: null,
  groupList: null
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
    default: {
      return state;
    }
  }
}
