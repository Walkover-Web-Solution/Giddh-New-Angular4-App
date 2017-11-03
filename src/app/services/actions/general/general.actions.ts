import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { GroupService } from '../../group.service';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Action } from '@ngrx/store';
import { GroupsWithAccountsResponse } from '../../../models/api-models/GroupsWithAccounts';
import { GENERAL_ACTIONS } from './general.const';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GeneralActions {
  @Effect()
  public GetGroupsWithAccount$: Observable<Action> = this.action$
    .ofType(GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS)
    .switchMap(action =>
      this._groupService.GetGroupsWithAccounts(action.payload)
    )
    .map(response => {
      return this.getGroupWithAccountsResponse(response);
    });

  constructor(private action$: Actions, private _groupService: GroupService) {
    //
  }

  public getGroupWithAccounts(value?: string): Action {
    return {
      type: GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS,
      payload: value
    };
  }

  public getGroupWithAccountsResponse(value: BaseResponse<GroupsWithAccountsResponse[], string>): Action {
    return {
      type: GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS_RESPONSE,
      payload: value
    };
  }
}
