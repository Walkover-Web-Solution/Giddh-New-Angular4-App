import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { CustomActions } from '../../store/customActions';
import { ToasterService } from '../../services/toaster.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { DaybookService } from '../../services/daybook.service';
import { saveAs } from 'file-saver';
import { DaybookQueryRequest, DayBookRequestModel } from '../../models/api-models/DaybookRequest';
import { DayBookResponseModel } from '../../models/api-models/Daybook';
import { Observable } from 'rxjs';

@Injectable()
export class DaybookActions {

    public static readonly GET_DAYBOOK_REQUEST = 'GET_DAYBOOK_REQUEST';
    public static readonly GET_DAYBOOK_RESPONSE = 'GET_DAYBOOK_RESPONSE';

    public static readonly EXPORT_DAYBOOK_REQUEST = 'EXPORT_DAYBOOK_REQUEST';
    public static readonly EXPORT_DAYBOOK_RESPONSE = 'EXPORT_DAYBOOK_RESPONSE';

    public static readonly EXPORT_DAYBOOK_POST_REQUEST = 'EXPORT_DAYBOOK_POST_REQUEST';
    public static readonly EXPORT_DAYBOOK_POST_RESPONSE = 'EXPORT_DAYBOOK_POST_RESPONSE';

    @Effect() private GetDaybook$: Observable<Action> = this.action$
        .ofType(DaybookActions.GET_DAYBOOK_REQUEST).pipe(
            switchMap((action: CustomActions) => {
                return this._daybookService.GetDaybook(action.payload.request, action.payload.queryRequest).pipe(
                    map((r) => this.validateResponse<DayBookResponseModel, DayBookRequestModel>(r, {
                        type: DaybookActions.GET_DAYBOOK_RESPONSE,
                        payload: r.body
                    }, true, {
                        type: DaybookActions.GET_DAYBOOK_RESPONSE,
                        payload: null
                    })));
            }));

    @Effect() private ExportDaybook$: Observable<Action> = this.action$
        .ofType(DaybookActions.EXPORT_DAYBOOK_REQUEST).pipe(
            switchMap((action: CustomActions) => {
                return this._daybookService.ExportDaybook(action.payload.request, action.payload.queryRequest).pipe(
                    map((res) => {
                        if (res.status === 'success') {
                            let blob = this.base64ToBlob(res.body, res.queryString.requestType, 512);
                            let type = res.queryString.requestType === 'application/pdf' ? '.pdf' : '.xls';
                            saveAs(blob, 'response' + type);
                        } else {
                            this._toasty.clearAllToaster();
                            this._toasty.errorToast(res.message);
                        }
                        return { type: 'EmptyAction' };
                    }));
            }));

    @Effect() private ExportDaybookPost$: Observable<Action> = this.action$
        .ofType(DaybookActions.EXPORT_DAYBOOK_POST_REQUEST).pipe(
            switchMap((action: CustomActions) => {
                return this._daybookService.ExportDaybookPost(action.payload.request, action.payload.queryRequest).pipe(
                    map((res) => {
                        if (res.status === 'success') {
                            let blob = this.base64ToBlob(res.body, res.queryString.requestType, 512);
                            let type = res.queryString.requestType === 'application/pdf' ? '.pdf' : '.xls';
                            saveAs(blob, 'response' + type);
                        } else {
                            this._toasty.clearAllToaster();
                            this._toasty.errorToast(res.message);
                        }
                        return { type: 'EmptyAction' };
                    }));
            }));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private _daybookService: DaybookService) {
    }

    public base64ToBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        let offset = 0;
        while (offset < byteCharacters.length) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);
            let byteNumbers = new Array(slice.length);
            let i = 0;
            while (i < slice.length) {
                byteNumbers[i] = slice.charCodeAt(i);
                i++;
            }
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
            offset += sliceSize;
        }
        return new Blob(byteArrays, { type: contentType });
    }

    public GetDaybook(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): CustomActions {
        return {
            type: DaybookActions.GET_DAYBOOK_REQUEST,
            payload: { request, queryRequest }
        };
    }

    public ExportDaybook(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): CustomActions {
        return {
            type: DaybookActions.EXPORT_DAYBOOK_REQUEST,
            payload: { request, queryRequest }
        };
    }

    public ExportDaybookPost(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): CustomActions {
        return {
            type: DaybookActions.EXPORT_DAYBOOK_POST_REQUEST,
            payload: { request, queryRequest }
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
