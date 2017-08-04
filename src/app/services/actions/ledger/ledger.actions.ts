import { AccountResponse } from '../../../models/api-models/Account';
import { AccountService } from '../../account.service';
import {
  DownloadLedgerRequest, LedgerResponse, TransactionsRequest,
  TransactionsResponse
} from '../../../models/api-models/Ledger';
/**
 * Created by ad on 04-07-2017.
 */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { AppState } from '../../../store/roots';
import { LEDGER } from './ledger.const';
import { LedgerService } from '../../ledger.service';
import { GroupService } from '../../group.service';
import { FlattenGroupsAccountsResponse } from '../../../models/api-models/Group';
import { BlankLedgerVM } from '../../../ledger/ledger.vm';

@Injectable()
export class LedgerActions {
  @Effect()
  public GetTransactions$: Observable<Action> = this.action$
    .ofType(LEDGER.GET_TRANSACTION)
    .switchMap(action => {
      let req: TransactionsRequest = action.payload as TransactionsRequest;
      return this._ledgerService.GetLedgerTranscations(req.q, req.page, req.count, req.accountUniqueName, req.from, req.to, req.sort, req.reversePage);
    }).map(res => this.validateResponse<TransactionsResponse, TransactionsRequest>(res, {
      type: LEDGER.GET_TRANSACTION_RESPONSE,
      payload: res
    }, true, {
      type: LEDGER.GET_TRANSACTION_RESPONSE,
      payload: res
    }));

  @Effect()
  public GetAccountDetails$: Observable<Action> = this.action$
    .ofType(LEDGER.GET_LEDGER_ACCOUNT)
    .switchMap(action => this._accountService.GetAccountDetails(action.payload))
    .map(res => this.validateResponse<AccountResponse, string>(res, {
      type: LEDGER.GET_LEDGER_ACCOUNT_RESPONSE,
      payload: res
    }, true, {
      type: LEDGER.GET_LEDGER_ACCOUNT_RESPONSE,
      payload: res
    }));

  @Effect()
  public DownloadInvoiceFile$: Observable<Action> = this.action$
    .ofType(LEDGER.DOWNLOAD_LEDGER_INVOICE)
    .switchMap(action => this._ledgerService.DownloadInvoice(action.payload.body, action.payload.accountUniqueName))
    .map(res => this.validateResponse<string, DownloadLedgerRequest>(res, {
      type: LEDGER.DOWNLOAD_LEDGER_INVOICE_RESPONSE,
      payload: res
    }, true, {
      type: LEDGER.DOWNLOAD_LEDGER_INVOICE_RESPONSE,
      payload: res
    }));

  @Effect()
  public GetDiscountAccounts$: Observable<Action> = this.action$
    .ofType(LEDGER.GET_DISCOUNT_ACCOUNTS_LIST)
    .switchMap(action => this._groupService.GetFlattenGroupsAccounts('discount'))
    .map(res => this.validateResponse<FlattenGroupsAccountsResponse, string>(res, {
      type: LEDGER.GET_DISCOUNT_ACCOUNTS_LIST_RESPONSE,
      payload: res
    }, true, {
      type: LEDGER.GET_DISCOUNT_ACCOUNTS_LIST_RESPONSE,
      payload: res
    }));

  @Effect()
  public CreateBlankLedger$: Observable<Action> = this.action$
    .ofType(LEDGER.CREATE_BLANK_LEDGER_REQUEST)
    .switchMap(action => this._ledgerService.CreateLedger(action.payload.model, action.payload.accountUniqueName))
    .map(res => this.validateResponse<LedgerResponse[], BlankLedgerVM>(res, {
      type: LEDGER.CREATE_BLANK_LEDGER_RESPONSE,
      payload: res
    }, true, {
      type: LEDGER.CREATE_BLANK_LEDGER_RESPONSE,
      payload: res
    }));

  constructor(private action$: Actions,
              private _toasty: ToasterService,
              private store: Store<AppState>,
              private _ledgerService: LedgerService,
              private _accountService: AccountService,
              private _groupService: GroupService) {
  }

  public GetTransactions(request: TransactionsRequest): Action {
    return {
      type: LEDGER.GET_TRANSACTION,
      payload: request
    };
  }

  public GetLedgerAccount(value: string): Action {
    return {
      type: LEDGER.GET_LEDGER_ACCOUNT,
      payload: value
    };
  }

  public DownloadInvoice(value: DownloadLedgerRequest, accountUniqueName: string): Action {
    return {
      type: LEDGER.DOWNLOAD_LEDGER_INVOICE,
      payload: {body: value, accountUniqueName}
    };
  }

  public GetDiscountAccounts(): Action {
    return {
      type: LEDGER.GET_DISCOUNT_ACCOUNTS_LIST
    };
  }

  public CreateBlankLedger(model: BlankLedgerVM, accountUniqueName: string): Action {
    return {
      type: LEDGER.CREATE_BLANK_LEDGER_REQUEST,
      payload: {model, accountUniqueName}
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = {type: ''}): Action {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    } else {
      if (showToast && typeof response.body === 'string') {
        this._toasty.successToast(response.body);
      }
    }
    return successAction;
  }
}
