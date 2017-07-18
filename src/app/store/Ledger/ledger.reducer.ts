import { BaseResponse } from '../../models/api-models/BaseResponse';
import { TransactionsResponse, TransactionsRequest } from '../../models/api-models/Ledger';
import { AccountResponse } from '../../models/api-models/Account';
import { Action } from '@ngrx/store';
import { AccountFlat, SearchDataSet, SearchRequest, SearchResponse } from '../../models/api-models/Search';
import { SearchActions } from '../../services/actions/search.actions';
import * as _ from 'lodash';
import { LEDGER } from '../../services/actions/ledger/ledger.const';

export interface LedgerState {
  account?: AccountResponse;
  transcationRequest?: TransactionsRequest;
  transactionsResponse?: TransactionsResponse;
  transactionInprogress: boolean;
  accountInprogress: boolean;
}

export const initialState: LedgerState = {
  transactionInprogress: false,
  accountInprogress: false
};

export function ledgerReducer(state = initialState, action: Action): LedgerState {
  let data: BaseResponse<AccountResponse, string>;
  let transaction: BaseResponse<TransactionsResponse, TransactionsRequest>;
  switch (action.type) {
    case LEDGER.GET_LEDGER_ACCOUNT:
      return Object.assign({}, state, {
        accountInprogress: true
      });
    case LEDGER.GET_LEDGER_ACCOUNT_RESPONSE:
      data = action.payload as BaseResponse<AccountResponse, string>;
      if (data.status === 'success') {
        return Object.assign({}, state, {
          accountInprogress: false,
          account: data.body
        });
      }
      return Object.assign({}, state, {
        accountInprogress: false
      });
    case LEDGER.GET_TRANSACTION:
      return Object.assign({}, state, {
        transactionInprogress: true
      });
    case LEDGER.GET_TRANSACTION_RESPONSE:
      transaction = action.payload as BaseResponse<TransactionsResponse, TransactionsRequest>;
      if (transaction.status === 'success') {
        return Object.assign({}, state, {
          transactionInprogress: false,
          transcationRequest: transaction.request,
          transactionsResponse: transaction.body
        });
      }
      return Object.assign({}, state, {
        transactionInprogress: false
      });
    default: {
      return state;
    }
  }
}
