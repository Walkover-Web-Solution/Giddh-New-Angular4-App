import { GroupSharedWithResponse } from './../../models/api-models/Group';
import { ShareEntityRequest } from './../../models/api-models/Account';
import { ApplyTaxRequest } from '../../models/api-models/ApplyTax';
import {
  AccountMergeRequest,
  AccountMoveRequest,
  AccountRequest,
  AccountRequestV2,
  AccountResponse,
  AccountResponseV2,
  AccountSharedWithResponse,
  AccountsTaxHierarchyResponse,
  AccountUnMergeRequest,
  ShareAccountRequest
} from '../../models/api-models/Account';
import { AccountService } from './../account.service';
import { AppState } from './../../store/roots';
import { ToasterService } from './../toaster.service';
import { BaseResponse } from './../../models/api-models/BaseResponse';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import { GroupWithAccountsAction } from './groupwithaccounts.actions';
import { GroupResponse } from '../../models/api-models/Group';

@Injectable()
export class AccountsAction {
  public static CREATE_ACCOUNT = 'CreateAccount';
  public static CREATE_ACCOUNT_RESPONSE = 'CreateAccountResponse';
  public static CREATE_ACCOUNTV2 = 'CreateAccountV2';
  public static CREATE_ACCOUNT_RESPONSEV2 = 'CreateAccountResponseV2';
  public static SHARE_ENTITY = 'EntityShare';
  public static SHARE_ENTITY_RESPONSE = 'EntityShareResponse';
  public static UPDATE_SHARED_ENTITY = 'UpdateSharedEntity';
  public static UPDATE_SHARED_ENTITY_RESPONSE = 'UpdateSharedEntityResponse';
  public static UN_SHARE_ENTITY = 'EntityUnShare';
  public static UN_SHARE_ENTITY_RESPONSE = 'EntityUnShareResponse';
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
  public static UPDATE_ACCOUNTV2 = 'UpdateAccountV2';
  public static UPDATE_ACCOUNT_RESPONSEV2 = 'UpdateAccountResponseV2';
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
  public static MERGE_ACCOUNT = 'AccountMerge';
  public static MERGE_ACCOUNT_RESPONSE = 'AccountMergeResponse';

  public static UNMERGE_ACCOUNT = 'AccountUnMerge';
  public static UNMERGE_ACCOUNT_RESPONSE = 'AccountUnMergeResponse';

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
        this._toasty.clearAllToaster();
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return {
          type: ''
        };
      } else {
        this._toasty.successToast('Account Created Successfully');
      }
      this.store.dispatch(this.groupWithAccountsAction.hideAddAccountForm());
      let groupSearchString: string;
      this.store.select(p => p.groupwithaccounts.groupAndAccountSearchString).take(1).subscribe(a => groupSearchString = a);
      if (groupSearchString) {
        this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(groupSearchString));
      } else {
        this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
      }
      return { type: '' };
    });

  @Effect()
  public CreateAccountV2$: Observable<Action> = this.action$
    .ofType(AccountsAction.CREATE_ACCOUNTV2)
    .switchMap(action => this._accountService.CreateAccountV2(action.payload.account, action.payload.accountUniqueName))
    .map(response => {
      if (response.status === 'success') {
        this.store.dispatch(this.groupWithAccountsAction.hideAddAccountForm());
      }
      return this.createAccountResponseV2(response);
    });

  @Effect()
  public CreateAccountResponseV2$: Observable<Action> = this.action$
    .ofType(AccountsAction.CREATE_ACCOUNT_RESPONSEV2)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return {
          type: ''
        };
      } else {
        this._toasty.successToast('Account Created Successfully');
      }
      let groupSearchString: string;
      this.store.select(p => p.groupwithaccounts.groupAndAccountSearchString).take(1).subscribe(a => groupSearchString = a);
      if (groupSearchString) {
        this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(groupSearchString));
      } else {
        this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
      }
      setTimeout(() => this.store.dispatch(this.groupWithAccountsAction.showAddAccountForm()), 1000);
      return { type: '' };
    });

  @Effect()
  public GetAccountDetails$: Observable<Action> = this.action$
    .ofType(AccountsAction.GET_ACCOUNT_DETAILS)
    .switchMap(action => this._accountService.GetAccountDetailsV2(action.payload))
    .map(response => {
      return this.getAccountDetailsResponse(response);
    });
  @Effect()
  public GetAccountDetailsResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.GET_ACCOUNT_DETAILS_RESPONSE)
    .map(action => {
      let data: BaseResponse<AccountResponseV2, string> = action.payload;
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
      return {
        type: ''
      };
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
        this._toasty.clearAllToaster();
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast('Account Updated Successfully');
        let groupSearchString: string;
        this.store.take(1).subscribe(a => {
          groupSearchString = a.groupwithaccounts.groupAndAccountSearchString;
        });
        if (groupSearchString) {
          this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(groupSearchString));
        } else {
          this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
        }
      }
      return { type: '' };
    });

  @Effect()
  public UpdateAccountV2$: Observable<Action> = this.action$
    .ofType(AccountsAction.UPDATE_ACCOUNTV2)
    .switchMap(action => this._accountService.UpdateAccountV2(action.payload.account, action.payload.value))
    .map(response => {
      if (response.status === 'success') {
        this.store.dispatch(this.groupWithAccountsAction.hideEditAccountForm());
      }
      return this.updateAccountResponseV2(response);
    });

  @Effect()
  public UpdateAccountResponseV2$: Observable<Action> = this.action$
    .ofType(AccountsAction.UPDATE_ACCOUNT_RESPONSEV2)
    .map(action => {
      let resData: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
      if (action.payload.status === 'error') {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast('Account Updated Successfully');
        let groupSearchString: string;
        this.store.take(1).subscribe(a => {
          groupSearchString = a.groupwithaccounts.groupAndAccountSearchString;
        });
        if (groupSearchString) {
          this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(groupSearchString));
        } else {
          this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
        }
        this.store.dispatch(this.groupWithAccountsAction.showEditAccountForm());
        this.store.dispatch(this.getAccountDetails(resData.queryString.accountUniqueName));
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
  public shareEntity$: Observable<Action> = this.action$
    .ofType(AccountsAction.SHARE_ENTITY)
    .switchMap(action =>
      this._accountService.Share(
        action.payload.body,
        action.payload.accountUniqueName
      )
    )
    .map(response => {
      return this.shareEntityResponse(response);
    });
  @Effect()
  public shareEntityResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.SHARE_ENTITY_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return {
          type: ''
        };
      } else {
        let data: BaseResponse<string, ShareAccountRequest> = action.payload;
        this._toasty.successToast('Shared successfully', '');
        if (data.queryString.entity === 'account'){
          return this.sharedAccountWith(data.queryString.entityUniqueName);
        } else if (data.queryString.entity === 'group') {
          return this.groupWithAccountsAction.sharedGroupWith(data.queryString.entityUniqueName);
        } else {
          return {
            type: ''
          };
        }
      }
    });

  @Effect()
  public unShareEntity$: Observable<Action> = this.action$
    .ofType(AccountsAction.UN_SHARE_ENTITY)
    .switchMap(action =>
      this._accountService.UnShare(
        action.payload.body,
        action.payload.accountUniqueName
      )
    )
    .map(response => {
      return this.UnShareEntityResponse(response);
    });

  @Effect()
  public unShareEntityResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.UN_SHARE_ENTITY_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return {
          type: ''
        };
      } else {
        let data: BaseResponse<string, ShareAccountRequest> = action.payload;
        this._toasty.successToast(action.payload.body, '');
        if (data.queryString.entity === 'account'){
          return this.sharedAccountWith(data.queryString.entityUniqueName);
        } else if (data.queryString.entity === 'group') {
          return this.groupWithAccountsAction.sharedGroupWith(data.queryString.entityUniqueName);
        } else {
          return {
            type: ''
          };
        }
        // else if(data.queryString.entity === 'group'){
        //   return this.GroupSharedWithResponse(data.queryString.accountUniqueName);
        // }
      }
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
        let data: BaseResponse<string, AccountMoveRequest> = action.payload;
        this._toasty.successToast('Account moved successfully', '');
        // let activeGrp: GroupResponse = null;
        // this.store.select(s => s.groupwithaccounts.activeGroup).take(1).subscribe(p => activeGrp = p);
        // this.groupWithAccountsAction.getGroupDetails(activeGrp.uniqueName);
      }
      return {
        type: ''
      };
    });

  @Effect()
  public mergeAccount$: Observable<Action> = this.action$
    .ofType(AccountsAction.MERGE_ACCOUNT)
    .switchMap(action =>
      this._accountService.MergeAccount(
        action.payload.data,
        action.payload.accountUniqueName
      )
    )
    .map(response => {
      return this.mergeAccountResponse(response);
    });
  @Effect()
  public mergeAccountResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.MERGE_ACCOUNT_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast(action.payload.body, '');
        let data: BaseResponse<string, AccountMergeRequest[]> = action.payload;
        return this.getAccountDetails(data.queryString.accountUniqueName);
      }
      return {
        type: ''
      };
    });

  @Effect()
  public unMergeAccount$: Observable<Action> = this.action$
    .ofType(AccountsAction.UNMERGE_ACCOUNT)
    .switchMap(action =>
      this._accountService.UnmergeAccount(
        action.payload.data,
        action.payload.accountUniqueName
      )
    )
    .map(response => {
      return this.unmergeAccountResponse(response);
    });
  @Effect()
  public unMergeAccountResponse$: Observable<Action> = this.action$
    .ofType(AccountsAction.UNMERGE_ACCOUNT_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast(action.payload.body, '');
        let data: BaseResponse<string, AccountUnMergeRequest> = action.payload;
        return this.getAccountDetails(data.queryString.accountUniqueName);
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
        return this.groupWithAccountsAction.getGroupDetails(activeGroup.uniqueName);
      }
      return {
        type: ''
      };
    });

  constructor(private action$: Actions,
    private _accountService: AccountService,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private groupWithAccountsAction: GroupWithAccountsAction) {
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

  public createAccountV2(value: string, account: AccountRequestV2): Action {
    return {
      type: AccountsAction.CREATE_ACCOUNTV2,
      payload: Object.assign({}, {
        accountUniqueName: value
      }, {
          account
        })
    };
  }

  public createAccountResponseV2(value: BaseResponse<AccountResponseV2, AccountRequestV2>): Action {
    return {
      type: AccountsAction.CREATE_ACCOUNT_RESPONSEV2,
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

  public updateAccountV2(value: { groupUniqueName: string, accountUniqueName: string }, account: AccountRequestV2): Action {
    return {
      type: AccountsAction.UPDATE_ACCOUNTV2,
      payload: { account, value }
    };
  }

  public updateAccountResponseV2(value: BaseResponse<AccountResponseV2, AccountRequestV2>): Action {
    return {
      type: AccountsAction.UPDATE_ACCOUNT_RESPONSEV2,
      payload: value
    };
  }

  public getAccountDetails(value: string): Action {
    return {
      type: AccountsAction.GET_ACCOUNT_DETAILS,
      payload: value
    };
  }

  public getAccountDetailsResponse(value: BaseResponse<AccountResponseV2, string>): Action {
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

  // SHARE
  public shareEntity(value: ShareEntityRequest, accountUniqueName: string): Action {
    return {
      type: AccountsAction.SHARE_ENTITY,
      payload: Object.assign({}, {
        body: value
      }, {
          accountUniqueName
        })
    };
  }

  public shareEntityResponse(value: BaseResponse<string, ShareEntityRequest>): Action {
    return {
      type: AccountsAction.SHARE_ENTITY_RESPONSE,
      payload: value
    };
  }

  // UNSHARE
  public unShareEntity(value: ShareEntityRequest, accountUniqueName: string): Action {
    return {
      type: AccountsAction.UN_SHARE_ENTITY,
      payload: Object.assign({}, {
        body: value
      }, {
          accountUniqueName
        })
    };
  }

  public UnShareEntityResponse(value: BaseResponse<string, ShareEntityRequest>): Action {
    return {
      type: AccountsAction.UN_SHARE_ENTITY_RESPONSE,
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

  public mergeAccount(accountUniqueName: string, data: AccountMergeRequest[]): Action {
    return {
      type: AccountsAction.MERGE_ACCOUNT,
      payload: { accountUniqueName, data }
    };
  }

  public mergeAccountResponse(value: BaseResponse<string, AccountMergeRequest[]>): Action {
    return {
      type: AccountsAction.MERGE_ACCOUNT_RESPONSE,
      payload: value
    };
  }

  public unmergeAccount(accountUniqueName: string, data: AccountUnMergeRequest): Action {
    return {
      type: AccountsAction.UNMERGE_ACCOUNT,
      payload: { accountUniqueName, data }
    };
  }

  public unmergeAccountResponse(value: BaseResponse<string, AccountUnMergeRequest>): Action {
    return {
      type: AccountsAction.UNMERGE_ACCOUNT_RESPONSE,
      payload: value
    };
  }
}
