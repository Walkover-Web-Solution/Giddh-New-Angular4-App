import { GroupResponse, FlattenGroupsAccountsRequest, FlattenGroupsAccountsResponse } from './../../models/api-models/Group';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AppState } from '../../store/roots';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { GroupService } from '../group.service';
import { ToasterService } from '../toaster.service';

@Injectable()
export class GroupWithAccountsAction {
  public static SET_ACTIVE_GROUP = 'SetActiveGroup';
  public static GET_GROUP_WITH_ACCOUNTS = 'GroupWithAccounts';
  public static GET_GROUP_WITH_ACCOUNTS_RESPONSE = 'GroupWithAccountsResponse';
  public static SET_GROUP_ACCOUNTS_SEARCH_STRING = 'GroupAccountsSearchString';
  public static GET_GROUP_DETAILS = 'GroupDetails';
  public static GET_GROUP_DETAILS_RESPONSE = 'GroupDetailsResponse';
  public static GET_FLATTEN_GROUPS_ACCOUNTS = 'GetFlattenGroupsAccounts';
  public static GET_FLATTEN_GROUPS_ACCOUNTS_RESPONSE = 'GetFlattenGroupsAccountsResponse';

  @Effect()
  public SetActiveGroup$: Observable<Action> = this.action$
  .ofType(GroupWithAccountsAction.SET_ACTIVE_GROUP)
    .debug('')
    .map(action => {
      return { type: '' };
  });

  @Effect()
  public GetGroupsWithAccount$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS)
    .debug('')
    .switchMap(action => this._groupService.GetGroupsWithAccounts(action.payload))
    .map(response => {
      return this.getGroupWithAccountsResponse(response);
  });

  @Effect()
  public GetGroupsWithAccountResponse$: Observable<Action> = this.action$
  .ofType(GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS_RESPONSE)
  .debug('')
  .map(action => {
    if (action.payload.status === 'error') {
      this._toasty.errorToast(action.payload.message, action.payload.code);
    }
    return {type: ''};
  });

  @Effect()
  public SetAccountsSearchString$: Observable<Action> = this.action$
  .ofType(GroupWithAccountsAction.SET_GROUP_ACCOUNTS_SEARCH_STRING)
  .debug('')
  .map(action => {
    return { type: '' };
  });

  @Effect()
  public GetGroupsDetails$: Observable<Action> = this.action$
    .ofType(GroupWithAccountsAction.GET_GROUP_DETAILS)
    .debug('')
    .switchMap(action => this._groupService.GetGroupDetails(action.payload))
    .map(response => {
      return this.getGroupDetailsResponse(response);
  });

  @Effect()
  public GetGroupDetailsResponse$: Observable<Action> = this.action$
  .ofType(GroupWithAccountsAction.GET_GROUP_DETAILS_RESPONSE)
  .debug('')
  .map(action => {
    if (action.payload.status === 'error') {
      this._toasty.errorToast(action.payload.message, action.payload.code);
    }
    return {type: ''};
  });

  @Effect()
  public GetFlattenGroupsAccounts$: Observable<Action> = this.action$
  .ofType(GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS)
    .debug('')
    .switchMap(action => this._groupService.GetFlattenGroupsAccounts(action.payload))
    .map(response => {
      return this.getGroupDetailsResponse(response);
  });

  @Effect()
  public GetFlattenGroupsAccountsResponse$: Observable<Action> = this.action$
  .ofType(GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS_RESPONSE)
  .debug('')
  .map(action => {
    if (action.payload.status === 'error') {
      this._toasty.errorToast(action.payload.message, action.payload.code);
    }
    return {type: ''};
  });

  constructor(private action$: Actions, private _groupService: GroupService, private _toasty: ToasterService) {
    //
  }
  public SetActiveGroup(uniqueName: string): Action {
    return {
      type: GroupWithAccountsAction.SET_ACTIVE_GROUP,
      payload: uniqueName
    };
  }

  public getGroupWithAccounts(value?: string): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS,
      payload: value
    };
  }

  public getGroupWithAccountsResponse(value: BaseResponse<GroupsWithAccountsResponse[]>): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS_RESPONSE,
      payload: value
    };
  }

  public setAccountsSearchString(value: string): Action {
    return {
      type : GroupWithAccountsAction.SET_GROUP_ACCOUNTS_SEARCH_STRING,
      payload: value
    };
  }

  public getGroupDetails(value?: string): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_DETAILS,
      payload: value
    };
  }

  public getGroupDetailsResponse(value: BaseResponse<GroupResponse>): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_DETAILS_RESPONSE,
      payload: value
    };
  }

  public getFlattenGroupsAccounts(value?: FlattenGroupsAccountsRequest): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_DETAILS,
      payload: value
    };
  }

  public getFlattenGroupsAccountsResponse(value: BaseResponse<FlattenGroupsAccountsResponse>): Action {
    return {
      type: GroupWithAccountsAction.GET_GROUP_DETAILS_RESPONSE,
      payload: value
    };
  }
}
