import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { GroupService } from '../../services/group.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { Action } from '@ngrx/store';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { GENERAL_ACTIONS } from './general.const';
import { Observable } from 'rxjs';
import { FlattenAccountsResponse } from '../../models/api-models/Account';
import { AccountService } from '../../services/account.service';
import { States } from '../../models/api-models/Company';
import { CompanyService } from '../../services/companyService.service';
import { CustomActions } from '../../store/customActions';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { IPaginatedResponse } from '../../models/interfaces/paginatedResponse.interface';
import { IUlist } from '../../models/interfaces/ulist.interface';

@Injectable()
export class GeneralActions {
  @Effect()
  public GetGroupsWithAccount$: Observable<Action> = this.action$
    .ofType(GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS).pipe(
      switchMap((action: CustomActions) =>
        this._groupService.GetGroupsWithAccounts(action.payload)
      ),
      map(response => {
        return this.getGroupWithAccountsResponse(response);
      }));

  @Effect()
  public GetFlattenGroups$: Observable<Action> = this.action$
    .ofType(GENERAL_ACTIONS.FLATTEN_GROUPS_REQ).pipe(
      switchMap((action: CustomActions) =>
        this._groupService.GetFlattenGroups(action.payload)
      ),
      map(response => {
        return this.getFlattenGroupsRes(response);
      }));

  @Effect()
  public GetFlattenAccounts$: Observable<Action> = this.action$
    .ofType(GENERAL_ACTIONS.GENERAL_GET_FLATTEN_ACCOUNTS).pipe(
      switchMap((action: CustomActions) =>
        this._accountService.GetFlattenAccounts(action.payload)
      ),
      map(response => {
        return this.getFlattenAccountResponse(response);
      }));

  @Effect()
  public getAllState$: Observable<Action> = this.action$
    .ofType(GENERAL_ACTIONS.GENERAL_GET_ALL_STATES).pipe(
      switchMap(() => this._companyService.getAllStates()),
      map(resp => this.getAllStateResponse(resp)));

  constructor(private action$: Actions, private _groupService: GroupService, private _accountService: AccountService,
              private _companyService: CompanyService) {
    //
  }

  public getGroupWithAccounts(value?: string): CustomActions {
    return {
      type: GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS,
      payload: value
    };
  }

  public getGroupWithAccountsResponse(value: BaseResponse<GroupsWithAccountsResponse[], string>): CustomActions {
    return {
      type: GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS_RESPONSE,
      payload: value
    };
  }

  public getFlattenAccount(value?: string): CustomActions {
    return {
      type: GENERAL_ACTIONS.GENERAL_GET_FLATTEN_ACCOUNTS,
      payload: value
    };
  }

  public getFlattenAccountResponse(value: BaseResponse<FlattenAccountsResponse, string>): CustomActions {
    return {
      type: GENERAL_ACTIONS.GENERAL_GET_FLATTEN_ACCOUNTS_RESPONSE,
      payload: value
    };
  }

  public getAllState(): CustomActions {
    return {
      type: GENERAL_ACTIONS.GENERAL_GET_ALL_STATES,
    };
  }

  public getAllStateResponse(value: BaseResponse<States[], string>): CustomActions {
    return {
      type: GENERAL_ACTIONS.GENERAL_GET_ALL_STATES_RESPONSE,
      payload: value
    };
  }

  public addAndManageClosed(): CustomActions {
    return {
      type: GENERAL_ACTIONS.CLOSE_ADD_AND_MANAGE
    };
  }

  public getFlattenGroupsReq(value?: any): CustomActions {
    return {
      type: GENERAL_ACTIONS.FLATTEN_GROUPS_REQ,
      payload: value
    };
  }

  public getFlattenGroupsRes(model: BaseResponse<IPaginatedResponse, any>): CustomActions {
    return {
      type: GENERAL_ACTIONS.FLATTEN_GROUPS_RES,
      payload: model
    };
  }

  public setCombinedList(model: IUlist[]): CustomActions {
    return {
      type: GENERAL_ACTIONS.SET_COMBINED_LIST,
      payload: model
    };
  }
  public resetCombinedList(): CustomActions {
    return {
      type: GENERAL_ACTIONS.RESET_COMBINED_LIST
    };
  }

  public setSmartList(model: IUlist[]): CustomActions {
    return {
      type: GENERAL_ACTIONS.SET_SMART_LIST,
      payload: model
    };
  }
  public resetSmartList(): CustomActions {
    return {
      type: GENERAL_ACTIONS.RESET_SMART_LIST
    };
  }
}
