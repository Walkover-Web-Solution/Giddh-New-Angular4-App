import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { CustomActions } from '../../store/customActions';
import { ToasterService } from '../../services/toaster.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { Observable } from 'rxjs';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';
import { ExpenseService } from '../../services/expences.service';
import { PettyCashResonse } from '../../models/api-models/Expences';

@Injectable()
export class ExpencesAction {
    public static readonly GET_PETTYCASH_ENTRY_REQUEST = 'GET_PETTYCASH_ENTRY_REQUEST';
    public static readonly GET_PETTYCASH_ENTRY_RESPONSE = 'GET_PETTYCASH_ENTRY_RESPONSE';
    public static readonly GET_PETTYCASH_REPORT_REQUEST = 'GET_PETTYCASH_REPORT_REQUEST';
    public static readonly GET_PETTYCASH_REPORT_RESPONSE = 'GET_PETTYCASH_REPORT_RESPONSE';
    public static readonly GET_PETTYCASH_REJECTED_REPORT_REQUEST = 'GET_PETTYCASH_REJECTED_REPORT_REQUEST';
    public static readonly GET_PETTYCASH_REJECTED_REPORT_RESPONSE = 'GET_PETTYCASH_REJECTED_REPORT_RESPONSE';



    public GetPettycashReportRequest$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(ExpencesAction.GET_PETTYCASH_REPORT_REQUEST),
            switchMap((action: CustomActions) =>
                this._expenseService.getPettycashReports(action.payload)
            ),
            map(response => {
                return this.GetPettycashReportResponse(response);
            })));


    public GetPettycashReportResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(ExpencesAction.GET_PETTYCASH_REPORT_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, CommonPaginatedRequest> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    // this._toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            })));

    public GetPettycashRejectedReportRequest$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(ExpencesAction.GET_PETTYCASH_REJECTED_REPORT_REQUEST),
            switchMap((action: CustomActions) =>
                this._expenseService.getPettycashRejectedReports(action.payload)
            ),
            map(response => {
                return this.GetPettycashRejectedReportResponse(response);
            })));


    public GetPettycashRejectedReportRequestResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(ExpencesAction.GET_PETTYCASH_REJECTED_REPORT_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, CommonPaginatedRequest> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    // this._toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            })));

    public GetPettycashEntryRequest$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(ExpencesAction.GET_PETTYCASH_ENTRY_REQUEST),
            switchMap((action: CustomActions) =>
                this._expenseService.getPettycashEntry(action.payload)
            ),
            map(response => {
                return this.getPettycashEntryResponse(response);
            })));


    public GetPettycashEntryResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(ExpencesAction.GET_PETTYCASH_ENTRY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<PettyCashResonse, any> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    // this._toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            })));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private _expenseService: ExpenseService) {
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

    public GetPettycashReportRequest(request: CommonPaginatedRequest): CustomActions {
        return {
            type: ExpencesAction.GET_PETTYCASH_REPORT_REQUEST,
            payload: request
        };
    }
    public GetPettycashReportResponse(value: BaseResponse<any, string>): CustomActions {
        return {
            type: ExpencesAction.GET_PETTYCASH_REPORT_RESPONSE,
            payload: value
        };
    }
    public GetPettycashRejectedReportRequest(request: CommonPaginatedRequest): CustomActions {
        return {
            type: ExpencesAction.GET_PETTYCASH_REJECTED_REPORT_REQUEST,
            payload: request
        };
    }
    public GetPettycashRejectedReportResponse(value: BaseResponse<any, string>): CustomActions {
        return {
            type: ExpencesAction.GET_PETTYCASH_REJECTED_REPORT_RESPONSE,
            payload: value
        };
    }
    public getPettycashEntryRequest(request: string): CustomActions {
        return {
            type: ExpencesAction.GET_PETTYCASH_ENTRY_REQUEST,
            payload: request
        };
    }
    public getPettycashEntryResponse(value: BaseResponse<PettyCashResonse, string>): CustomActions {
        return {
            type: ExpencesAction.GET_PETTYCASH_ENTRY_RESPONSE,
            payload: value
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
