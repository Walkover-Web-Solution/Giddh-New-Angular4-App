import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ToasterService } from '../../services/toaster.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { CustomActions } from '../../store/customActions';
import { IMPORT_EXCEL } from './import-excel.const';
import { ImportExcelProcessResponseData, ImportExcelRequestData, ImportExcelResponseData, ImportExcelStatusPaginatedResponse } from '../../models/api-models/import-excel';
import { ImportExcelService } from '../../services/import-excel.service';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';

@Injectable()
export class ImportExcelActions {

    @Effect()
    public uploadFile$: Observable<Action> = this.action$
        .ofType(IMPORT_EXCEL.UPLOAD_FILE_REQUEST).pipe(
            switchMap((action: CustomActions) => {
                return this._importExcelService.uploadFile(action.payload.entity, action.payload.file);
            }), map((res) => {
                if (res.status === 'error') {
                    this._toasty.errorToast(res.message);
                }
                return this.uploadFileResponse(res);
                // return this.validateResponse(res, this.uploadFileResponse(res.body), true, this.uploadFileResponse(res.body));
            }));
    @Effect()
    public processImport$: Observable<Action> = this.action$
        .ofType(IMPORT_EXCEL.PROCESS_IMPORT_REQUEST).pipe(
            switchMap((action: CustomActions) => {
                return this._importExcelService.processImport(action.payload.entity, action.payload.data);
            }), map((res) => {
                return this.validateResponse(res, this.processImportResponse(res.body), true, this.processImportResponse(null));
            }));

    @Effect()
    public getImportStatus$: Observable<Action> = this.action$
        .ofType(IMPORT_EXCEL.IMPORT_STATUS_REQUEST).pipe(
            switchMap((action: CustomActions) => {
                return this._importExcelService.importStatus(action.payload);
            }), map((res) => {
                if (res.status === 'error') {
                    this._toasty.errorToast(res.message);
                }
                return this.ImportStatusResponse(res);
            }));

    constructor(private action$: Actions, private _toasty: ToasterService, private _importExcelService: ImportExcelService) {
        //
    }

    public uploadFileRequest(entity: string, file: File): CustomActions {
        return {
            type: IMPORT_EXCEL.UPLOAD_FILE_REQUEST,
            payload: { entity, file }
        };
    }

    public uploadFileResponse(response: BaseResponse<ImportExcelResponseData, string>): CustomActions {
        return {
            type: IMPORT_EXCEL.UPLOAD_FILE_RESPONSE,
            payload: response
        };
    }

    public processImportRequest(entity: string, data: ImportExcelRequestData): CustomActions {
        return {
            type: IMPORT_EXCEL.PROCESS_IMPORT_REQUEST,
            payload: { entity, data }
        };
    }

    public processImportResponse(response: ImportExcelProcessResponseData): CustomActions {
        return {
            type: IMPORT_EXCEL.PROCESS_IMPORT_RESPONSE,
            payload: response
        };
    }

    public ImportStatusRequest(paginatedRequest: CommonPaginatedRequest): CustomActions {
        return {
            type: IMPORT_EXCEL.IMPORT_STATUS_REQUEST,
            payload: paginatedRequest
        };
    }

    public ImportStatusResponse(response: BaseResponse<ImportExcelStatusPaginatedResponse, string>): CustomActions {
        return {
            type: IMPORT_EXCEL.IMPORT_STATUS_RESPONSE,
            payload: response
        };
    }

    public resetImportExcelState(): CustomActions {
        return {
            type: IMPORT_EXCEL.RESET_IMPORT_EXCEL_STATE
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>,
        successAction: CustomActions,
        showToast: boolean = false,
        errorAction: CustomActions = { type: 'EmptyAction' },
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
