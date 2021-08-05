import { map, switchMap } from 'rxjs/operators';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ToasterService } from '../../services/toaster.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomActions } from '../../store/customActions';
import { CompanyImportExportService } from '../../services/companyImportExportService';
import { COMPANY_IMPORT_EXPORT_ACTIONS } from './company-import-export.const';
import { CompanyImportExportFileTypes } from '../../models/interfaces/companyImportExport.interface';
import { saveAs } from 'file-saver';
import { GeneralService } from '../../services/general.service';
import { LocaleService } from '../../services/locale.service';

@Injectable()
export class CompanyImportExportActions {
    public EXPORT_REQUEST$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_REQUEST),
            switchMap((action: CustomActions) => {

                if (action.payload.fileType === CompanyImportExportFileTypes.MASTER_EXCEPT_ACCOUNTS) {
                    return this._companyImportExportService.ExportRequest(action.payload.branchUniqueName).pipe(
                        map((response: BaseResponse<any, string>) => {
                            if (response.status === 'success') {
                                let res = { body: response.body };
                                let blob = new Blob([JSON.stringify(res)], { type: 'application/json' });
                                saveAs(blob, `${action.payload.entityName}_Master_Except_Accounts_${action.payload.from}_${action.payload.to}_${this._generalService.companyUniqueName}` + '.json');
                                this._toasty.successToast(this.localeService.translate("app_messages.data_exported"));
                            } else {
                                this._toasty.errorToast(response.message);
                            }
                            return this.ExportResponse(response);
                        }));
                } else {
                    return this._companyImportExportService.ExportLedgersRequest(action.payload.from, action.payload.to, action.payload.branchUniqueName).pipe(
                        map((response: BaseResponse<any, string>) => {
                            if (response.status === 'success' && response.body) {
                                if (response.body.type === "message") {
                                    this._toasty.successToast(response.body.file);
                                } else {
                                    let res = { body: response.body.file };
                                    let blob = new Blob([JSON.stringify(res)], { type: 'application/json' });
                                    saveAs(blob, `${action.payload.entityName}_Accounting_Entries_${action.payload.from}_${action.payload.to}_${this._generalService.companyUniqueName}` + '.json');
                                    this._toasty.successToast(this.localeService.translate("app_messages.data_exported"));
                                }
                            } else {
                                this._toasty.errorToast(response.message);
                            }
                            return this.ExportResponse(response);
                        }));
                }
            })));

    public IMPORT_REQUEST$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_REQUEST),
            switchMap((action: CustomActions) => {

                if (action.payload.fileType === CompanyImportExportFileTypes.MASTER_EXCEPT_ACCOUNTS) {
                    return this._companyImportExportService.ImportRequest(action.payload.file, action.payload.branchUniqueName).pipe(
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
            })));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private localeService: LocaleService,
        private _companyImportExportService: CompanyImportExportService,
        private _generalService: GeneralService) {
    }

    public ExportRequest(fileType: CompanyImportExportFileTypes, from?: string, to?: string, branchUniqueName?: string, entityName?: string): CustomActions {
        return {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_REQUEST,
            payload: { fileType, from, to, branchUniqueName, entityName }
        };
    }

    public ExportResponse(response: BaseResponse<any, string>): CustomActions {
        return {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_RESPONSE,
            payload: response
        };
    }

    public ImportRequest(fileType: CompanyImportExportFileTypes, file: File, branchUniqueName: string): CustomActions {
        return {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_REQUEST,
            payload: { fileType, file, branchUniqueName }
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
}
