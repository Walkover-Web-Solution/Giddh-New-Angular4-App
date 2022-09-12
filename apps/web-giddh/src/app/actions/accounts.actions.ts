import { map, switchMap, take } from 'rxjs/operators';
import { ShareRequestForm } from '../models/api-models/Permission';
import { AccountMergeRequest, AccountMoveRequest, AccountRequest, AccountRequestV2, AccountResponse, AccountResponseV2, AccountSharedWithResponse, AccountsTaxHierarchyResponse, AccountUnMergeRequest, ShareAccountRequest, ShareEntityRequest } from '../models/api-models/Account';
import { ApplyTaxRequest } from '../models/api-models/ApplyTax';
import { AccountService } from '../services/account.service';
import { AppState } from '../store/roots';
import { ToasterService } from '../services/toaster.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { Action, Store } from '@ngrx/store';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { GroupWithAccountsAction } from './groupwithaccounts.actions';
import { GeneralActions } from './general/general.actions';
import { CustomActions } from '../store/customActions';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { eventsConst } from 'apps/web-giddh/src/app/shared/header/components/eventsConst';
import { Observable } from 'rxjs';
import { ApplyDiscountRequestV2 } from '../models/api-models/ApplyDiscount';
import { IUpdateDbRequest } from "../models/interfaces/ulist.interface";
import { CommonActions } from './common.actions';
import { LocaleService } from '../services/locale.service';

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
    public static UPDATE_ENTITY_PERMISSION = 'UpdateEntityPermission';
    public static UPDATE_ENTITY_PERMISSION_RESPONSE = 'UpdateEntityPermissionResponse';
    public static SHARE_ACCOUNT = 'AccountShare';
    public static SHARE_ACCOUNT_RESPONSE = 'AccountShareResponse';
    public static UNSHARE_ACCOUNT = 'AccountUnShare';
    public static UNSHARE_ACCOUNT_RESPONSE = 'AccountUnShareResponse';
    public static SHARED_ACCOUNT_WITH = 'AccountSharedWith';
    public static SHARED_ACCOUNT_WITH_RESPONSE = 'AccountSharedWithResponse';
    public static MOVE_ACCOUNT = 'AccountMove';
    public static MOVE_ACCOUNT_RESPONSE = 'AccountMoveResponse';
    public static MOVE_ACCOUNT_RESET = 'AccountMoveReset';
    public static UPDATE_ACCOUNT = 'UpdateAccount';
    public static UPDATE_ACCOUNT_RESPONSE = 'UpdateAccountResponse';
    public static UPDATE_ACCOUNTV2 = 'UpdateAccountV2';
    public static UPDATE_ACCOUNT_RESPONSEV2 = 'UpdateAccountResponseV2';
    public static GET_ACCOUNT_DETAILS = 'AccountDetails';
    public static GET_ACCOUNT_DETAILS_RESPONSE = 'AccountDetailsResponse';
    public static RESET_ACTIVE_ACCOUNT = 'AccountReset';
    public static RESET_ACTIVE_GROUP = 'GroupReset';
    public static GET_ACCOUNT_TAX_HIERARCHY = 'AccountTaxHierarchy';
    public static GET_ACCOUNT_TAX_HIERARCHY_RESPONSE = 'AccountTaxHierarchyResponse';
    public static APPLY_GROUP_TAX = 'ApplyAccountTax';
    public static APPLY_GROUP_TAX_RESPONSE = 'ApplyAccountTaxResponse';
    public static DELETE_ACCOUNT = 'AccountDelete';
    public static DELETE_ACCOUNT_RESPONSE = 'AccountDeleteResponse';
    public static RESET_DELETE_ACCOUNT_FLAGS = 'AccountResetDeleteFlags';
    public static MERGE_ACCOUNT = 'AccountMerge';
    public static MERGE_ACCOUNT_RESPONSE = 'AccountMergeResponse';
    public static APPLY_ACCOUNT_DISCOUNTS_V2 = 'ApplyAccountDiscountv2';
    public static APPLY_ACCOUNT_DISCOUNT_RESPONSE_V2 = 'ApplyAccountDiscountResponsesv2';
    public static UNMERGE_ACCOUNT = 'AccountUnMerge';
    public static UNMERGE_ACCOUNT_RESPONSE = 'AccountUnMergeResponse';
    public static ASSIGN_DISCOUNT_TO_ACCOUNT = 'ASSIGN_DISCOUNT_TO_ACCOUNT';
    public static RESET_SHARE_ENTITY = 'RESET_SHARE_ENTITY';
    public static RESET_UPDATE_ACCOUNTV2 = 'RESET_UPDATE_ACCOUNTV2';

    public ApplyAccountTax$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.APPLY_GROUP_TAX),
            switchMap((action: CustomActions) => this._accountService.ApplyTax(action.payload)),
            map(response => {
                return this.applyAccountTaxResponse(response);
            })));

    public ApplyAccountTaxResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.APPLY_GROUP_TAX_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return { type: 'EmptyAction' };
                }
                this._toasty.successToast(action.payload.body, action.payload.status);
                this.store.pipe(take(1)).subscribe((s) => {
                    if (s.groupwithaccounts && s.groupwithaccounts.activeGroup) {
                        return this.getAccountDetails(s.groupwithaccounts.activeAccount.uniqueName);
                    }
                });
                return { type: 'EmptyAction' };
            })));

    public CreateAccountV2$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.CREATE_ACCOUNTV2),
            switchMap((action: CustomActions) => this._accountService.CreateAccountV2(action.payload.account, action.payload.accountUniqueName)),
            map(response => {
                if (response.status === 'success') {
                    this.store.dispatch(this.groupWithAccountsAction.hideAddAccountForm());
                }
                return this.createAccountResponseV2(response);
            })));

    public CreateAccountResponseV2$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.CREATE_ACCOUNT_RESPONSEV2),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    this._generalServices.eventHandler.next({ name: eventsConst.accountAdded, payload: action.payload });
                    this._toasty.successToast(this.localeService.translate("app_messages.account_created"));
                }
                setTimeout(() => this.store.dispatch(this.groupWithAccountsAction.showAddAccountForm()), 1000);
                return { type: 'EmptyAction' };
            })));

    public GetAccountDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.GET_ACCOUNT_DETAILS),
            switchMap((action: CustomActions) => this._accountService.GetAccountDetailsV2(action.payload)),
            map(response => {
                return this.getAccountDetailsResponse(response);
            })));

    public GetAccountDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.GET_ACCOUNT_DETAILS_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public UpdateAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UPDATE_ACCOUNT),
            switchMap((action: CustomActions) => this._accountService.UpdateAccount(action.payload.account, action.payload.accountUniqueName)),
            map(response => {
                if (response && response.body && response.queryString) {
                    const updateIndexDb: IUpdateDbRequest = {
                        newUniqueName: response.body.uniqueName,
                        oldUniqueName: response.queryString.accountUniqueName,
                        latestName: response.request.name,
                        uniqueName: this._generalServices.companyUniqueName,
                        type: "accounts",
                        isActive: false,
                        name: response.body.name
                    }
                    this.store.dispatch(this._generalActions.updateIndexDb(updateIndexDb));
                }
                return this.updateAccountResponse(response);
            })));

    public UpdateAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UPDATE_ACCOUNT_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.account_updated"));
                    let groupSearchString: string;
                    this.store.pipe(take(1)).subscribe(a => {
                        groupSearchString = a.groupwithaccounts.groupAndAccountSearchString;
                    });
                    if (groupSearchString) {
                        this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(groupSearchString));
                    } else {
                        this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
                    }
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateAccountV2$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UPDATE_ACCOUNTV2),
            switchMap((action: CustomActions) => this._accountService.UpdateAccountV2(action.payload.account, action.payload.value)),
            map(response => {
                if (response.status === 'success') {
                    this.store.dispatch(this.commonActions.accountUpdated(true));
                    this.store.dispatch(this.groupWithAccountsAction.hideEditAccountForm());
                    const updateIndexDb: IUpdateDbRequest = {
                        newUniqueName: response.body.uniqueName,
                        oldUniqueName: response.queryString.accountUniqueName,
                        latestName: response.request.name,
                        uniqueName: this._generalServices.companyUniqueName,
                        type: "accounts",
                        isActive: false,
                        name: response.body.name
                    }
                    this.store.dispatch(this._generalActions.updateIndexDb(updateIndexDb));
                }
                return this.updateAccountResponseV2(response);
            })));

    public UpdateAccountResponseV2$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UPDATE_ACCOUNT_RESPONSEV2),
            map((action: CustomActions) => {
                let resData: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
                if (action.payload.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return { type: 'EmptyAction' };
                } else {
                    this._generalServices.invokeEvent.next(["accountUpdated", resData]);
                    this._generalServices.eventHandler.next({ name: eventsConst.accountUpdated, payload: resData });
                    this._toasty.successToast(this.localeService.translate("app_messages.account_updated"));
                    if (!action.payload?.queryString?.isMasterOpen) {
                        this.store.dispatch(this.getAccountDetails(resData.body.uniqueName));
                    }
                }
                return { type: 'EmptyAction' };
            })));

    public getGroupTaxHierarchy$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.GET_ACCOUNT_TAX_HIERARCHY),
            switchMap((action: CustomActions) => this._accountService.GetTaxHierarchy(action.payload)),
            map(response => {
                return this.getTaxHierarchyResponse(response);
            })));

    public getGroupTaxHierarchyResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.GET_ACCOUNT_TAX_HIERARCHY_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public shareEntity$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.SHARE_ENTITY),
            switchMap((action: CustomActions) =>
                this._accountService.Share(
                    action.payload.body,
                    action.payload.accountUniqueName
                )
            ),
            map(response => {
                return this.shareEntityResponse(response);
            })));

    public shareEntityResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.SHARE_ENTITY_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    let data: BaseResponse<string, ShareAccountRequest> = action.payload;
                    this._toasty.successToast(this.localeService.translate("app_messages.account_shared"), '');
                    if (data.queryString.entity === 'account') {
                        return this.sharedAccountWith(data.queryString.entityUniqueName);
                    } else if (data.queryString.entity === 'group') {
                        return this.groupWithAccountsAction.sharedGroupWith(data.queryString.entityUniqueName);
                    } else {
                        return {
                            type: 'EmptyAction'
                        };
                    }
                }
            })));

    public unShareEntity$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UN_SHARE_ENTITY),
            switchMap((action: CustomActions) =>
                this._accountService.UnShare(action.payload.entryUniqueName, action.payload.entity, action.payload.entityUniqueName)
            ),
            map(response => {
                return this.UnShareEntityResponse(response);
            })));

    public unShareEntityResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UN_SHARE_ENTITY_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    let data: BaseResponse<string, ShareAccountRequest> = action.payload;
                    this._toasty.successToast(action.payload.body, '');
                    if (data.queryString.entity === 'account') {
                        return this.sharedAccountWith(data.queryString.entityUniqueName);
                    } else if (data.queryString.entity === 'group') {
                        return this.groupWithAccountsAction.sharedGroupWith(data.queryString.entityUniqueName);
                    } else {
                        return {
                            type: 'EmptyAction'
                        };
                    }
                }
            })));

    public updateEntityPermission$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UPDATE_ENTITY_PERMISSION),
            switchMap((action: CustomActions) =>
                this._accountService.UpdateEntityPermission(action.payload.model, action.payload.entity, action.payload.newRoleUniqueName)
            ),
            map(response => {
                return this.updateEntityPermissionResponse(response);
            })));

    public updateEntityPermissionResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UPDATE_ENTITY_PERMISSION_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.role_updated"), '');
                    return {
                        type: 'EmptyAction'
                    };
                }
            })));

    public unShareAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UNSHARE_ACCOUNT),
            switchMap((action: CustomActions) =>
                this._accountService.AccountUnshare(
                    action.payload.user,
                    action.payload.accountUniqueName
                )
            ),
            map(response => {
                return this.unShareAccountResponse(response);
            })));

    public unShareAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UNSHARE_ACCOUNT_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    this._toasty.successToast(action.payload.body, '');
                }
                let accountUniqueName = null;
                this.store.pipe(take(1)).subscribe(s => {
                    accountUniqueName = s.groupwithaccounts.activeAccount.uniqueName;
                });
                return this.sharedAccountWith(accountUniqueName);
            })));

    public sharedAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.SHARED_ACCOUNT_WITH),
            switchMap((action: CustomActions) => this._accountService.AccountShareWith(action.payload)),
            map(response => {
                return this.sharedAccountWithResponse(response);
            })));

    public sharedAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.SHARED_ACCOUNT_WITH_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public moveAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.MOVE_ACCOUNT),
            switchMap((action: CustomActions) =>
                this._accountService.AccountMove(
                    action.payload.body,
                    action.payload.accountUniqueName,
                    action.payload.activeGroupUniqueName
                )
            ),
            map(response => {
                return this.moveAccountResponse(response);
            })));

    public moveAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.MOVE_ACCOUNT_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    let data: BaseResponse<string, AccountMoveRequest> = action.payload;
                    this._generalServices.eventHandler.next({ name: eventsConst.accountMoved, payload: data });
                    this._toasty.successToast(this.localeService.translate("app_messages.account_moved"), '');
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public mergeAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.MERGE_ACCOUNT),
            switchMap((action: CustomActions) =>
                this._accountService.MergeAccount(
                    action.payload.data,
                    action.payload.accountUniqueName
                )
            ),
            map(response => {
                return this.mergeAccountResponse(response);
            })));

    public mergeAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.MERGE_ACCOUNT_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast(action.payload.body, '');
                    let data: BaseResponse<string, AccountMergeRequest[]> = action.payload;
                    this._generalServices.eventHandler.next({ name: eventsConst.accountMerged, payload: data });
                    if (data.request && data.request.length) {
                        data.request.forEach(uniqueAccountName => {
                            const request: IUpdateDbRequest = {
                                uniqueName: this._generalServices.companyUniqueName,
                                deleteUniqueName: uniqueAccountName.uniqueName,
                                type: "accounts",
                                name: this._generalServices.companyUniqueName,
                                isActive: false
                            }
                            this.store.dispatch(this._generalActions.deleteEntryFromIndexDb(request));
                        });
                    }
                    return this.getAccountDetails(data.queryString.accountUniqueName);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public unMergeAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UNMERGE_ACCOUNT),
            switchMap((action: CustomActions) =>
                this._accountService.UnmergeAccount(
                    action.payload.data,
                    action.payload.accountUniqueName
                )
            ),
            map(response => {
                return this.unmergeAccountResponse(response);
            })));

    public unMergeAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.UNMERGE_ACCOUNT_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast(action.payload.body, '');
                    let data: BaseResponse<string, AccountUnMergeRequest> = action.payload;
                    return this.getAccountDetails(data.queryString.accountUniqueName);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public DeleteAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.DELETE_ACCOUNT),
            switchMap((action: CustomActions) => this._accountService.DeleteAccount(action.payload.accountUniqueName, action.payload?.groupUniqueName)),
            map(response => {
                return this.deleteAccountResponse(response);
            })));

    public DeleteAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AccountsAction.DELETE_ACCOUNT_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._generalServices.invokeEvent.next(["accountdeleted", action.payload.request?.groupUniqueName]);
                    this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(action.payload.request?.groupUniqueName));
                    this._generalServices.eventHandler.next({ name: eventsConst.accountDeleted, payload: action.payload });
                    const request: IUpdateDbRequest = {
                        uniqueName: this._generalServices.companyUniqueName,
                        deleteUniqueName: action.payload.queryString,
                        type: "accounts",
                        name: this._generalServices.companyUniqueName,
                        isActive: false
                    }
                    this.store.dispatch(this._generalActions.deleteEntryFromIndexDb(request));
                    this._toasty.successToast(action.payload.body, '');
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public ApplyAccountDiscountsV2$: Observable<Action> = createEffect(() => this.action$
        .pipe(ofType(AccountsAction.APPLY_ACCOUNT_DISCOUNTS_V2),
            switchMap((action: CustomActions) => this._accountService.applyDiscounts(action.payload)),
            map(response => {
                return this.applyAccountDiscountResponseV2(response);
            })));

    public ApplyAccountDiscountResponseV2$: Observable<Action> = createEffect(() => this.action$
        .pipe(ofType(AccountsAction.APPLY_ACCOUNT_DISCOUNT_RESPONSE_V2),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else if (action.payload.status === 'success') {
                    this._toasty.successToast(this.localeService.translate("app_messages.discount_linked"), action.payload.status);
                }
                return { type: 'EmptyAction' };
            })));

    constructor(private action$: Actions,
        private _accountService: AccountService,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private _generalActions: GeneralActions,
        private _generalServices: GeneralService,
        private commonActions: CommonActions,
        private localeService: LocaleService) {
    }

    public createAccountV2(value: string, account: AccountRequestV2): CustomActions {
        return {
            type: AccountsAction.CREATE_ACCOUNTV2,
            payload: Object.assign({}, {
                accountUniqueName: value
            }, {
                account
            })
        };
    }

    public createAccountResponseV2(value: BaseResponse<AccountResponseV2, AccountRequestV2>): CustomActions {
        return {
            type: AccountsAction.CREATE_ACCOUNT_RESPONSEV2,
            payload: value
        };
    }

    public updateAccount(value: string, account: AccountRequest): CustomActions {
        return {
            type: AccountsAction.UPDATE_ACCOUNT,
            payload: Object.assign({}, {
                accountUniqueName: value
            }, {
                account
            })
        };
    }

    public updateAccountResponse(value: BaseResponse<AccountResponse, AccountRequest>): CustomActions {
        return {
            type: AccountsAction.UPDATE_ACCOUNT_RESPONSE,
            payload: value
        };
    }

    public updateAccountV2(value: { groupUniqueName: string, accountUniqueName: string, isMasterOpen?: boolean }, account: AccountRequestV2): CustomActions {
        return {
            type: AccountsAction.UPDATE_ACCOUNTV2,
            payload: { account, value }
        };
    }

    public resetUpdateAccountV2(): CustomActions {
        return {
            type: AccountsAction.RESET_UPDATE_ACCOUNTV2
        };
    }

    public updateAccountResponseV2(value: BaseResponse<AccountResponseV2, AccountRequestV2>): CustomActions {
        return {
            type: AccountsAction.UPDATE_ACCOUNT_RESPONSEV2,
            payload: value
        };
    }

    public getAccountDetails(value: string): CustomActions {
        return {
            type: AccountsAction.GET_ACCOUNT_DETAILS,
            payload: value
        };
    }

    public getAccountDetailsResponse(value: BaseResponse<AccountResponseV2, string>): CustomActions {
        return {
            type: AccountsAction.GET_ACCOUNT_DETAILS_RESPONSE,
            payload: value
        };
    }

    // SHARE
    public shareEntity(value: ShareEntityRequest, accountUniqueName: string): CustomActions {
        return {
            type: AccountsAction.SHARE_ENTITY,
            payload: Object.assign({}, {
                body: value
            }, {
                accountUniqueName
            })
        };
    }

    public shareEntityResponse(value: BaseResponse<string, ShareEntityRequest>): CustomActions {
        return {
            type: AccountsAction.SHARE_ENTITY_RESPONSE,
            payload: value
        };
    }

    // UNSHARE
    public unShareEntity(entryUniqueName: string, entity: string, entityUniqueName: string): CustomActions {
        return {
            type: AccountsAction.UN_SHARE_ENTITY,
            payload: { entryUniqueName, entity, entityUniqueName }
        };
    }

    public UnShareEntityResponse(value: BaseResponse<string, ShareEntityRequest>): CustomActions {
        return {
            type: AccountsAction.UN_SHARE_ENTITY_RESPONSE,
            payload: value
        };
    }

    // updateEntityPermission
    public updateEntityPermission(model: ShareRequestForm, newRoleUniqueName: string, entity: string): CustomActions {
        return {
            type: AccountsAction.UPDATE_ENTITY_PERMISSION,
            payload: { model, newRoleUniqueName, entity }
        };
    }

    public updateEntityPermissionResponse(value: BaseResponse<string, ShareEntityRequest>): CustomActions {
        return {
            type: AccountsAction.UPDATE_ENTITY_PERMISSION_RESPONSE,
            payload: value
        };
    }

    public unShareAccount(value: string, accountUniqueName: string): CustomActions {
        return {
            type: AccountsAction.UNSHARE_ACCOUNT,
            payload: Object.assign({}, {
                user: value
            }, {
                accountUniqueName
            })
        };
    }

    public unShareAccountResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: AccountsAction.UNSHARE_ACCOUNT_RESPONSE,
            payload: value
        };
    }

    public moveAccount(value: AccountMoveRequest, accountUniqueName: string, activeGroupUniqueName: string): CustomActions {
        return {
            type: AccountsAction.MOVE_ACCOUNT,
            payload: Object.assign({}, {
                body: value
            }, {
                accountUniqueName,
                activeGroupUniqueName
            })
        };
    }

    public moveAccountResponse(value: BaseResponse<string, AccountMoveRequest>): CustomActions {
        return {
            type: AccountsAction.MOVE_ACCOUNT_RESPONSE,
            payload: value
        };
    }

    public moveAccountReset(): CustomActions {
        return {
            type: AccountsAction.MOVE_ACCOUNT_RESET
        };
    }

    public sharedAccountWith(accountUniqueName: string): CustomActions {
        return {
            type: AccountsAction.SHARED_ACCOUNT_WITH,
            payload: accountUniqueName
        };
    }

    public sharedAccountWithResponse(value: BaseResponse<AccountSharedWithResponse[], string>): CustomActions {
        return {
            type: AccountsAction.SHARED_ACCOUNT_WITH_RESPONSE,
            payload: value
        };
    }

    public resetActiveAccount(): CustomActions {
        return {
            type: AccountsAction.RESET_ACTIVE_ACCOUNT
        };
    }

    /**
     * This will use for reset active group for create account
     *
     * @return {*}  {CustomActions}
     * @memberof AccountsAction
     */
    public resetActiveGroup(): CustomActions {
        return {
            type: AccountsAction.RESET_ACTIVE_GROUP
        };
    }

    public getTaxHierarchy(value: string): CustomActions {
        return {
            type: AccountsAction.GET_ACCOUNT_TAX_HIERARCHY,
            payload: value
        };
    }

    public getTaxHierarchyResponse(value: BaseResponse<AccountsTaxHierarchyResponse, string>): CustomActions {
        return {
            type: AccountsAction.GET_ACCOUNT_TAX_HIERARCHY_RESPONSE,
            payload: value
        };
    }

    public applyAccountTax(value: ApplyTaxRequest): CustomActions {
        return {
            type: AccountsAction.APPLY_GROUP_TAX,
            payload: value
        };
    }

    public applyAccountTaxResponse(value: BaseResponse<string, ApplyTaxRequest>): CustomActions {
        return {
            type: AccountsAction.APPLY_GROUP_TAX_RESPONSE,
            payload: value
        };
    }

    public applyAccountDiscountV2(value: ApplyDiscountRequestV2[]): CustomActions {
        return {
            type: AccountsAction.APPLY_ACCOUNT_DISCOUNTS_V2,
            payload: value
        };
    }

    public applyAccountDiscountResponseV2(value: BaseResponse<string, ApplyDiscountRequestV2>): CustomActions {
        return {
            type: AccountsAction.APPLY_ACCOUNT_DISCOUNT_RESPONSE_V2,
            payload: value
        };
    }

    public deleteAccount(accountUniqueName: string, groupUniqueName: string): CustomActions {
        return {
            type: AccountsAction.DELETE_ACCOUNT,
            payload: { accountUniqueName, groupUniqueName }
        };
    }

    public deleteAccountResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: AccountsAction.DELETE_ACCOUNT_RESPONSE,
            payload: value
        };
    }

    public resetDeleteAccountFlags(): CustomActions {
        return {
            type: AccountsAction.RESET_DELETE_ACCOUNT_FLAGS
        }
    }

    public mergeAccount(accountUniqueName: string, data: AccountMergeRequest[]): CustomActions {
        return {
            type: AccountsAction.MERGE_ACCOUNT,
            payload: { accountUniqueName, data }
        };
    }

    public mergeAccountResponse(value: BaseResponse<string, AccountMergeRequest[]>): CustomActions {
        return {
            type: AccountsAction.MERGE_ACCOUNT_RESPONSE,
            payload: value
        };
    }

    public unmergeAccount(accountUniqueName: string, data: AccountUnMergeRequest): CustomActions {
        return {
            type: AccountsAction.UNMERGE_ACCOUNT,
            payload: { accountUniqueName, data }
        };
    }

    public unmergeAccountResponse(value: BaseResponse<string, AccountUnMergeRequest>): CustomActions {
        return {
            type: AccountsAction.UNMERGE_ACCOUNT_RESPONSE,
            payload: value
        };
    }

    public resetShareEntity(): CustomActions {
        return {
            type: AccountsAction.RESET_SHARE_ENTITY
        }
    }
}
