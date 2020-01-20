import { map, switchMap, take } from 'rxjs/operators';
import { AppState } from '../store';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { FlattenGroupsAccountsRequest, FlattenGroupsAccountsResponse, GroupCreateRequest, GroupResponse, GroupSharedWithResponse, GroupsTaxHierarchyResponse, GroupUpateRequest, MoveGroupRequest, MoveGroupResponse, ShareGroupRequest } from '../models/api-models/Group';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
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

@Injectable()
export class GroupWithAccountsAction {
    public static SHOW_ADD_NEW_FORM = 'SHOW_ADD_NEW_FORM';
    public static HIDE_ADD_NEW_FORM = 'HIDE_ADD_NEW_FORM';
    public static SET_ACTIVE_GROUP = 'SetActiveGroup';
    public static RESET_ACTIVE_GROUP = 'ResetActiveGroup';
    public static GET_GROUP_WITH_ACCOUNTS = 'GroupWithAccounts';
    public static GET_GROUP_WITH_ACCOUNTS_RESPONSE = 'GroupWithAccountsResponse';
    public static SET_GROUP_ACCOUNTS_SEARCH_STRING = 'GroupAccountsSearchString';
    public static RESET_GROUP_ACCOUNTS_SEARCH_STRING = 'ResetGroupAccountsSearchString';
    public static GET_GROUP_DETAILS = 'GroupDetails';
    public static GET_GROUP_DETAILS_RESPONSE = 'GroupDetailsResponse';
    public static GET_FLATTEN_GROUPS_ACCOUNTS = 'GetFlattenGroupsAccounts';
    public static GET_FLATTEN_GROUPS_ACCOUNTS_RESPONSE = 'GetFlattenGroupsAccountsResponse';
    public static CREATE_GROUP = 'GroupCreate';
    public static CREATE_GROUP_RESPONSE = 'GroupCreateResponse';
    public static UPDATE_GROUP = 'GroupUpdate';
    public static UPDATE_GROUP_RESPONSE = 'GroupUpdateResponse';
    public static SHARE_GROUP = 'GroupShare';
    public static SHARE_GROUP_RESPONSE = 'GroupShareResponse';
    public static UNSHARE_GROUP = 'GroupUnShare';
    public static UNSHARE_GROUP_RESPONSE = 'GroupUnShareResponse';
    public static SHARED_GROUP_WITH = 'GroupSharedWith';
    public static SHARED_GROUP_WITH_RESPONSE = 'GroupSharedWithResponse';
    public static MOVE_GROUP = 'GroupMove';
    public static MOVE_GROUP_RESPONSE = 'GroupMoveResponse';
    public static GET_GROUP_TAX_HIERARCHY = 'GroupTaxHierarchy';
    public static GET_GROUP_TAX_HIERARCHY_RESPONSE = 'GroupTaxHierarchyResponse';

    public static GET_GROUP_UNIQUENAME = 'GroupUniqueName';
    public static GET_GROUP_UNIQUENAME_RESPONSE = 'GroupUniqueNameResponse';

    public static SHOW_ADD_GROUP_FORM = 'GroupShowAddGroupForm';
    public static HIDE_ADD_GROUP_FORM = 'GroupHideAddGroupForm';
    public static SHOW_EDIT_GROUP_FORM = 'GroupShowEditGroupForm';
    public static HIDE_EDIT_GROUP_FORM = 'GroupHideEditGroupForm';

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

    @Effect()
    public ApplyGroupTax$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.APPLY_GROUP_TAX).pipe(
            switchMap((action: CustomActions) => this._accountService.ApplyTax(action.payload)),
            map((response) => {
                return this.applyGroupTaxResponse(response);
            }));

    @Effect()
    public ApplyGroupTaxResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.APPLY_GROUP_TAX_RESPONSE).pipe(
            map((action: CustomActions) => {
                let data: BaseResponse<string, ApplyTaxRequest> = action.payload;
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return { type: 'EmptyAction' };
                }
                this._toasty.successToast(action.payload.body, action.payload.status);
                let grouName = null;
                this.store.pipe(take(1)).subscribe((s) => {
                    if (s.groupwithaccounts.activeGroup) {
                        grouName = s.groupwithaccounts.activeGroup.uniqueName;
                    }
                });

                // get flatten accounts after group tax applied successfully
                this.store.dispatch(this._generalActions.getFlattenAccount());
                return this.getTaxHierarchy(grouName);
            }));

    @Effect()
    public SetActiveGroup$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.SET_ACTIVE_GROUP).pipe(
            map((action: CustomActions) => {
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public GetGroupsWithAccount$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS).pipe(
            switchMap((action: CustomActions) =>
                this._groupService.GetGroupsWithAccounts(action.payload)
            ),
            map((response) => {
                if (response.request.length > 0) {
                    this.store.dispatch(this.resetAddAndMangePopup());
                } else {
                    this.store.dispatch(this._generalActions.getGroupWithAccountsResponse(response));
                }
                return this.getGroupWithAccountsResponse(response);
            }));

    @Effect()
    public GetGroupsWithAccountResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public GetGroupsDetails$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.GET_GROUP_DETAILS).pipe(
            switchMap((action: CustomActions) => this._groupService.GetGroupDetails(action.payload)),
            map((response) => {
                return this.getGroupDetailsResponse(response);
            }));

    @Effect()
    public GetGroupDetailsResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.GET_GROUP_DETAILS_RESPONSE).pipe(
            map((action: CustomActions) => {
                let data: BaseResponse<GroupResponse, string> = action.payload;
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return { type: 'EmptyAction' };
                }
                // return this.sharedGroupWith(data.body.uniqueName); // JIRA CARD EL-351
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public CreateGroup$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.CREATE_GROUP).pipe(
            switchMap((action: CustomActions) => this._groupService.CreateGroup(action.payload)),
            map((response) => {
                return this.createGroupResponse(response);
            }));

    @Effect()
    public CreateGroupResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.CREATE_GROUP_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this.store.dispatch(this._generalActions.getFlattenGroupsReq());
                    this._generalService.eventHandler.next({ name: eventsConst.groupAdded, payload: action.payload });
                    this._toasty.successToast('Sub group added successfully', 'Success');
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public GetFlattenGroupsAccounts$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS).pipe(
            switchMap((action: CustomActions) =>
                this._groupService.GetFlattenGroupsAccounts(action.payload)
            ),
            map((response) => {
                return this.getFlattenGroupsAccountsResponse(response);
            }));

    @Effect()
    public GetFlattenGroupsAccountsResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public shareGroup$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.SHARE_GROUP).pipe(
            switchMap((action: CustomActions) =>
                this._groupService.ShareGroup(
                    action.payload.body,
                    action.payload.groupUniqueName
                )
            ),
            map((response) => {
                return this.shareGroupResponse(response);
            }));

    @Effect()
    public shareGroupResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.SHARE_GROUP_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast(action.payload.body, '');
                    let groupUniqueName = '';
                    this.store.pipe(take(1)).subscribe(s => {
                        groupUniqueName = s.groupwithaccounts.activeGroup.uniqueName;
                    });

                    return this.sharedGroupWith(groupUniqueName);
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public unShareGroup$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.UNSHARE_GROUP).pipe(
            switchMap((action: CustomActions) =>
                this._groupService.UnShareGroup(
                    action.payload.user,
                    action.payload.groupUniqueName
                )
            ),
            map((response) => {
                return this.unShareGroupResponse(response);
            }));

    @Effect()
    public unShareGroupResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.UNSHARE_GROUP_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast(action.payload.body, '');
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public sharedGroup$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.SHARED_GROUP_WITH).pipe(
            switchMap((action: CustomActions) => this._groupService.ShareWithGroup(action.payload)),
            map((response) => {
                return this.sharedGroupWithResponse(response);
            }));

    @Effect()
    public sharedGroupResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.SHARED_GROUP_WITH_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public moveGroup$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.MOVE_GROUP).pipe(
            switchMap((action: CustomActions) =>
                this._groupService.MoveGroup(
                    action.payload.body,
                    action.payload.groupUniqueName
                )
            ),
            map(response => {
                return this.moveGroupResponse(response);
            }));

    @Effect()
    public moveGroupResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.MOVE_GROUP_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    let data = action.payload as BaseResponse<MoveGroupResponse, MoveGroupRequest>;

                    // let groups;
                    // this.store.select(g => g.general.groupswithaccounts).take(1).subscribe(grps => groups = grps);
                    // this.store.dispatch({
                    //   type: GroupWithAccountsAction.GEN_ADD_AND_MANAGE_UI,
                    //   payload: { groups, groupUniqueName: data.request.parentGroupUniqueName }
                    // });

                    this._generalService.eventHandler.next({ name: eventsConst.groupMoved, payload: data });
                    this._toasty.successToast('Group moved successfully', '');
                    return this.getGroupDetails(data.request.parentGroupUniqueName);
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public getGroupTaxHierarchy$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY).pipe(
            switchMap((action: CustomActions) => this._groupService.GetTaxHierarchy(action.payload)),
            map(response => {
                return this.getTaxHierarchyResponse(response);
            }));

    @Effect()
    public getGroupTaxHierarchyResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public UpdateGroup$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.UPDATE_GROUP).pipe(
            switchMap((action: CustomActions) => this._groupService.UpdateGroup(action.payload.data, action.payload.groupUniqueName)),
            map(response => {
                return this.updateGroupResponse(response);
            }));
    @Effect()
    public UpdateGroupResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.UPDATE_GROUP_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    this._generalService.eventHandler.next({ name: eventsConst.groupUpdated, payload: action.payload });
                    this._toasty.successToast('Group Updated Successfully');
                    return {
                        type: 'EmptyAction'
                    };
                }
            }));

    @Effect()
    public DeleteGroup$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.DELETE_GROUP).pipe(
            switchMap((action: CustomActions) => this._groupService.DeleteGroup(action.payload)),
            map(response => {
                let activeGrp: IGroupsWithAccounts;
                this.store.select(s => s.groupwithaccounts.groupswithaccounts).pipe(take(1)).subscribe(a => {
                    activeGrp = this.findMyParent(a, response.queryString.groupUniqueName, null);
                });
                response.queryString = { groupUniqueName: response.queryString.groupUniqueName, parentUniqueName: activeGrp.uniqueName };
                return this.deleteGroupResponse(response);
            }));

    @Effect()
    public DeleteGroupResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.DELETE_GROUP_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._generalService.eventHandler.next({ name: eventsConst.groupDeleted, payload: action.payload });
                    this._toasty.successToast(action.payload.body, '');
                    if (action.payload.queryString.parentUniqueName) {
                        this.store.dispatch(this.getGroupDetails(action.payload.queryString.parentUniqueName));
                    }
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public GetGroupUniqueName$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.GET_GROUP_UNIQUENAME).pipe(
            switchMap((action: CustomActions) => this._groupService.GetGrouptDetails(action.payload)),
            map(response => {
                return this.getGroupUniqueNameResponse(response);
            }));
    @Effect()
    public GetGroupUniqueNameResponse$: Observable<Action> = this.action$
        .ofType(GroupWithAccountsAction.GET_GROUP_UNIQUENAME_RESPONSE).pipe(
            map((action: CustomActions) => {
                let data: BaseResponse<GroupResponse, string> = action.payload;
                return {
                    type: 'EmptyAction'
                };
            }));

    constructor(private action$: Actions,
        private _groupService: GroupService,
        private _accountService: AccountService,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _generalActions: GeneralActions,
        private _generalService: GeneralService) {
        //
    }

    public SetActiveGroup(uniqueName: string): CustomActions {
        return {
            type: GroupWithAccountsAction.SET_ACTIVE_GROUP,
            payload: uniqueName
        };
    }

    public ResetActiveGroup(): CustomActions {
        return {
            type: GroupWithAccountsAction.RESET_ACTIVE_GROUP
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

    public resetGroupAndAccountsSearchString(): CustomActions {
        return {
            type: GroupWithAccountsAction.RESET_GROUP_ACCOUNTS_SEARCH_STRING
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

    public getFlattenGroupsAccounts(value?: FlattenGroupsAccountsRequest): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS,
            payload: value
        };
    }

    public getFlattenGroupsAccountsResponse(value: BaseResponse<FlattenGroupsAccountsResponse, string>): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS_RESPONSE,
            payload: value
        };
    }

    public shareGroup(value: ShareGroupRequest, groupUniqueName: string): CustomActions {
        return {
            type: GroupWithAccountsAction.SHARE_GROUP,
            payload: Object.assign({}, {
                body: value
            }, {
                groupUniqueName
            })
        };
    }

    public shareGroupResponse(value: BaseResponse<string, ShareGroupRequest>): CustomActions {
        return {
            type: GroupWithAccountsAction.SHARE_GROUP_RESPONSE,
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

    public hideAddGroupForm(): CustomActions {
        return {
            type: GroupWithAccountsAction.HIDE_ADD_GROUP_FORM
        };
    }

    public showEditGroupForm(): CustomActions {
        return {
            type: GroupWithAccountsAction.SHOW_EDIT_GROUP_FORM
        };
    }

    public hideEditGroupForm(): CustomActions {
        return {
            type: GroupWithAccountsAction.HIDE_EDIT_GROUP_FORM
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

    public deleteGroupResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: GroupWithAccountsAction.DELETE_GROUP_RESPONSE,
            payload: value
        };
    }

    public getGroupUniqueName(value: string): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_GROUP_UNIQUENAME,
            payload: value
        };
    }

    public getGroupUniqueNameResponse(value: BaseResponse<GroupResponse, string>): CustomActions {
        return {
            type: GroupWithAccountsAction.GET_GROUP_UNIQUENAME_RESPONSE,
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
                if (grp.uniqueName === uniqueName) {
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
}
