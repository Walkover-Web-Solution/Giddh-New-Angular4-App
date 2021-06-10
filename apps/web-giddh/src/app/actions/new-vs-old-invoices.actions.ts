import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { NewVsOldInvoicesService } from '../services/new-vs-old-invoices.service';
import { ToasterService } from '../services/toaster.service';
import { CustomActions } from '../store/customActions';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { NewVsOldInvoicesRequest, NewVsOldInvoicesResponse } from '../models/api-models/new-vs-old-invoices';

@Injectable()
export class NewVsOldInvoicesActions {
    public static GET_NEW_VS_OLD_INVOICE_REQUEST = 'GET_NEW_VS_OLD_INVOICE_REQUEST';
    public static GET_NEW_VS_OLD_INVOICE_RESPONSE = 'GET_NEW_VS_OLD_INVOICE_RESPONSE';
    public static GET_NULL = 'GET_NULL';

    private getNewVsOldInvoicesResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(NewVsOldInvoicesActions.GET_NEW_VS_OLD_INVOICE_REQUEST),
            switchMap((action: CustomActions) => this._NewVsOldInvoicesService.GetNewVsOldInvoices(action.payload.queryRequest)),
            map((r) => this.validateResponse<NewVsOldInvoicesResponse, string>(r, {
                type: NewVsOldInvoicesActions.GET_NEW_VS_OLD_INVOICE_RESPONSE,
                payload: r.body
            }, true, {
                type: NewVsOldInvoicesActions.GET_NEW_VS_OLD_INVOICE_RESPONSE,
                payload: null
            }
            ))));

    constructor(private action$: Actions, private _NewVsOldInvoicesService: NewVsOldInvoicesService, private _toasty: ToasterService) {
    }

    public GetNewVsOldInvoicesRequest(queryRequest: NewVsOldInvoicesRequest): CustomActions {
        return {
            type: NewVsOldInvoicesActions.GET_NEW_VS_OLD_INVOICE_REQUEST,
            payload: { queryRequest }
        };
    }

    public GetResponseNull(): CustomActions {
        return {
            type: NewVsOldInvoicesActions.GET_NULL
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
