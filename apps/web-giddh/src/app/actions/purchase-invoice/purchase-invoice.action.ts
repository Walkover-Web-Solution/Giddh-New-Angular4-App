import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SETTINGS_PROFILE_ACTIONS } from './settings.profile.const';
import { GST_RETURN_ACTIONS, PURCHASE_INVOICE_ACTIONS } from './purchase-invoice.const';

import { saveAs } from 'file-saver';
import { CustomActions } from '../../store/customActions';
import { IInvoicePurchaseItem, IInvoicePurchaseResponse, ITaxResponse, PurchaseInvoiceService } from '../../services/purchase-invoice.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store/index';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';

@Injectable()
export class InvoicePurchaseActions {

    @Effect()
    public GetPurchaseInvoices$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES).pipe(
            switchMap((action: CustomActions) => this.purchaseInvoiceService.GetPurchaseInvoice(action.payload)),
            map(res => this.validateResponse<IInvoicePurchaseResponse, string>(res, {
                type: PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES_RESPONSE,
                payload: res
            }, true, {
                type: PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES_RESPONSE,
                payload: res
            })));

    @Effect()
    public UpdatePurchaseInvoice$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.UpdatePurchaseInvoice(action.payload.entryUniqueName, action.payload.taxUniqueName, action.payload.accountUniqueName).pipe(
                    map(response => this.UpdatePurchaseInvoiceResponse(response)));
            }));

    @Effect()
    public GetTaxesForThisCompany$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.GET_TAXES).pipe(
            switchMap((action: CustomActions) => this.purchaseInvoiceService.GetTaxesForThisCompany()),
            map(res => this.validateResponse<ITaxResponse[], string>(res, {
                type: PURCHASE_INVOICE_ACTIONS.SET_TAXES_FOR_COMPANY,
                payload: res
            }, true, {
                type: PURCHASE_INVOICE_ACTIONS.SET_TAXES_FOR_COMPANY,
                payload: res
            })));

    @Effect()
    public GeneratePurchaseInvoice$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.GENERATE_PURCHASE_INVOICE).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.GeneratePurchaseInvoice(action.payload).pipe(
                    map(response => this.UpdatePurchaseInvoiceResponse(response)));
            }));

    @Effect()
    private UpdatePurchaseInvoiceResponse$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<IInvoicePurchaseResponse, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Purchase Invoice Updated Successfully.');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    private DownloadGSTR1Sheet$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.DownloadGSTR1Sheet(action.payload).pipe(
                    map(response => this.DownloadGSTR1SheetResponse(response)));
            }));

    @Effect()
    private DownloadGSTR1SheetResponse$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.downloadFile(data.body, data.queryString.reqObj.period, data.queryString.reqObj.gstNumber, data.queryString.reqObj.type, data.queryString.reqObj.gstType);
                    this.toasty.successToast('Sheet Downloaded Successfully.');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    private DownloadGSTR1ErrorSheet$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.DownloadGSTR1ErrorSheet(action.payload).pipe(
                    map(response => this.DownloadGSTR1ErrorSheetResponse(response)));
            }));

    @Effect()
    private DownloadGSTR1ErrorSheetResponse$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.downloadFile(data.body, data.queryString.reqObj.period, data.queryString.reqObj.gstNumber, data.queryString.reqObj.type, data.queryString.reqObj.gstType);
                    this.toasty.successToast('Error Sheet Downloaded Successfully.');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    private SendGSTR3BEmail$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.SEND_GSTR3B_EMAIL).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.SendGSTR3BEmail(action.payload).pipe(
                    map(response => this.SendGSTR3BEmailResponse(response)));
            }));

    @Effect()
    private SendGSTR3BEmailResponse$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.SEND_GSTR3B_EMAIL_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));

    /**
     * UPDATE PURCHASE ENTRY
     */
    @Effect()
    private UpdatePurchaseEntry$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_ENTRY).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.UpdatePurchaseEntry(action.payload).pipe(
                    map(response => this.UpdatePurchaseEntryResponse(response)));
            }));

    /**
     * UPDATE PURCHASE ENTRY RESPONSE
     */
    @Effect()
    private UpdatePurchaseEntryResponse$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_ENTRY_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<IInvoicePurchaseResponse, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Entry Updated Successfully.');
                }
                return { type: 'EmptyAction' };
            }));

    /**
     * UPDATE INVOICE
     */
    @Effect()
    private UpdateInvoice$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_INVOICE).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.UpdateInvoice(action.payload).pipe(
                    map(response => this.UpdateInvoiceResponse(response)));
            }));

    /**
     * UPDATE PURCHASE ENTRY RESPONSE
     */
    @Effect()
    private UpdateInvoiceResponse$: Observable<Action> = this.action$
        .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_INVOICE_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<IInvoicePurchaseResponse, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Entry Updated Successfully.');
                }
                return { type: 'EmptyAction' };
            }));

    /**
     * Save Jio Gst Details
     */
    @Effect()
    private SaveJioGst$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.SAVE_JIO_GST).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.SaveJioGst(action.payload).pipe(
                    map(response => this.SaveJioGstResponse(response)));
            }));

    /**
     * Save Jio Gst Details RESPONSE
     */
    @Effect()
    private SaveJioGstResponse$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.SAVE_JIO_GST_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));

    /**
     * Save Tax Pro Details
     */
    @Effect()
    private SaveTaxPro$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.SAVE_TAX_PRO).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.SaveTaxPro(action.payload).pipe(
                    map(response => this.SaveTaxProResponse(response)));
            }));

    /**
     * Save Tax Pro RESPONSE
     */
    @Effect()
    private SaveTaxProResponse$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.SAVE_TAX_PRO_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));

    /**
     * Save Tax Pro With OTP Details
     */
    @Effect()
    private SaveTaxProWithOTP$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.SAVE_TAX_PRO_WITH_OTP).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.SaveTaxProWithOTP(action.payload).pipe(
                    map(response => this.SaveTaxProWithOTPResponse(response)));
            }));

    /**
     * Save Tax Pro With OTP Details RESPONSE
     */
    @Effect()
    private SaveTaxProWithOTPResponse$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.SAVE_TAX_PRO_WITH_OTP_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));

    /**
     * File Jio GSTR1
     */
    @Effect()
    private FileJioGstReturn$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.FILE_JIO_GST).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.FileGstReturn(action.payload).pipe(
                    map(response => this.FileJioGstReturnResponse(response)));
            }));

    /**
     * File Jio GSTR1 Response
     */
    @Effect()
    private FileJioGstReturnResponse$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.FILE_JIO_GST_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    private SaveGSPSession$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.SAVE_GSP_SESSION).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.SaveGSPSession(action.payload).pipe(
                    map(response => this.SaveTaxProResponse(response)));
            }));

    /**
     * Save Tax Pro RESPONSE
     */
    @Effect()
    private SaveGSPSessionResponse$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.SAVE_GSP_SESSION_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    private SaveGSPSessionWithOTP$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.SAVE_GSP_SESSION_WITH_OTP).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.SaveGSPSessionWithOTP(action.payload).pipe(
                    map(response => this.SaveGSPSessionWithOTPResponse(response)));
            }));

    @Effect()
    private SaveGSPSessionWithOTPResponse$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.SAVE_GSP_SESSION_WITH_OTP_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    private GetGSPSession$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.GET_GSP_SESSION).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.GetGSPSession(action.payload).pipe(
                    map(response => this.GetGSPSessionResponse(response)));
            }));

    @Effect()
    private FileGSTR3B$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.FILE_GSTR3B).pipe(
            switchMap((action: CustomActions) => {
                return this.purchaseInvoiceService.FileGstr3B(action.payload).pipe(
                    map(response => this.FileGSTR3BResponse(response)));
            }));

    /**
     * File Jio GSTR1 Response
     */
    @Effect()
    private FileGSTR3BResponse$: Observable<Action> = this.action$
        .ofType(GST_RETURN_ACTIONS.FILE_GSTR3B_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private router: Router,
        private store: Store<AppState>,
        private purchaseInvoiceService: PurchaseInvoiceService) {
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

    public downloadFile(data: Response, month: any, gstNumber: string, type: string, gstType) {
        let blob = this.base64ToBlob(data, 'application/xls', 512);
        return saveAs(blob, `${type}-${month.from}-${month.to}-${gstNumber}.xlsx`);

    }

    public GetPurchaseInvoices(model: CommonPaginatedRequest): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES,
            payload: model
        };
    }

    public UpdatePurchaseInvoice(entryUniqueName: string[], taxUniqueName: string[], accountUniqueName: string): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE,
            payload: { entryUniqueName, taxUniqueName, accountUniqueName }
        };
    }

    public GetTaxesForThisCompany(): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.GET_TAXES
        };
    }

    public GeneratePurchaseInvoice(model: IInvoicePurchaseItem): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.GENERATE_PURCHASE_INVOICE,
            payload: model
        };
    }

    public UpdatePurchaseInvoiceResponse(value: BaseResponse<IInvoicePurchaseItem, string>): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE_RESPONSE,
            payload: value
        };
    }

    public DownloadGSTR1Sheet(period: object, gstNumber: string, type: string, gstType: string): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET,
            payload: { period, gstNumber, type, gstType }
        };
    }

    public DownloadGSTR1SheetResponse(value: BaseResponse<any, string>): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET_RESPONSE,
            payload: value
        };
    }

    public DownloadGSTR1ErrorSheet(period: object, gstNumber: string, type: string, gstType): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET,
            payload: { period, gstNumber, type, gstType }
        };
    }

    public DownloadGSTR1ErrorSheetResponse(value: BaseResponse<any, string>): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET_RESPONSE,
            payload: value
        };
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

    public UpdatePurchaseEntry(model): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.UPDATE_ENTRY,
            payload: model
        };
    }

    public UpdatePurchaseEntryResponse(response): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.UPDATE_ENTRY_RESPONSE,
            payload: response
        };
    }

    public UpdateInvoice(model): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.UPDATE_INVOICE,
            payload: model
        };
    }

    public UpdateInvoiceResponse(response): CustomActions {
        return {
            type: PURCHASE_INVOICE_ACTIONS.UPDATE_INVOICE_RESPONSE,
            payload: response
        };
    }

    public SaveJioGst(model): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.SAVE_JIO_GST,
            payload: model
        };
    }

    public SaveJioGstResponse(response): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.SAVE_JIO_GST_RESPONSE,
            payload: response
        };
    }

    public SaveTaxPro(model): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.SAVE_TAX_PRO,
            payload: model
        };
    }

    public SaveTaxProResponse(response): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.SAVE_TAX_PRO_RESPONSE,
            payload: response
        };
    }

    public SaveTaxProWithOTP(model): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.SAVE_TAX_PRO_WITH_OTP,
            payload: model
        };
    }

    public SaveTaxProWithOTPResponse(response): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.SAVE_TAX_PRO_WITH_OTP_RESPONSE,
            payload: response
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

    public SaveGSPSession(model): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.SAVE_GSP_SESSION,
            payload: model
        };
    }

    public SaveGSPSessionResponse(response): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.SAVE_GSP_SESSION_RESPONSE,
            payload: response
        };
    }

    public SaveGSPSessionWithOTP(model): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.SAVE_GSP_SESSION_WITH_OTP,
            payload: model
        };
    }

    public SaveGSPSessionWithOTPResponse(response): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.SAVE_GSP_SESSION_WITH_OTP_RESPONSE,
            payload: response
        };
    }

    public GetGSPSession(gstIn): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.GET_GSP_SESSION,
            payload: gstIn
        };
    }

    public GetGSPSessionResponse(response): CustomActions {
        return {
            type: GST_RETURN_ACTIONS.GET_GSP_SESSION_RESPONSE,
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

    public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response.status === 'error') {
            if (showToast) {
                this.toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            if (showToast && typeof response.body === 'string') {
                this.toasty.successToast(response.body);
            }
        }
        return successAction;
    }

}
