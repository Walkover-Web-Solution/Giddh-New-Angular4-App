import { ILedgerAdvanceSearchRequest, ILedgerAdvanceSearchResponse } from './../../../models/api-models/Ledger';
import { AccountRequestV2, AccountResponse, AccountResponseV2, AccountSharedWithResponse, ShareAccountRequest } from '../../../models/api-models/Account';
import { AccountService } from '../../account.service';
import {
  DownloadLedgerRequest,
  LedgerResponse,
  TransactionsRequest,
  TransactionsResponse,
  LedgerUpdateRequest
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
import { CustomActions } from '../../../store/customActions';

@Injectable()
export class LedgerActions {
  @Effect()
  public GetTransactions$: Observable<Action> = this.action$
    .ofType(LEDGER.GET_TRANSACTION)
    .switchMap((action: CustomActions) => {
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
    .switchMap((action: CustomActions) =>  this._accountService.GetAccountDetails(action.payload))
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
    .switchMap((action: CustomActions) =>  this._ledgerService.DownloadInvoice(action.payload.body, action.payload.accountUniqueName))
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
    .switchMap((action: CustomActions) =>  this._groupService.GetFlattenGroupsAccounts('discount'))
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
    .switchMap((action: CustomActions) =>  this._ledgerService.CreateLedger(action.payload.model, action.payload.accountUniqueName))
    .map(res => this.validateResponse<LedgerResponse[], BlankLedgerVM>(res, {
      type: LEDGER.CREATE_BLANK_LEDGER_RESPONSE,
      payload: res
    }, true, {
        type: LEDGER.CREATE_BLANK_LEDGER_RESPONSE,
        payload: res
      }));

  @Effect()
  public DeleteTrxEntry$: Observable<Action> = this.action$
    .ofType(LEDGER.DELETE_TRX_ENTRY)
    .switchMap((action: CustomActions) =>  this._ledgerService.DeleteLedgerTransaction(action.payload.accountUniqueName, action.payload.entryUniqueName))
    .map(res => this.deleteTrxEntryResponse(res));

  @Effect()
  public DeleteTrxEntryResponse$: Observable<Action> = this.action$
    .ofType(LEDGER.DELETE_TRX_ENTRY_RESPONSE)
    .map((action: CustomActions) => {
      let res = action.payload as BaseResponse<string, string>;
      if (res.status === 'success') {
        this._toasty.successToast('Entry deleted successfully', 'Success');
      } else {
        this._toasty.errorToast(res.body);
      }
      return {
        type: 'EmptyAction'
      };
    });
  @Effect()
  public shareAccount$: Observable<Action> = this.action$
    .ofType(LEDGER.LEDGER_SHARE_ACCOUNT)
    .switchMap((action: CustomActions) =>
      this._accountService.AccountShare(
        action.payload.body,
        action.payload.accountUniqueName
      )
    )
    .map(response => {
      return this.shareAccountResponse(response);
    });
  @Effect()
  public shareAccountResponse$: Observable<Action> = this.action$
    .ofType(LEDGER.LEDGER_SHARE_ACCOUNT_RESPONSE)
    .map((action: CustomActions) => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return {
          type: 'EmptyAction'
        };
      } else {
        let data: BaseResponse<string, ShareAccountRequest> = action.payload;
        this._toasty.successToast(action.payload.body, '');
        return this.sharedAccountWith(data.queryString.accountUniqueName);
      }
    });

  @Effect()
  public unShareAccount$: Observable<Action> = this.action$
    .ofType(LEDGER.LEDGER_UNSHARE_ACCOUNT)
    .switchMap((action: CustomActions) =>
      this._accountService.AccountUnshare(
        action.payload.user,
        action.payload.accountUniqueName
      )
    )
    .map(response => {
      return this.unShareAccountResponse(response);
    });

  @Effect()
  public unShareAccountResponse$: Observable<Action> = this.action$
    .ofType(LEDGER.LEDGER_UNSHARE_ACCOUNT_RESPONSE)
    .map((action: CustomActions) => {
      let data: BaseResponse<string, string> = action.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast(action.payload.body, '');
      }
      return {
        type: 'EmptyAction'
      };
      // return this.sharedAccountWith(data.queryString.accountUniqueName);
    });

  @Effect()
  public sharedAccount$: Observable<Action> = this.action$
    .ofType(LEDGER.LEDGER_SHARED_ACCOUNT_WITH)
    .switchMap((action: CustomActions) =>  this._accountService.AccountShareWith(action.payload))
    .map(response => {
      return this.sharedAccountWithResponse(response);
    });
  @Effect()
  public sharedAccountResponse$: Observable<Action> = this.action$
    .ofType(LEDGER.LEDGER_SHARED_ACCOUNT_WITH_RESPONSE)
    .map((action: CustomActions) => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return {
        type: 'EmptyAction'
      };
    });

  @Effect()
  public updateTxnEntry$: Observable<Action> = this.action$
    .ofType(LEDGER.UPDATE_TXN_ENTRY)
    .switchMap((action: CustomActions) =>  this._ledgerService.UpdateLedgerTransactions(action.payload.model,
      action.payload.accountUniqueName, action.payload.entryUniqueName))
    .map(resp => {
      return this.updateTxnEntryResponse(resp);
    });

  @Effect()
  public updateTxnEntryResponse$: Observable<Action> = this.action$
    .ofType(LEDGER.UPDATE_TXN_ENTRY_RESPONSE)
    .map((action: CustomActions) => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return { type: 'EmptyAction' };
      }
      this._toasty.successToast('entry updated successfully');
      return { type: 'EmptyAction' };
    });

    @Effect()
    public CreateQuickAccountV2$: Observable<Action> = this.action$
      .ofType(LEDGER.CREATE_QUICK_ACCOUNT)
      .switchMap((action: CustomActions) =>  this._accountService.CreateAccountV2(action.payload.account, action.payload.accountUniqueName))
      .map(response => {
        return this.createQuickAccountResponseV2(response);
      });

    @Effect()
    public CreateQuickAccountResponseV2$: Observable<Action> = this.action$
      .ofType(LEDGER.CREATE_QUICK_ACCOUNT_RESPONSE)
      .map((action: CustomActions) => {
        if (action.payload.status === 'error') {
          this._toasty.clearAllToaster();
          this._toasty.errorToast(action.payload.message, action.payload.code);
          return {
            type: 'EmptyAction'
          };
        } else {
          this._toasty.successToast('Account Created Successfully');
        }
        return {type: 'EmptyAction'};
      });

    @Effect()
    public AdvanceSearch$: Observable<Action> = this.action$
      .ofType(LEDGER.ADVANCE_SEARCH)
      .switchMap((action: CustomActions) =>  this._ledgerService.AdvanceSearch(action.payload.model, action.payload.accountUniqueName, action.payload.from, action.payload.to, '', '', ''))
      .map(response => {
        return this.advanceSearchResponse(response);
      });

    @Effect()
    public AdvanceSearchResponse$: Observable<Action> = this.action$
      .ofType(LEDGER.ADVANCE_SEARCH_RESPONSE)
      .map((action: CustomActions) => {
        if (action.payload.status === 'error') {
          this._toasty.clearAllToaster();
          this._toasty.errorToast(action.payload.message, action.payload.code);
          return {
            type: 'EmptyAction'
          };
        } else {
          this._toasty.successToast('Data filtered successfully');
        }
        return {type: 'EmptyAction'};
      });

  constructor(private action$: Actions,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private _ledgerService: LedgerService,
    private _accountService: AccountService,
    private _groupService: GroupService) {
  }

  public GetTransactions(request: TransactionsRequest): CustomActions {
    return {
      type: LEDGER.GET_TRANSACTION,
      payload: request
    };
  }

  public GetLedgerAccount(value: string): CustomActions {
    return {
      type: LEDGER.GET_LEDGER_ACCOUNT,
      payload: value
    };
  }

  public DownloadInvoice(value: DownloadLedgerRequest, accountUniqueName: string): CustomActions {
    return {
      type: LEDGER.DOWNLOAD_LEDGER_INVOICE,
      payload: { body: value, accountUniqueName }
    };
  }

  public GetDiscountAccounts(): CustomActions {
    return {
      type: LEDGER.GET_DISCOUNT_ACCOUNTS_LIST
    };
  }

  public CreateBlankLedger(model: BlankLedgerVM, accountUniqueName: string): CustomActions {
    return {
      type: LEDGER.CREATE_BLANK_LEDGER_REQUEST,
      payload: { model, accountUniqueName }
    };
  }

  public setTxnForEdit(txnUniqueName: string) {
    return {
      type: LEDGER.SET_SELECTED_TXN_FOR_EDIT,
      payload: txnUniqueName
    };
  }
  public ResetLedger(): CustomActions {
    return {
      type: LEDGER.RESET_LEDGER
    };
  }
  public ResetUpdateLedger(): CustomActions {
    return {
      type: LEDGER.RESET_UPDATE_TXN_ENTRY
    };
  }

  public deleteTrxEntry(accountUniqueName: string, entryUniqueName: string): CustomActions {
    return {
      type: LEDGER.DELETE_TRX_ENTRY,
      payload: { accountUniqueName, entryUniqueName }
    };
  }

  public shareAccount(value: ShareAccountRequest, accountUniqueName: string): CustomActions {
    return {
      type: LEDGER.LEDGER_SHARE_ACCOUNT,
      payload: Object.assign({}, {
        body: value
      }, {
          accountUniqueName
        })
    };
  }

  public shareAccountResponse(value: BaseResponse<string, ShareAccountRequest>): CustomActions {
    return {
      type: LEDGER.LEDGER_SHARE_ACCOUNT_RESPONSE,
      payload: value
    };
  }

  public unShareAccount(value: string, accountUniqueName: string): CustomActions {
    return {
      type: LEDGER.LEDGER_UNSHARE_ACCOUNT,
      payload: Object.assign({}, {
        user: value
      }, {
          accountUniqueName
        })
    };
  }

  public unShareAccountResponse(value: BaseResponse<string, string>): CustomActions {
    return {
      type: LEDGER.LEDGER_UNSHARE_ACCOUNT_RESPONSE,
      payload: value
    };
  }

  public sharedAccountWith(accountUniqueName: string): CustomActions {
    return {
      type: LEDGER.LEDGER_SHARED_ACCOUNT_WITH,
      payload: accountUniqueName
    };
  }

  public sharedAccountWithResponse(value: BaseResponse<AccountSharedWithResponse[], string>): CustomActions {
    return {
      type: LEDGER.LEDGER_SHARED_ACCOUNT_WITH_RESPONSE,
      payload: value
    };
  }

  public deleteTrxEntryResponse(res: BaseResponse<string, string>): CustomActions {
    return {
      type: LEDGER.DELETE_TRX_ENTRY_RESPONSE,
      payload: res
    };
  }

  public updateTxnEntry(model: LedgerUpdateRequest, accountUniqueName: string, entryUniqueName: string): CustomActions {
    return {
      type: LEDGER.UPDATE_TXN_ENTRY,
      payload: { model, accountUniqueName, entryUniqueName }
    };
  }

  public updateTxnEntryResponse(payload: BaseResponse<LedgerResponse, LedgerUpdateRequest>): CustomActions {
    return {
      type: LEDGER.UPDATE_TXN_ENTRY_RESPONSE,
      payload
    };
  }

  public resetQuickAccountModal(): CustomActions {
    return {
      type: LEDGER.RESET_QUICK_ACCOUNT_MODAL
    };
  }

  public createQuickAccountV2(value: string, account: AccountRequestV2): CustomActions {
    return {
      type: LEDGER.CREATE_QUICK_ACCOUNT,
      payload: Object.assign({}, {
        accountUniqueName: value
      }, {
        account
      })
    };
  }

  public createQuickAccountResponseV2(value: BaseResponse<AccountResponseV2, AccountRequestV2>): CustomActions {
    return {
      type: LEDGER.CREATE_QUICK_ACCOUNT_RESPONSE,
      payload: value
    };
  }

  public resetDeleteTrxEntryModal() {
    return {
      type: LEDGER.RESET_DELETE_TRX_ENTRY_MODAL
    };
  }

  public doAdvanceSearch(model: ILedgerAdvanceSearchRequest, accountUniqueName: string, from: string, to: string): CustomActions {
    return {
      type: LEDGER.ADVANCE_SEARCH,
      payload: { model, accountUniqueName, from, to }
    };
  }

  public advanceSearchResponse(value: BaseResponse<ILedgerAdvanceSearchResponse, ILedgerAdvanceSearchRequest>): CustomActions {
    return {
      type: LEDGER.ADVANCE_SEARCH_RESPONSE,
      payload: value
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = {type: 'EmptyAction'}): CustomActions {
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
