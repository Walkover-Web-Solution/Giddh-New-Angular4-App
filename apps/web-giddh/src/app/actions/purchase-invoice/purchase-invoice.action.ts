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

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * InvoicePurchaseActions class
 * Implements InvoicePurchaseActions functionality
 */
export class InvoicePurchaseActions {

    public SendGSTR3BEmail$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PURCHASE_INVOICE_ACTIONS.SEND_GSTR3B_EMAIL),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.SendGSTR3BEmail(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.SendGSTR3BEmailResponse(response)));
            })));

    public SendGSTR3BEmailResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PURCHASE_INVOICE_ACTIONS.SEND_GSTR3B_EMAIL_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(GST_RETURN_ACTIONS.FILE_JIO_GST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.FileGstReturn(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.FileJioGstReturnResponse(response)));
            })));

    /**
     * File Jio GSTR1 Response
     */

    public FileJioGstReturnResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GST_RETURN_ACTIONS.FILE_JIO_GST_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            })));

    public FileGSTR3B$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GST_RETURN_ACTIONS.FILE_GSTR3B),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.FileGstr3B(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.FileGSTR3BResponse(response)));
            })));

    /**
     * File Jio GSTR1 Response
     */

    public FileGSTR3BResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GST_RETURN_ACTIONS.FILE_GSTR3B_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private toasty: ToasterService,
        private purchaseInvoiceService: PurchaseInvoiceService,
        private generalService: GeneralService) {
    }

    /**
     * Handles downloadFile functionality
     */
    public downloadFile(data: Response, month: any, gstNumber: string, type: string, gstType) {
        let blob = this.generalService.base64ToBlob(data, 'application/xls', 512);
        return saveAs(blob, `${type}-${month.from}-${month.to}-${gstNumber}.xlsx`);
    }

    /**
     * Handles SendGSTR3BEmail functionality
     */
    public SendGSTR3BEmail(month: string, gstNumber: string, isNeedDetailSheet: boolean, email?: string): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.SEND_GSTR3B_EMAIL,
            payload: { month, gstNumber, isNeedDetailSheet, email }
        };
    }

    /**
     * Handles SendGSTR3BEmailResponse functionality
     */
    public SendGSTR3BEmailResponse(value: BaseResponse<any, string>): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.SEND_GSTR3B_EMAIL_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles FileJioGstReturn functionality
     */
    public FileJioGstReturn(period, gstNumber, via): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.FILE_JIO_GST,
            payload: { period, gstNumber, via }
        };
    }

    /**
     * Handles FileJioGstReturnResponse functionality
     */
    public FileJioGstReturnResponse(response): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.FILE_JIO_GST_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles FileGSTR3B functionality
     */
    public FileGSTR3B(period, gstNumber, via): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.FILE_GSTR3B,
            payload: { period, gstNumber, via }
        };
    }

    /**
     * Handles FileGSTR3BResponse functionality
     */
    public FileGSTR3BResponse(response): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.FILE_GSTR3B_RESPONSE,
            payload: response
        };
    }
}
