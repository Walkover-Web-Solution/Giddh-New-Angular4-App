import {
  AccountResponse,
  AccountRequest
} from './../../models/api-models/Account';
import {
  AppState
} from './../../store/roots';
import {
  BaseResponse
} from './../../models/api-models/BaseResponse';
import {
  GroupResponse,
  FlattenGroupsAccountsRequest,
  FlattenGroupsAccountsResponse,
  GroupCreateRequest,
  ShareGroupRequest,
  GroupSharedWithResponse,
  MoveGroupRequest,
  MoveGroupResponse,
  GroupsTaxHierarchyResponse,
  GroupUpateRequest
} from './../../models/api-models/Group';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { GroupService } from '../group.service';
import { ToasterService } from '../toaster.service';
import { AccountService } from '../account.service';
import { ApplyTaxRequest } from '../../models/api-models/ApplyTax';

@Injectable()
export class GroupWithAccountsAction {
  public static SET_ACTIVE_GROUP = 'SetActiveGroup';
  public static RESET_ACTIVE_GROUP = 'ResetActiveGroup';
  public static GET_GROUP_WITH_ACCOUNTS = 'GroupWithAccounts';
  public static GET_GROUP_WITH_ACCOUNTS_RESPONSE = 'GroupWithAccountsResponse';
  public static SET_GROUP_ACCOUNTS_SEARCH_STRING = 'GroupAccountsSearchString';
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

  public static SHOW_ADD_ACCOUNT_FORM = 'GroupShowAddAccountForm';
  public static HIDE_ADD_ACCOUNT_FORM = 'GroupHideAddAccountForm';
  public static RESET_GROUPS_STATE = 'GroupResetState';
  public static APPLY_GROUP_TAX = 'ApplyGroupTax';
  public static APPLY_GROUP_TAX_RESPONSE = 'ApplyGroupTaxResponse';

  public static DELETE_GROUP = 'GroupDelete';
  public static DELETE_GROUP_RESPONSE = 'GroupDeleteResponse';

  @Effect()
  public ApplyGroupTax$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.APPLY_GROUP_TAX)
    .switchMap(action => this._accountService.ApplyTax(action.payload))
    .map(response => {
      return this.applyGroupTaxResponse(response);
    });

  @Effect()
  public ApplyGroupTaxResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.APPLY_GROUP_TAX_RESPONSE)
    .map(action => {
      let data: BaseResponse<string, ApplyTaxRequest> = action.payload;
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return { type: '' };
      }
      this._toasty.successToast(action.payload.body, action.payload.status);
      let grouName = null;
      this.store.take(1).subscribe((s) => {
        if (s.groupwithaccounts.activeGroup) {
          grouName = s.groupwithaccounts.activeGroup.uniqueName;
        }
      });
      return this.getGroupDetails(grouName);
    });

  @Effect()
  public SetActiveGroup$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.SET_ACTIVE_GROUP)
    .map(action => {
      return {
        type: ''
      };
    });

  @Effect()
  public GetGroupsWithAccount$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS)
    .switchMap(action =>
      this._groupService.GetGroupsWithAccounts(action.payload)
    )
    .map(response => {
      return this.getGroupWithAccountsResponse(response);
    });

  @Effect()
  public GetGroupsWithAccountResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return {
        type: ''
      };
    });

  @Effect()
  public SetAccountsSearchString$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.SET_GROUP_ACCOUNTS_SEARCH_STRING)
    .map(action => {
      return {
        type: ''
      };
    });

  @Effect()
  public GetGroupsDetails$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.GET_GROUP_DETAILS)
    .switchMap(action => this._groupService.GetGroupDetails(action.payload))
    .map(response => {
      return this.getGroupDetailsResponse(response);
    });

  @Effect()
  public GetGroupDetailsResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.GET_GROUP_DETAILS_RESPONSE)
    .map(action => {
      let data: BaseResponse<GroupResponse, string> = action.payload;
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return { type: '' };
      }
      return this.sharedGroupWith(data.body.uniqueName);
    });

  @Effect()
  public CreateGroup$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.CREATE_GROUP)
    .switchMap(action => this._groupService.CreateGroup(action.payload))
    .map(response => {
      return this.createGroupResponse(response);
    });

  @Effect()
  public CreateGroupResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.CREATE_GROUP_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return {
        type: ''
      };
    });

  @Effect()
  public GetFlattenGroupsAccounts$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS)
    .switchMap(action =>
      this._groupService.GetFlattenGroupsAccounts(action.payload)
    )
    .map(response => {
      return this.getFlattenGroupsAccountsResponse(response);
    });

  @Effect()
  public GetFlattenGroupsAccountsResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return {
        type: ''
      };
    });

  @Effect()
  public shareGroup$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.SHARE_GROUP)
    .switchMap(action =>
      this._groupService.ShareGroup(
        action.payload.body,
        action.payload.groupUniqueName
      )
    )
    .map(response => {
      return this.shareGroupResponse(response);
    });

  @Effect()
  public shareGroupResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.SHARE_GROUP_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast(action.payload.body, '');
        let groupUniqueName = '';
        this.store.take(1).subscribe(s => {
          groupUniqueName = s.groupwithaccounts.activeGroup.uniqueName;
        });

        return this.sharedGroupWith(groupUniqueName);
      }
      return {
        type: ''
      };
    });

  @Effect()
  public unShareGroup$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.UNSHARE_GROUP)
    .switchMap(action =>
      this._groupService.UnShareGroup(
        action.payload.user,
        action.payload.groupUniqueName
      )
    )
    .map(response => {
      return this.unShareGroupResponse(response);
    });

  @Effect()
  public unShareGroupResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.UNSHARE_GROUP_RESPONSE)
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
  public sharedGroup$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.SHARED_GROUP_WITH)
    .switchMap(action => this._groupService.ShareWithGroup(action.payload))
    .map(response => {
      return this.sharedGroupWithResponse(response);
    });

  @Effect()
  public sharedGroupResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.SHARED_GROUP_WITH_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return {
        type: ''
      };
    });

  @Effect()
  public moveGroup$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.MOVE_GROUP)
    .switchMap(action =>
      this._groupService.MoveGroup(
        action.payload.body,
        action.payload.groupUniqueName
      )
    )
    .map(response => {
      return this.moveGroupResponse(response);
    });

  @Effect()
  public moveGroupResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.MOVE_GROUP_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast('Group moved successfully', '');
        return this.getGroupWithAccounts('');
      }
      return {
        type: ''
      };
    });

  @Effect()
  public getGroupTaxHierarchy$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY)
    .switchMap(action => this._groupService.GetTaxHierarchy(action.payload))
    .map(response => {
      return this.getTaxHierarchyResponse(response);
    });

  @Effect()
  public getGroupTaxHierarchyResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return {
        type: ''
      };
    });

  @Effect()
  public UpdateGroup$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.UPDATE_GROUP)
    .switchMap(action => this._groupService.UpdateGroup(action.payload.data, action.payload.groupUniqueName))
    .map(response => {
      return this.updateGroupResponse(response);
    });
  @Effect()
  public UpdateGroupResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.UPDATE_GROUP_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return {
          type: ''
        };
      } else {
        this._toasty.successToast('Group Updated Successfully');
      }
      return this.getGroupWithAccounts('');
    });

  @Effect()
  public DeleteGroup$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.DELETE_GROUP)
    .switchMap(action => this._groupService.DeleteGroup(action.payload))
    .map(response => {
      return this.deleteGroupResponse(response);
    });

  @Effect()
  public DeleteGroupResponse$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.DELETE_GROUP_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
        return {
          type: ''
        };
      } else {
        this._toasty.successToast(action.payload.body, '');
        return this.getGroupWithAccounts('');
      }
    });
  constructor(
    private action$: Actions,
    private _groupService: GroupService,
    private _accountService: AccountService,
    private _toasty: ToasterService,
    private store: Store<AppState>
  ) {
    //
  }
  public SetActiveGroup(uniqueName: string): Action {
    return {
      type: GroupWithAccountsAction.SET_ACTIVE_GROUP,
      payload: uniqueName
    };
  }

  public ResetActiveGroup(): Action {
    return {
      type: GroupWithAccountsAction.RESET_ACTIVE_GROUP,
    };
  }

  public getGroupWithAccounts(value?: string): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS,
      payload: value
    };
  }

  public getGroupWithAccountsResponse(value: BaseResponse<GroupsWithAccountsResponse[], string>): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS_RESPONSE,
      payload: value
    };
  }

  public setAccountsSearchString(value: string): Action {
    return {
      type: GroupWithAccountsAction.SET_GROUP_ACCOUNTS_SEARCH_STRING,
      payload: value
    };
  }

  public getGroupDetails(value: string): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_DETAILS,
      payload: value
    };
  }

  public getGroupDetailsResponse(value: BaseResponse<GroupResponse, string>): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_DETAILS_RESPONSE,
      payload: value
    };
  }

  public createGroup(value: GroupCreateRequest): Action {
    return {
      type: GroupWithAccountsAction.CREATE_GROUP,
      payload: value
    };
  }
  public createGroupResponse(value: BaseResponse<GroupResponse, GroupCreateRequest>): Action {
    return {
      type: GroupWithAccountsAction.CREATE_GROUP_RESPONSE,
      payload: value
    };
  }
  public getFlattenGroupsAccounts(
    value?: FlattenGroupsAccountsRequest
  ): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_DETAILS,
      payload: value
    };
  }
  public getFlattenGroupsAccountsResponse(value: BaseResponse<FlattenGroupsAccountsResponse, string>): Action {
    return {
      type: GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS_RESPONSE,
      payload: value
    };
  }

  public shareGroup(value: ShareGroupRequest, groupUniqueName: string): Action {
    return {
      type: GroupWithAccountsAction.SHARE_GROUP,
      payload: Object.assign({}, {
        body: value
      }, {
          groupUniqueName
        })
    };
  }
  public shareGroupResponse(value: BaseResponse<string, ShareGroupRequest>): Action {
    return {
      type: GroupWithAccountsAction.SHARE_GROUP_RESPONSE,
      payload: value
    };
  }

  public unShareGroup(value: string, groupUniqueName: string): Action {
    return {
      type: GroupWithAccountsAction.UNSHARE_GROUP,
      payload: Object.assign({}, {
        user: value
      }, {
          groupUniqueName
        })
    };
  }
  public unShareGroupResponse(value: BaseResponse<string, string>): Action {
    return {
      type: GroupWithAccountsAction.UNSHARE_GROUP_RESPONSE,
      payload: value
    };
  }

  public sharedGroupWith(groupUniqueName: string): Action {
    return {
      type: GroupWithAccountsAction.SHARED_GROUP_WITH,
      payload: groupUniqueName
    };
  }
  public sharedGroupWithResponse(value: BaseResponse<GroupSharedWithResponse[], string>): Action {
    return {
      type: GroupWithAccountsAction.SHARED_GROUP_WITH_RESPONSE,
      payload: value
    };
  }

  public moveGroup(value: MoveGroupRequest, groupUniqueName: string): Action {
    return {
      type: GroupWithAccountsAction.MOVE_GROUP,
      payload: Object.assign({}, {
        body: value
      }, {
          groupUniqueName
        })
    };
  }
  public moveGroupResponse(value: BaseResponse<MoveGroupResponse, MoveGroupRequest>): Action {
    return {
      type: GroupWithAccountsAction.MOVE_GROUP_RESPONSE,
      payload: value
    };
  }

  public getTaxHierarchy(value: string): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY,
      payload: value
    };
  }
  public getTaxHierarchyResponse(value: BaseResponse<GroupsTaxHierarchyResponse, string>): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY_RESPONSE,
      payload: value
    };
  }
  public resetAddAndMangePopup(): Action {
    return {
      type: GroupWithAccountsAction.RESET_GROUPS_STATE
    };
  }

  public showAddAccountForm(): Action {
    return {
      type: GroupWithAccountsAction.SHOW_ADD_ACCOUNT_FORM
    };
  }

  public hideAddAccountForm(): Action {
    return {
      type: GroupWithAccountsAction.HIDE_ADD_ACCOUNT_FORM
    };
  }

  public updateGroup(value: GroupUpateRequest, groupUniqueName: string): Action {
    return {
      type: GroupWithAccountsAction.UPDATE_GROUP,
      payload: Object.assign({}, { groupUniqueName }, { data: value })
    };
  }
  public updateGroupResponse(value: BaseResponse<GroupResponse, GroupUpateRequest>): Action {
    return {
      type: GroupWithAccountsAction.UPDATE_GROUP_RESPONSE,
      payload: value
    };
  }

  public applyGroupTax(value: ApplyTaxRequest): Action {
    return {
      type: GroupWithAccountsAction.APPLY_GROUP_TAX,
      payload: value
    };
  }
  public applyGroupTaxResponse(value: BaseResponse<string, ApplyTaxRequest>): Action {
    return {
      type: GroupWithAccountsAction.APPLY_GROUP_TAX_RESPONSE,
      payload: value
    };
  }

  public deleteGroup(value: string): Action {
    return {
      type: GroupWithAccountsAction.DELETE_GROUP,
      payload: value
    };
  }
  public deleteGroupResponse(value: BaseResponse<string, string>): Action {
    return {
      type: GroupWithAccountsAction.DELETE_GROUP_RESPONSE,
      payload: value
    };
  }
}
