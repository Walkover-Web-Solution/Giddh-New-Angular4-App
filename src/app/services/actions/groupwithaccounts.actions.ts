import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AppState } from '../../store/roots';

@Injectable()
export class GroupWithAccountsAction {
  public static SET_ACTIVE_GROUP = 'SetActiveGroup';

  @Effect()
  public SetActiveGroup$: Observable<Action> = this.action$
  .ofType(GroupWithAccountsAction.SET_ACTIVE_GROUP)
    .debug('')
    .map(action => {
      return { type: '' };
    });

  constructor(private action$: Actions) {
    //
  }
  public SetActiveGroup(uniqueName: string): Action {
    return {
      type: GroupWithAccountsAction.SET_ACTIVE_GROUP,
      payload: uniqueName
    };
  }
}
