import { map, switchMap, take } from 'rxjs/operators';
import { AppState } from '../store';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GroupCreateRequest, GroupResponse, GroupSharedWithResponse, GroupsTaxHierarchyResponse, GroupUpateRequest, MoveGroupRequest, MoveGroupResponse } from '../models/api-models/Group';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { GroupsWithAccountsResponse } from '../models/api-models/GroupsWithAccounts';
import { GroupService } from '../services/group.service';
import { ToasterService } from '../services/toaster.service';
import { AccountService } from '../services/account.service';
import { ApplyTaxRequest } from '../models/api-models/ApplyTax';
import { IGroupsWithAccounts } from '../models/interfaces/groupsWithAccounts.interface';
import { GeneralActions } from './general/general.actions';
import { CustomActions } from '../store/customActions';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { eventsConst } from 'apps/web-giddh/src/app/shared/header/components/eventsConst';
import { LocaleService } from '../services/locale.service';

@Injectable()
export class GroupWithAccountsAction {
    public static SHOW_ADD_NEW_FORM = 'SHOW_ADD_NEW_FORM';
    public static HIDE_ADD_NEW_FORM = 'HIDE_ADD_NEW_FORM';
    public static SET_ACTIVE_GROUP = 'SetActiveGroup';
    public static GET_GROUP_WITH_ACCOUNTS = 'GroupWithAccounts';
    public static GET_GROUP_WITH_ACCOUNTS_RESPONSE = 'GroupWithAccountsResponse';
    public static SET_GROUP_ACCOUNTS_SEARCH_STRING = 'GroupAccountsSearchString';
    public static GET_GROUP_DETAILS = 'GroupDetails';
    public static GET_GROUP_DETAILS_RESPONSE = 'GroupDetailsResponse';
    public static CREATE_GROUP = 'GroupCreate';
    public static CREATE_GROUP_RESPONSE = 'GroupCreateResponse';
    public static UPDATE_GROUP = 'GroupUpdate';
    public static UPDATE_GROUP_RESPONSE = 'GroupUpdateResponse';
    public static UNSHARE_GROUP = 'GroupUnShare';
    public static UNSHARE_GROUP_RESPONSE = 'GroupUnShareResponse';
    public static SHARED_GROUP_WITH = 'GroupSharedWith';
    public static SHARED_GROUP_WITH_RESPONSE = 'GroupSharedWithResponse';
    public static MOVE_GROUP = 'GroupMove';
    public static MOVE_GROUP_RESPONSE = 'GroupMoveResponse';
    public static MOVE_GROUP_COMPLETE = 'GroupMoveComplete';
    public static GET_GROUP_TAX_HIERARCHY = 'GroupTaxHierarchy';
    public static GET_GROUP_TAX_HIERARCHY_RESPONSE = 'GroupTaxHierarchyResponse';

    public static SHOW_ADD_GROUP_FORM = 'GroupShowAddGroupForm';

    public static SHOW_ADD_ACCOUNT_FORM = 'GroupShowAddAccountForm';
    public static HIDE_ADD_ACCOUNT_FORM = 'GroupHideAddAccountForm';
    public static SHOW_EDIT_ACCOUNT_FORM = 'GroupShowEditAccountForm';
    public static HIDE_EDIT_ACCOUNT_FORM = 'GroupHideEditAccountForm';

    public static RESET_GROUPS_STATE = 'GroupResetState';
    public static APPLY_GROUP_TAX = 'ApplyGroupTax';
    public static APPLY_GROUP_TAX_RESPONSE = 'ApplyGroupTaxResponse';

    public static DELETE_GROUP = 'GroupDelete';
    public static DELETE_GROUP_RESPONSE = 'GroupDeleteResponse';

    public static GEN_ADD_AND_MANAGE_UI = 'GEN_ADD_AND_MANAGE_UI';

    public static OPEN_ADD_AND_MANAGE_FROM_OUTSIDE = 'OPEN_ADD_AND_MANAGE_FROM_OUTSIDE';
    public static HIDE_ADD_AND_MANAGE_FROM_OUTSIDE = 'HIDE_ADD_AND_MANAGE_FROM_OUTSIDE';
    public static UPDATE_ACTIVE_TAB_ADD_AND_MANAGE = 'UPDATE_ACTIVE_TAB_ADD_AND_MANAGE';
    public static RESET_EDIT_GROUP = 'ResetEditGroup';
    public static GET_ACCOUNT_GROUP_DETAILS = 'GetAccountGroupDetails';
    public static GET_ACCOUNT_GROUP_DETAILS_RESPONSE = 'GetAccountGroupDetailsResponse';

    public ApplyGroupTax$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.APPLY_GROUP_TAX),
            switchMap((action: CustomActions) => this._accountService.ApplyTax(action.payload)),
            map((response) => {
                return this.applyGroupTaxResponse(response);
            })));

    public ApplyGroupTaxResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.APPLY_GROUP_TAX_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return { type: 'EmptyAction' };
                }
                this._toasty.successToast(action.payload.body, action.payload.status);
                let grouName = null;
                this.store.pipe(take(1)).subscribe((s) => {
                    if (s.groupwithaccounts.activeGroup) {
                        grouName = s.groupwithaccounts.activeGroup?.uniqueName;
                    }
                });
                return this.getTaxHierarchy(grouName);
            })));

    public SetActiveGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.SET_ACTIVE_GROUP),
            map((action: CustomActions) => {
                return {
                    type: 'EmptyAction'
                };
            })));

    public GetGroupsWithAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS),
            switchMap((action: CustomActions) =>
                this._groupService.GetGroupsWithAccounts(action.payload)
            ),
            map((response) => {
                if (response.request?.length > 0) {
                    this.store.dispatch(this.resetAddAndMangePopup());
                } else {
                    this.store.dispatch(this._generalActions.getGroupWithAccountsResponse(response));
                }
                return this.getGroupWithAccountsResponse(response);
            })));

    public GetGroupsWithAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public GetGroupsDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.GET_GROUP_DETAILS),
            switchMap((action: CustomActions) => this._groupService.GetGroupDetails(action.payload)),
            map((response) => {
                return this.getGroupDetailsResponse(response);
            })));

    public GetGroupDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.GET_GROUP_DETAILS_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public CreateGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.CREATE_GROUP),
            switchMap((action: CustomActions) => this._groupService.CreateGroup(action.payload)),
            map((response) => {
                return this.createGroupResponse(response);
            })));

    public CreateGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.CREATE_GROUP_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._generalService.eventHandler.next({ name: eventsConst.groupAdded, payload: action.payload });
                    this._toasty.successToast(this.localeService.translate("app_messages.subgroup_added"), this.localeService.translate("app_success"));
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public unShareGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.UNSHARE_GROUP),
            switchMap((action: CustomActions) =>
                this._groupService.UnShareGroup(
                    action.payload.user,
                    action.payload.groupUniqueName
                )
            ),
            map((response) => {
                return this.unShareGroupResponse(response);
            })));

    public unShareGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.UNSHARE_GROUP_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast(action.payload.body, '');
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public sharedGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.SHARED_GROUP_WITH),
            switchMap((action: CustomActions) => this._groupService.ShareWithGroup(action.payload)),
            map((response) => {
                return this.sharedGroupWithResponse(response);
            })));

    public sharedGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.SHARED_GROUP_WITH_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public moveGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.MOVE_GROUP),
            switchMap((action: CustomActions) =>
                this._groupService.MoveGroup(
                    action.payload.body,
                    action.payload.groupUniqueName
                )
            ),
            map(response => {
                return this.moveGroupResponse(response);
            })));

    public moveGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.MOVE_GROUP_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.group_moved"), '');
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public getGroupTaxHierarchy$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY),
            switchMap((action: CustomActions) => this._groupService.GetTaxHierarchy(action.payload)),
            map(response => {
                return this.getTaxHierarchyResponse(response);
            })));

    public getGroupTaxHierarchyResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public UpdateGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.UPDATE_GROUP),
            switchMap((action: CustomActions) => this._groupService.UpdateGroup(action.payload.data, action.payload.groupUniqueName)),
            map(response => {
                return this.updateGroupResponse(response);
            })));

    public UpdateGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.UPDATE_GROUP_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._generalService.eventHandler.next({ name: eventsConst.groupUpdated, payload: action.payload });
                    this._toasty.successToast(this.localeService.translate("app_messages.group_updated"));
                }

                return {
                    type: 'EmptyAction'
                };
            })));

    public DeleteGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.DELETE_GROUP),
            switchMap((action: CustomActions) => this._groupService.DeleteGroup(action.payload)),
            map(response => {
                return this.deleteGroupResponse(response);
            })));

    public DeleteGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.DELETE_GROUP_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast(action.payload.body, '');
                }
                return {
                    type: GroupWithAccountsAction.DELETE_GROUP_RESPONSE
                };
            })));

    public getAccountGroupsDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.GET_ACCOUNT_GROUP_DETAILS),
            switchMap((action: CustomActions) => this._groupService.GetGroupDetails(action.payload)),
            map((response) => {
                return this.getAccountGroupDetailsResponse(response);
            })));

    public getAccountGroupDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GroupWithAccountsAction.GET_ACCOUNT_GROUP_DETAILS_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    constructor(private action$: Actions,
        private _groupService: GroupService,
        private _accountService: AccountService,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _generalActions: GeneralActions,
        private _generalService: GeneralService,
        private localeService: LocaleService) {
        
    }

    public SetActiveGroup(uniqueName: string): CustomActions {
        return {
            type: GroupWithAccountsAction.SET_ACTIVE_GROUP,
            payload: uniqueName
        };
    }

    public getGroupWithAccounts(value?: string): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS,
            payload: value
        };
    }

    public getGroupWithAccountsResponse(value: BaseResponse<GroupsWithAccountsResponse[], string>): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS_RESPONSE,
            payload: value
        };
    }

    public setGroupAndAccountsSearchString(value: string): CustomActions {
        return {
            type: GroupWithAccountsAction.SET_GROUP_ACCOUNTS_SEARCH_STRING,
            payload: value
        };
    }

    public getGroupDetails(value: string): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_GROUP_DETAILS,
            payload: value
        };
    }

    public getGroupDetailsResponse(value: BaseResponse<GroupResponse, string>): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_GROUP_DETAILS_RESPONSE,
            payload: value
        };
    }

    public createGroup(value: GroupCreateRequest): CustomActions {
        return {
            type: GroupWithAccountsAction.CREATE_GROUP,
            payload: value
        };
    }

    public createGroupResponse(value: BaseResponse<GroupResponse, GroupCreateRequest>): CustomActions {
        return {
            type: GroupWithAccountsAction.CREATE_GROUP_RESPONSE,
            payload: value
        };
    }

    public unShareGroup(value: string, groupUniqueName: string): CustomActions {
        return {
            type: GroupWithAccountsAction.UNSHARE_GROUP,
            payload: Object.assign({}, {
                user: value
            }, {
                groupUniqueName
            })
        };
    }

    public unShareGroupResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: GroupWithAccountsAction.UNSHARE_GROUP_RESPONSE,
            payload: value
        };
    }

    public sharedGroupWith(groupUniqueName: string): CustomActions {
        return {
            type: GroupWithAccountsAction.SHARED_GROUP_WITH,
            payload: groupUniqueName
        };
    }

    public sharedGroupWithResponse(value: BaseResponse<GroupSharedWithResponse[], string>): CustomActions {
        return {
            type: GroupWithAccountsAction.SHARED_GROUP_WITH_RESPONSE,
            payload: value
        };
    }

    public moveGroup(value: MoveGroupRequest, groupUniqueName: string): CustomActions {
        return {
            type: GroupWithAccountsAction.MOVE_GROUP,
            payload: Object.assign({}, {
                body: value
            }, {
                groupUniqueName
            })
        };
    }

    public moveGroupResponse(value: BaseResponse<MoveGroupResponse, MoveGroupRequest>): CustomActions {
        return {
            type: GroupWithAccountsAction.MOVE_GROUP_RESPONSE,
            payload: value
        };
    }

    public getTaxHierarchy(value: string): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY,
            payload: value
        };
    }

    public getTaxHierarchyResponse(value: BaseResponse<GroupsTaxHierarchyResponse, string>): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY_RESPONSE,
            payload: value
        };
    }

    public resetAddAndMangePopup(): CustomActions {
        return {
            type: GroupWithAccountsAction.RESET_GROUPS_STATE
        };
    }

    public showAddGroupForm(): CustomActions {
        return {
            type: GroupWithAccountsAction.SHOW_ADD_GROUP_FORM
        };
    }

    public showAddAccountForm(): CustomActions {
        return {
            type: GroupWithAccountsAction.SHOW_ADD_ACCOUNT_FORM
        };
    }

    public hideAddAccountForm(): CustomActions {
        return {
            type: GroupWithAccountsAction.HIDE_ADD_ACCOUNT_FORM
        };
    }

    public showEditAccountForm(): CustomActions {
        return {
            type: GroupWithAccountsAction.SHOW_EDIT_ACCOUNT_FORM
        };
    }

    public hideEditAccountForm(): CustomActions {
        return {
            type: GroupWithAccountsAction.HIDE_EDIT_ACCOUNT_FORM
        };
    }

    public updateGroup(value: GroupUpateRequest, groupUniqueName: string): CustomActions {
        return {
            type: GroupWithAccountsAction.UPDATE_GROUP,
            payload: Object.assign({}, { groupUniqueName }, { data: value })
        };
    }

    public updateGroupResponse(value: BaseResponse<GroupResponse, GroupUpateRequest>): CustomActions {
        return {
            type: GroupWithAccountsAction.UPDATE_GROUP_RESPONSE,
            payload: value
        };
    }

    public applyGroupTax(value: ApplyTaxRequest): CustomActions {
        return {
            type: GroupWithAccountsAction.APPLY_GROUP_TAX,
            payload: value
        };
    }

    public applyGroupTaxResponse(value: BaseResponse<string, ApplyTaxRequest>): CustomActions {
        return {
            type: GroupWithAccountsAction.APPLY_GROUP_TAX_RESPONSE,
            payload: value
        };
    }

    public deleteGroup(value: string): CustomActions {
        return {
            type: GroupWithAccountsAction.DELETE_GROUP,
            payload: value
        };
    }

    public deleteGroupResponse(value: BaseResponse<any, string>): CustomActions {
        return {
            type: GroupWithAccountsAction.DELETE_GROUP_RESPONSE,
            payload: value
        };
    }

    public showAddNewForm(): CustomActions {
        return {
            type: GroupWithAccountsAction.SHOW_ADD_NEW_FORM
        };
    }

    public hideAddNewForm(): CustomActions {
        return {
            type: GroupWithAccountsAction.HIDE_ADD_NEW_FORM
        };
    }

    public OpenAddAndManageFromOutside(value: string) {
        return {
            type: GroupWithAccountsAction.OPEN_ADD_AND_MANAGE_FROM_OUTSIDE,
            payload: value
        };
    }

    public HideAddAndManageFromOutside() {
        return {
            type: GroupWithAccountsAction.HIDE_ADD_AND_MANAGE_FROM_OUTSIDE
        };
    }

    public findMyParent(groups: IGroupsWithAccounts[], uniqueName: string, parent: IGroupsWithAccounts): IGroupsWithAccounts {
        if (groups && groups.length > 0) {
            for (let grp of groups) {
                if (grp?.uniqueName === uniqueName) {
                    return Object.assign({}, parent);
                }
                if (grp.groups) {
                    let result = this.findMyParent(grp.groups, uniqueName, grp);
                    if (result) {
                        return Object.assign({}, result);
                    }
                }
            }
        }
        return null;
    }

    public moveGroupComplete() {
        return {
            type: GroupWithAccountsAction.MOVE_GROUP_COMPLETE
        };
    }

    /**
     * This will update which tab should be active in master
     *
     * @param {number} value
     * @returns
     * @memberof GroupWithAccountsAction
     */
    public updateActiveTabOpenAddAndManage(value: number) {
        return {
            type: GroupWithAccountsAction.UPDATE_ACTIVE_TAB_ADD_AND_MANAGE,
            payload: value
        };
    }

    /**
     * Gets account group details
     *
     * @param {string} value
     * @returns {CustomActions}
     * @memberof GroupWithAccountsAction
     */
    public getAccountGroupDetails(value: string): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_ACCOUNT_GROUP_DETAILS,
            payload: value
        };
    }

    /**
     * Handles account group details
     *
     * @param {BaseResponse<GroupResponse, string>} value
     * @returns {CustomActions}
     * @memberof GroupWithAccountsAction
     */
    public getAccountGroupDetailsResponse(value: BaseResponse<GroupResponse, string>): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_ACCOUNT_GROUP_DETAILS_RESPONSE,
            payload: value
        };
    }
}
