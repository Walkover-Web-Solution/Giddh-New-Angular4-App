import { map, switchMap } from 'rxjs/operators';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AUDIT_LOGS_ACTIONS } from './audit-logs.const';
import { CustomActions } from '../../store/customActions';
import { CompanyImportExportService } from '../../services/companyImportExportService';
import { COMPANY_IMPORT_EXPORT_ACTIONS } from './company-import-export.const';
import { CompanyImportExportFileTypes } from '../../models/interfaces/companyImportExport.interface';
import { saveAs } from 'file-saver';
import { GeneralService } from '../../services/general.service';

@Injectable()
export class CompanyImportExportActions {
    @Effect() private EXPORT_REQUEST$: Observable<Action> = this.action$
        .ofType(COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_REQUEST).pipe(
            switchMap((action: CustomActions) => {

                if (action.payload.fileType === CompanyImportExportFileTypes.MASTER_EXCEPT_ACCOUNTS) {
                    return this._companyImportExportService.ExportRequest().pipe(
                        map((response: BaseResponse<any, string>) => {
                            if (response.status === 'success') {
                                let res = { body: response.body };
                                let blob = new Blob([JSON.stringify(res)], { type: 'application/json' });
                                saveAs(blob, this._generalService.companyUniqueName + '.json');
                                this._toasty.successToast('data exported successfully');
                            } else {
                                this._toasty.errorToast(response.message);
                            }
                            return this.ExportResponse(response);
                        }));
                } else {
                    return this._companyImportExportService.ExportLedgersRequest(action.payload.from, action.payload.to).pipe(
                        map((response: BaseResponse<any, string>) => {
                            if (response.status === 'success') {
                                let res = { body: response.body };
                                let blob = new Blob([JSON.stringify(res)], { type: 'application/json' });
                                saveAs(blob, this._generalService.companyUniqueName + '.json');
                            } else {
                                this._toasty.errorToast(response.message);
                            }
                            return this.ExportResponse(response);
                        }));
                }
            }));

    @Effect() private IMPORT_REQUEST$: Observable<Action> = this.action$
        .ofType(COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_REQUEST).pipe(
            switchMap((action: CustomActions) => {

                if (action.payload.fileType === CompanyImportExportFileTypes.MASTER_EXCEPT_ACCOUNTS) {
                    return this._companyImportExportService.ImportRequest(action.payload.file).pipe(
                        map((r: BaseResponse<string, string>) => {
                            if (r.status === 'success') {
                                this._toasty.successToast(r.body);
                            } else {
                                this._toasty.errorToast(r.message);
                            }
                            return this.ImportResponse(r);
                        }));
                } else {
                    return this._companyImportExportService.ImportLedgersRequest(action.payload.file).pipe(
                        map((r: BaseResponse<string, string>) => {
                            if (r.status === 'success') {
                                this._toasty.successToast(r.body);
                            } else {
                                this._toasty.errorToast(r.message);
                            }
                            return this.ImportResponse(r);
                        }));
                }
            }));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _companyImportExportService: CompanyImportExportService,
        private _generalService: GeneralService) {
    }

    public ExportRequest(fileType: CompanyImportExportFileTypes, from?: string, to?: string): CustomActions {
        return {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_REQUEST,
            payload: { fileType, from, to }
        };
    }

    public ExportResponse(response: BaseResponse<any, string>): CustomActions {
        return {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_RESPONSE,
            payload: response
        };
    }

    public ImportRequest(fileType: CompanyImportExportFileTypes, file: File): CustomActions {
        return {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_REQUEST,
            payload: { fileType, file }
        };
    }

    public ImportResponse(response: BaseResponse<any, string>): CustomActions {
        return {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_RESPONSE,
            payload: response
        };
    }

    public ResetCompanyImportExportState(): CustomActions {
        return {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.COMPANY_IMPORT_EXPORT_RESET
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response.status === 'error') {
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        }
        return successAction;
    }
}
