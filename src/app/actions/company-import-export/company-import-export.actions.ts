import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AUDIT_LOGS_ACTIONS } from './audit-logs.const';
import { CustomActions } from '../../store/customActions';
import { CompanyImportExportService } from '../../services/companyImportExportService';
import { COMPANY_IMPORT_EXPORT_ACTIONS } from './company-import-export.const';
import { CompanyImportExportFileTypes } from '../../models/interfaces/companyImportExport.interface';

@Injectable()
export class AuditLogsActions {
  @Effect() private EXPORT_REQUEST$: Observable<Action> = this.action$
    .ofType(COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_REQUEST)
    .switchMap((action: CustomActions) => {

      if (action.payload.fileType === CompanyImportExportFileTypes.MASTER_EXCEPT_ACCOUNTS) {
        return this._companyImportExportService.ExportRequest()
          .map((r) => this.validateResponse<string, string>(r, {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_RESPONSE,
            payload: r
          }, true, {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_RESPONSE,
            payload: r
          }));
      } else {
        return this._companyImportExportService.ExportLedgersRequest(action.payload.from, action.payload.to)
          .map((r) => this.validateResponse<string, string>(r, {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_RESPONSE,
            payload: r
          }, true, {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_RESPONSE,
            payload: r
          }));
      }
    });

  @Effect() private IMPORT_REQUEST$: Observable<Action> = this.action$
    .ofType(COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_REQUEST)
    .switchMap((action: CustomActions) => {

      if (action.payload.fileType === CompanyImportExportFileTypes.MASTER_EXCEPT_ACCOUNTS) {
        return this._companyImportExportService.ImportRequest()
          .map((r) => this.validateResponse<string, string>(r, {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_RESPONSE,
            payload: r
          }, true, {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_RESPONSE,
            payload: r
          }));
      } else {
        return this._companyImportExportService.ImportLedgersRequest()
          .map((r) => this.validateResponse<string, string>(r, {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_RESPONSE,
            payload: r
          }, true, {
            type: COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_RESPONSE,
            payload: r
          }));
      }
    });

  constructor(private action$: Actions,
              private _toasty: ToasterService,
              private store: Store<AppState>,
              private _companyImportExportService: CompanyImportExportService) {
  }

  public ExportRequest(fileType: CompanyImportExportFileTypes, from?: string, to?: string): CustomActions {
    return {
      type: COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_REQUEST,
      payload: {fileType, from, to}
    };
  }

  public ExportResponse(): CustomActions {
    return {
      type: COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_RESPONSE
    };
  }

  public ImportRequest(fileType: CompanyImportExportFileTypes): CustomActions {
    return {
      type: COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_REQUEST,
      payload: {fileType}
    };
  }

  public ImportResponse(): CustomActions {
    return {
      type: COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_RESPONSE
    };
  }

  public ResetCompanyImportExportState(): CustomActions {
    return {
      type: COMPANY_IMPORT_EXPORT_ACTIONS.COMPANY_IMPORT_EXPORT_RESET
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = {type: 'EmptyAction'}): CustomActions {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    }
    return successAction;
  }
}
