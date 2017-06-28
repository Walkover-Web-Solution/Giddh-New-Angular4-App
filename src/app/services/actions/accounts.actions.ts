import { ApplyTaxRequest } from '../../models/api-models/ApplyTax';
import { AccountsTaxHierarchyResponse } from '../../models/api-models/Account';
import { AccountService } from './../account.service';
import { AppState } from './../../store/roots';
import { ToasterService } from './../toaster.service';
import { AccountResponse, AccountRequest } from './../../models/api-models/Account';
import { BaseResponse } from './../../models/api-models/BaseResponse';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import { GroupWithAccountsAction } from './groupwithaccounts.actions';
import { ShareAccountRequest, AccountSharedWithResponse, AccountMoveRequest } from '../../models/api-models/Account';
import { GroupResponse } from '../../models/api-models/Group';

@Injectable()
export class AccountsAction {
  public static CREATE_ACCOUNT = 'CreateAccount';
  public static CREATE_ACCOUNT_RESPONSE = 'CreateAccountResponse';
  public static SHARE_ACCOUNT = 'AccountShare';
  public static SHARE_ACCOUNT_RESPONSE = 'AccountShareResponse';
  public static UNSHARE_ACCOUNT = 'AccountUnShare';
  public static UNSHARE_ACCOUNT_RESPONSE = 'AccountUnShareResponse';
  public static SHARED_ACCOUNT_WITH = 'AccountSharedWith';
  public static SHARED_ACCOUNT_WITH_RESPONSE = 'AccountSharedWithResponse';
  public static MOVE_ACCOUNT = 'AccountMove';
  public static MOVE_ACCOUNT_RESPONSE = 'AccountMoveResponse';
  public static UPDATE_ACCOUNT = 'UpdateAccount';
  public static UPDATE_ACCOUNT_RESPONSE = 'UpdateAccountResponse';
  public static GET_ACCOUNT_DETAILS = 'AccountDetails';
  public static GET_ACCOUNT_DETAILS_RESPONSE = 'AccountDetailsResponse';
  public static GET_ACCOUNT_UNIQUENAME = 'AccountUniqueName';
  public static GET_ACCOUNT_UNIQUENAME_RESPONSE = 'AccountUniqueNameResponse';
  public static RESET_ACTIVE_ACCOUNT = 'AccountReset';
  public static GET_ACCOUNT_TAX_HIERARCHY = 'AccountTaxHierarchy';
  public static GET_ACCOUNT_TAX_HIERARCHY_RESPONSE = 'AccountTaxHierarchyResponse';
  public static APPLY_GROUP_TAX = 'ApplyAccountTax';
  public static APPLY_GROUP_TAX_RESPONSE = 'ApplyAccountTaxResponse';
  public static DELETE_ACCOUNT = 'AccountDelete';
  public static DELETE_ACCOUNT_RESPONSE = 'AccountDeleteResponse';

  @Effect()
  public ApplyAccountTax$: Observable<Action> = this.action$
    .ofType(AccountsAction.APPLY_GROUP_TAX)
    .switchMap(action => this._accountService.ApplyTax(action.payload))
    .map(response => {
      return this.applyAccountTaxResponse(response);
    });

  @Effect()
  public ApplyAccountTaxResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.APPLY_GROUP_TAX_RESPONSE)
    .map(action => {
      let data: BaseResponse<string, ApplyTaxRequest> = action.payload;
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return { type: '' };
      }
      this._toasty.successToast(action.payload.body, action.payload.status);
      let accName = null;
      this.store.take(1).subscribe((s) => {
        if (s.groupwithaccounts.activeGroup) {
          accName = s.groupwithaccounts.activeAccount.uniqueName;
        }
      });
      return this.getAccountDetails(accName);
    });

  @Effect()
  public CreateAccount$: Observable<Action> = this.action$
    .ofType(AccountsAction.CREATE_ACCOUNT)
    .switchMap(action => this._accountService.CreateAccount(action.payload.account, action.payload.accountUniqueName))
    .map(response => {
      return this.createAccountResponse(response);
    });

  @Effect()
  public CreateAccountResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.CREATE_ACCOUNT_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return {
          type: ''
        };
      } else {
        this._toasty.successToast('Account Created Successfully');
      }
      this.store.dispatch(this.groupWithAccountsAction.hideAddAccountForm());
      this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
      return { type: '' };
    });
  @Effect()
  public GetAccountDetails$: Observable<Action> = this.action$
    .ofType(AccountsAction.GET_ACCOUNT_DETAILS)
    .switchMap(action => this._accountService.GetAccountDetails(action.payload))
    .map(response => {
      return this.getAccountDetailsResponse(response);
    });
  @Effect()
  public GetAccountDetailsResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.GET_ACCOUNT_DETAILS_RESPONSE)
    .map(action => {
      let data: BaseResponse<AccountResponse, string> = action.payload;
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return {
          type: ''
        };
      }
      return this.sharedAccountWith(data.body.uniqueName);
    });
  @Effect()
  public GetAccountUniqueName$: Observable<Action> = this.action$
    .ofType(AccountsAction.GET_ACCOUNT_UNIQUENAME)
    .switchMap(action => this._accountService.GetAccountDetails(action.payload))
    .map(response => {
      return this.getAccountUniqueNameResponse(response);
    });
  @Effect()
  public GetAccountUniqueNameResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.GET_ACCOUNT_UNIQUENAME_RESPONSE)
    .map(action => {
      let data: BaseResponse<AccountResponse, string> = action.payload;
      if (action.payload.status === 'error') {
        // this._toasty.errorToast(action.payload.message, action.payload.code);
        return {
          type: ''
        };
      }
      return this.sharedAccountWith(data.body.uniqueName);
    });

  @Effect()
  public UpdateAccount$: Observable<Action> = this.action$
    .ofType(AccountsAction.UPDATE_ACCOUNT)
    .switchMap(action => this._accountService.UpdateAccount(action.payload.account, action.payload.accountUniqueName))
    .map(response => {
      return this.updateAccountResponse(response);
    });

  @Effect()
  public UpdateAccountResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.UPDATE_ACCOUNT_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast('Account Updated Successfully');
        this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
      }
      return { type: '' };
    });

  @Effect()
  public getGroupTaxHierarchy$: Observable<Action> = this.action$
    .ofType(AccountsAction.GET_ACCOUNT_TAX_HIERARCHY)
    .switchMap(action => this._accountService.GetTaxHierarchy(action.payload))
    .map(response => {
      return this.getTaxHierarchyResponse(response);
    });

  @Effect()
  public getGroupTaxHierarchyResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.GET_ACCOUNT_TAX_HIERARCHY_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return {
        type: ''
      };
    });

  @Effect()
  public shareAccount$: Observable<Action> = this.action$
    .ofType(AccountsAction.SHARE_ACCOUNT)
    .switchMap(action =>
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
    .ofType(AccountsAction.SHARE_ACCOUNT_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast(action.payload.body, '');
      }
      return {
        type: ''
      };
    });

  @Effect()
  public unShareAccount$: Observable<Action> = this.action$
    .ofType(AccountsAction.UNSHARE_ACCOUNT)
    .switchMap(action =>
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
    .ofType(AccountsAction.UNSHARE_ACCOUNT_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return {
          type: ''
        };
      } else {
        this._toasty.successToast(action.payload.body, '');
      }
      let accountUniqueName = null;
      this.store.take(1).subscribe(s => {
        accountUniqueName = s.groupwithaccounts.activeAccount.uniqueName;
      });
      return this.sharedAccountWith(accountUniqueName);
    });

  @Effect()
  public sharedAccount$: Observable<Action> = this.action$
    .ofType(AccountsAction.SHARED_ACCOUNT_WITH)
    .switchMap(action => this._accountService.AccountShareWith(action.payload))
    .map(response => {
      return this.sharedAccountWithResponse(response);
    });
  @Effect()
  public sharedAccountResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.SHARED_ACCOUNT_WITH_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return {
        type: ''
      };
    });

  @Effect()
  public moveAccount$: Observable<Action> = this.action$
    .ofType(AccountsAction.MOVE_ACCOUNT)
    .switchMap(action =>
      this._accountService.AccountMove(
        action.payload.body,
        action.payload.accountUniqueName
      )
    )
    .map(response => {
      return this.moveAccountResponse(response);
    });
  @Effect()
  public moveAccountResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.MOVE_ACCOUNT_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast('Group moved successfully', '');
        this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
      }
      return {
        type: ''
      };
    });

  @Effect()
  public DeleteAccount$: Observable<Action> = this.action$
    .ofType(AccountsAction.DELETE_ACCOUNT)
    .switchMap(action => this._accountService.DeleteAccount(action.payload))
    .map(response => {
      return this.deleteAccountResponse(response);
    });

  @Effect()
  public DeleteAccountResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.DELETE_ACCOUNT_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast(action.payload.body, '');
        let activeGroup: GroupResponse = null;
        this.store.take(1).subscribe(s => activeGroup = s.groupwithaccounts.activeGroup);
        this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
        this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
      }
      return {
        type: ''
      };
    });
  constructor(
    private action$: Actions,
    private _accountService: AccountService,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private groupWithAccountsAction: GroupWithAccountsAction
  ) {
  }

  public createAccount(value: string, account: AccountRequest): Action {
    return {
      type: AccountsAction.CREATE_ACCOUNT,
      payload: Object.assign({}, {
        accountUniqueName: value
      }, {
          account
        })
    };
  }
  public createAccountResponse(value: BaseResponse<AccountResponse, AccountRequest>): Action {
    return {
      type: AccountsAction.CREATE_ACCOUNT_RESPONSE,
      payload: value
    };
  }
  public updateAccount(value: string, account: AccountRequest): Action {
    return {
      type: AccountsAction.UPDATE_ACCOUNT,
      payload: Object.assign({}, {
        accountUniqueName: value
      }, {
          account
        })
    };
  }
  public updateAccountResponse(value: BaseResponse<AccountResponse, AccountRequest>): Action {
    return {
      type: AccountsAction.UPDATE_ACCOUNT_RESPONSE,
      payload: value
    };
  }
  public getAccountDetails(value: string): Action {
    return {
      type: AccountsAction.GET_ACCOUNT_DETAILS,
      payload: value
    };
  }
  public getAccountDetailsResponse(value: BaseResponse<AccountResponse, string>): Action {
    return {
      type: AccountsAction.GET_ACCOUNT_DETAILS_RESPONSE,
      payload: value
    };
  }
  public getAccountUniqueName(value: string): Action {
    return {
      type: AccountsAction.GET_ACCOUNT_UNIQUENAME,
      payload: value
    };
  }
  public getAccountUniqueNameResponse(value: BaseResponse<AccountResponse, string>): Action {
    return {
      type: AccountsAction.GET_ACCOUNT_UNIQUENAME_RESPONSE,
      payload: value
    };
  }
  public shareAccount(value: ShareAccountRequest, accountUniqueName: string): Action {
    return {
      type: AccountsAction.SHARE_ACCOUNT,
      payload: Object.assign({}, {
        body: value
      }, {
          accountUniqueName
        })
    };
  }
  public shareAccountResponse(value: BaseResponse<string, ShareAccountRequest>): Action {
    return {
      type: AccountsAction.SHARE_ACCOUNT_RESPONSE,
      payload: value
    };
  }
  public unShareAccount(value: string, accountUniqueName: string): Action {
    return {
      type: AccountsAction.UNSHARE_ACCOUNT,
      payload: Object.assign({}, {
        user: value
      }, {
          accountUniqueName
        })
    };
  }
  public unShareAccountResponse(value: BaseResponse<string, string>): Action {
    return {
      type: AccountsAction.UNSHARE_ACCOUNT_RESPONSE,
      payload: value
    };
  }
  public moveAccount(value: AccountMoveRequest, accountUniqueName: string): Action {
    return {
      type: AccountsAction.MOVE_ACCOUNT,
      payload: Object.assign({}, {
        body: value
      }, {
          accountUniqueName
        })
    };
  }
  public moveAccountResponse(value: BaseResponse<string, AccountMoveRequest>): Action {
    return {
      type: AccountsAction.MOVE_ACCOUNT_RESPONSE,
      payload: value
    };
  }
  public sharedAccountWith(accountUniqueName: string): Action {
    return {
      type: AccountsAction.SHARED_ACCOUNT_WITH,
      payload: accountUniqueName
    };
  }
  public sharedAccountWithResponse(value: BaseResponse<AccountSharedWithResponse[], string>): Action {
    return {
      type: AccountsAction.SHARED_ACCOUNT_WITH_RESPONSE,
      payload: value
    };
  }
  public resetActiveAccount(): Action {
    return {
      type: AccountsAction.RESET_ACTIVE_ACCOUNT
    };
  }
  public getTaxHierarchy(value: string): Action {
    return {
      type: AccountsAction.GET_ACCOUNT_TAX_HIERARCHY,
      payload: value
    };
  }
  public getTaxHierarchyResponse(value: BaseResponse<AccountsTaxHierarchyResponse, string>): Action {
    return {
      type: AccountsAction.GET_ACCOUNT_TAX_HIERARCHY_RESPONSE,
      payload: value
    };
  }
  public applyAccountTax(value: ApplyTaxRequest): Action {
    return {
      type: AccountsAction.APPLY_GROUP_TAX,
      payload: value
    };
  }
  public applyAccountTaxResponse(value: BaseResponse<string, ApplyTaxRequest>): Action {
    return {
      type: AccountsAction.APPLY_GROUP_TAX_RESPONSE,
      payload: value
    };
  }
  public deleteAccount(accountUniqueName: string): Action {
    return {
      type: AccountsAction.DELETE_ACCOUNT,
      payload: accountUniqueName
    };
  }
  public deleteAccountResponse(value: BaseResponse<string, string>): Action {
    return {
      type: AccountsAction.DELETE_ACCOUNT_RESPONSE,
      payload: value
    };
  }
}
