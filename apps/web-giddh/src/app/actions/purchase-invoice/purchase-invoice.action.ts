import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GST_RETURN_ACTIONS, PURCHASE_INVOICE_ACTIONS } from './purchase-invoice.const';
import { saveAs } from 'file-saver';
import { CustomActions } from '../../store/custom-actions';
import { PurchaseInvoiceService } from '../../services/purchase-invoice.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ToasterService } from '../../services/toaster.service';
import { GeneralService } from '../../services/general.service';

@Injectable()
export class InvoicePurchaseActions {

    public SendGSTR3BEmail$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PURCHASE_INVOICE_ACTIONS.SEND_GSTR3B_EMAIL),
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.SendGSTR3BEmail(action.payload).pipe(
                    map(response => this.SendGSTR3BEmailResponse(response)));
            })));

    public SendGSTR3BEmailResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PURCHASE_INVOICE_ACTIONS.SEND_GSTR3B_EMAIL_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * File Jio GSTR1
     */
    public FileJioGstReturn$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GST_RETURN_ACTIONS.FILE_JIO_GST),
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.FileGstReturn(action.payload).pipe(
                    map(response => this.FileJioGstReturnResponse(response)));
            })));

    /**
     * File Jio GSTR1 Response
     */

    public FileJioGstReturnResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GST_RETURN_ACTIONS.FILE_JIO_GST_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            })));

    public FileGSTR3B$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GST_RETURN_ACTIONS.FILE_GSTR3B),
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.FileGstr3B(action.payload).pipe(
                    map(response => this.FileGSTR3BResponse(response)));
            })));

    /**
     * File Jio GSTR1 Response
     */

    public FileGSTR3BResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GST_RETURN_ACTIONS.FILE_GSTR3B_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            })));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private purchaseInvoiceService: PurchaseInvoiceService,
        private generalService: GeneralService) {
    }

    public downloadFile(data: Response, month: any, gstNumber: string, type: string, gstType) {
        let blob = this.generalService.base64ToBlob(data, 'application/xls', 512);
        return saveAs(blob, `${type}-${month.from}-${month.to}-${gstNumber}.xlsx`);
    }

    public SendGSTR3BEmail(month: string, gstNumber: string, isNeedDetailSheet: boolean, email?: string): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.SEND_GSTR3B_EMAIL,
            payload: { month, gstNumber, isNeedDetailSheet, email }
        };
    }

    public SendGSTR3BEmailResponse(value: BaseResponse<any, string>): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.SEND_GSTR3B_EMAIL_RESPONSE,
            payload: value
        };
    }

    public FileJioGstReturn(period, gstNumber, via): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.FILE_JIO_GST,
            payload: { period, gstNumber, via }
        };
    }

    public FileJioGstReturnResponse(response): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.FILE_JIO_GST_RESPONSE,
            payload: response
        };
    }

    public FileGSTR3B(period, gstNumber, via): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.FILE_GSTR3B,
            payload: { period, gstNumber, via }
        };
    }

    public FileGSTR3BResponse(response): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.FILE_GSTR3B_RESPONSE,
            payload: response
        };
    }
}
