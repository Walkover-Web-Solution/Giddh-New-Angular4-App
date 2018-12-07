import { Observable, ReplaySubject, zip as observableZip } from 'rxjs';

import { map, switchMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Router } from '@angular/router';
import { AppState } from '../../store/roots';
import { CustomActions } from '../../store/customActions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { TallyService } from '../../services/tally.service';

@Injectable()
export class TallyActions {
  public static GetCurrentTallyLogs = 'GetCurrentTallyLogs';
  public static GetCurrentTallyLogsResponse = 'GetCurrentTallyLogsResponse';
  public static GetOldTallyLogs = 'GetOldTallyLogs';
  public static GetOldTallyLogsResponse = 'GetOldTallyLogsResponse';
  public static DownloadFile = 'DownloadFile';
  public static DownloadFileResponse = 'DownloadFileResponse';

  @Effect()
  public TallyActions: Observable<Action> = this.actions$
    .ofType(TallyActions.GetCurrentTallyLogs).pipe(
      switchMap((action: CustomActions) => this.tallyService.GetCurrentTallyLogs(action.payload)),
      map(response => this.GetCurrentTallyLogsResponse(response)));
  @Effect()
  public GetOldTallyLogsAction: Observable<Action> = this.actions$
    .ofType(TallyActions.GetOldTallyLogs).pipe(
      switchMap((action: CustomActions) => this.tallyService.GetOldTallyLogs(action.payload)),
      map(response => this.GetOldTallyLogsResponse(response)));
  @Effect()
  public DownloadFileAction: Observable<Action> = this.actions$
    .ofType(TallyActions.DownloadFile).pipe(
      switchMap((action: CustomActions) => this.tallyService.DownloadFile(action.payload)),
      map(response => this.DownloadFileResponse(response)));

  constructor(
    public _router: Router,
    private actions$: Actions,
    private tallyService: TallyService) {
  }

  public GetCurrentTallyLogs(companyUniqueName): CustomActions {
    return {
      type: TallyActions.GetCurrentTallyLogs,
      payload: companyUniqueName
    };
  }
  public GetCurrentTallyLogsResponse(resp: BaseResponse<any, any>): CustomActions {
    return {
      type: TallyActions.GetCurrentTallyLogsResponse,
      payload: resp
    };
  }
  public GetOldTallyLogs(companyUniqueName, from, to): CustomActions {
    return {
      type: TallyActions.GetOldTallyLogs,
      payload: {companyUniqueName, from, to}
    };
  }
  public GetOldTallyLogsResponse(resp: BaseResponse<any, any>): CustomActions {
    return {
      type: TallyActions.GetOldTallyLogsResponse,
      payload: resp
    };
  }
  public DownloadFile(fileName, companyUniqueName): CustomActions {
    return {
      type: TallyActions.DownloadFile,
      payload: {companyUniqueName, fileName}
    };
  }
  public DownloadFileResponse(resp: BaseResponse<any, any>): CustomActions {
    return {
      type: TallyActions.DownloadFileResponse,
      payload: resp
    };
  }
}
