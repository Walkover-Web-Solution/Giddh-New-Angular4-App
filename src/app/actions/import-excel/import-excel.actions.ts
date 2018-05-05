import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { API_TO_CALL, CHART_CALLED_FROM, HOME } from './home.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ToasterService } from '../../services/toaster.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { CustomActions } from '../../store/customActions';
import { IMPORT_EXCEL } from './import-excel.const';
import { ImportExcelData } from '../../models/api-models/import-excel';
import { ImportExcelService } from '../../services/import-excel.service';

@Injectable()
export class ImportExcelActions {

  @Effect()
  public uploadFile$: Observable<Action> = this.action$
    .ofType(IMPORT_EXCEL.UPLOAD_FILE_REQUEST)
    .switchMap((action: CustomActions) => {
      return this._importExcelService.uploadFile(action.payload.entity, action.payload.file);
    }).map((res) => {
      return this.validateResponse(res, this.uploadFileResponse(res.response));
    });
  @Effect()
  public processImport$: Observable<Action> = this.action$
    .ofType(IMPORT_EXCEL.PROCESS_IMPORT_REQUEST)
    .switchMap((action: CustomActions) => {
      return this._importExcelService.processImport(action.payload.entity, action.payload.data);
    }).map((res) => {
      return this.validateResponse(res, this.processImportResponse(res.response));
    });

  constructor(private action$: Actions, private _toasty: ToasterService, private _importExcelService: ImportExcelService) {
    //
  }

  public uploadFileRequest(entity: string, file: File): CustomActions {
    return {
      type: IMPORT_EXCEL.UPLOAD_FILE_REQUEST,
      payload: {entity, file}
    };
  }

  public uploadFileResponse(response: ImportExcelData): CustomActions {
    return {
      type: IMPORT_EXCEL.UPLOAD_FILE_RESPONSE,
      payload: response
    };
  }

  public processImportRequest(entity: string, data: ImportExcelData): CustomActions {
    return {
      type: IMPORT_EXCEL.PROCESS_IMPORT_REQUEST,
      payload: {entity, data}
    };
  }

  public processImportResponse(response: ImportExcelData): CustomActions {
    return {
      type: IMPORT_EXCEL.PROCESS_IMPORT_RESPONSE,
      payload: response
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>,
                                                successAction: CustomActions,
                                                showToast: boolean = false,
                                                errorAction: CustomActions = {type: 'EmptyAction'},
                                                message?: string): CustomActions {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    } else {
      if (showToast && typeof response.body === 'string') {
        this._toasty.successToast(response.body);
      } else if (message) {
        this._toasty.successToast(message);
      }
    }
    return successAction;
  }
}
