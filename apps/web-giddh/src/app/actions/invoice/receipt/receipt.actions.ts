import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CustomActions } from '../../../store/custom-actions';
import { INVOICE_RECEIPT_ACTIONS } from './receipt.const';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { ToasterService } from '../../../services/toaster.service';
import { Action } from '@ngrx/store';
import { ReceiptService } from '../../../services/receipt.service';
import { Observable } from 'rxjs';
import { DownloadVoucherRequest, InvoiceReceiptFilter, ReceiptVoucherDetailsRequest, ReciptDeleteRequest, ReciptRequest, ReciptResponse, Voucher } from '../../../models/api-models/recipt';
import { INVOICE_ACTIONS } from '../invoice.const';
import { ActionTypeAfterVoucherGenerateOrUpdate, GenericRequestForGenerateSCD, VoucherClass, PurchaseRecordRequest } from '../../../models/api-models/Sales';
import { SalesRegisteDetailedResponse, ReportsDetailedRequestFilter, PurchaseRegisteDetailedResponse } from '../../../models/api-models/Reports';

@Injectable()
export class InvoiceReceiptActions {

    public UPDATE_INVOICE_RECEIPT_REQUEST$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT),
            switchMap((action: CustomActions) => this._receiptService.UpdateReceipt(action.payload.accountUniqueName, action.payload.model)),
            map(res => this.validateResponse<string, ReciptRequest>(res, {
                type: INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT_RESPONSE,
                payload: res
            }))));

    public GET_ALL_INVOICE_RECEIPT$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT),
            switchMap((action: CustomActions) => this._receiptService.GetAllReceipt(action.payload?.body, action.payload.type)),
            map((response: BaseResponse<ReciptResponse, InvoiceReceiptFilter>) => {
                if (response?.status !== 'success') {
                    this.showToaster(response.message, 'error');
                }
                return this.GetAllInvoiceReceiptResponse(response);
            })));

    public GET_VOUCHER_DETAILS$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS),
            switchMap((action: CustomActions) => this._receiptService.GetVoucherDetails(action.payload.accountUniqueName,
                action.payload.model)),
            map((response: BaseResponse<Voucher, ReceiptVoucherDetailsRequest>) => {
                if (response?.status !== 'success') {
                    this.showToaster(response.message, 'error');
                }
                return this.GetVoucherDetailsResponse(response);
            })));

    public GET_VOUCHER_DETAILSV4$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILSV4),
            switchMap((action: CustomActions) => this._receiptService.getVoucherDetailsV4(action.payload.accountUniqueName,
                action.payload.model)),
            map((response: BaseResponse<Voucher, ReceiptVoucherDetailsRequest>) => {
                if (response?.status !== 'success') {
                    this.showToaster(response.message, 'error');
                }
                return this.GetVoucherDetailsResponseV4(response);
            })));

    public DELETE_INVOICE_RECEIPT$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT),
            switchMap((action: CustomActions) => this._receiptService.DeleteReceipt(action.payload.accountUniqueName, action.payload.model)),
            map((response: BaseResponse<string, ReciptDeleteRequest>) => {
                if (response?.status === 'success') {
                    this.showToaster(response?.body);
                } else {
                    this.showToaster(response.message, 'error');
                }
                return this.DeleteInvoiceReceiptResponse(response);
            })));

    public VoucherPreview$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_REQUEST),
            switchMap((action: CustomActions) => this._receiptService.DownloadVoucher(action.payload.model, action.payload.accountUniqueName)),
            map((response: BaseResponse<any, any>) => {
                if (!response) {
                    this.showToaster(response.message, 'error');
                }
                return this.VoucherPreviewResponse(response);
            })));

    public GetSalesRegistedDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVOICE_RECEIPT_ACTIONS.GET_SALESRAGISTED_DETAILS),
            switchMap((action: CustomActions) => this._receiptService.getDetailedSalesRegister(action.payload)),
            map((response: BaseResponse<any, SalesRegisteDetailedResponse>) => {
                return this.GetSalesRegistedDetailsResponse(response);
            })));

    public GetPurchaseRegistedDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVOICE_RECEIPT_ACTIONS.GET_PURCHASE_REGISTERED_DETAILS),
            switchMap((action: CustomActions) => this._receiptService.getDetailedPurchaseRegister(action.payload)),
            map((response: BaseResponse<any, PurchaseRegisteDetailedResponse>) => {
                return this.GetPurchaseRegistedDetailsResponse(response);
            })));

    public GetPurchaseRecordDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVOICE_RECEIPT_ACTIONS.GET_PURCHASE_RECORD_DETAILS),
            switchMap((action: CustomActions) => this._receiptService.GetPurchaseRecordDetails(action.payload.accountUniqueName, action.payload.purchaseRecordUniqueName)),
            map((response: BaseResponse<Voucher, ReceiptVoucherDetailsRequest>) => {
                if (response?.status !== 'success') {
                    this.showToaster(response.message, 'error');
                }
                return this.GetPurchaseRecordDetailsResponse(response);
            })));

    constructor(private action$: Actions, private _toasty: ToasterService, private _receiptService: ReceiptService) {
    }

    public UpdateInvoiceReceiptRequest(model: ReciptRequest, accountUniqueName: string): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT,
            payload: { model, accountUniqueName }
        };
    }

    public GetAllInvoiceReceiptRequest(model: InvoiceReceiptFilter, type: string): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT,
            payload: { body: model, type }
        };
    }

    public GetAllInvoiceReceiptResponse(model: BaseResponse<ReciptResponse, InvoiceReceiptFilter>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT_RESPONSE,
            payload: model
        };
    }

    public DeleteInvoiceReceiptRequest(model: ReciptDeleteRequest, accountUniqueName: string): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT,
            payload: { model, accountUniqueName }
        };
    }

    public DeleteInvoiceReceiptResponse(model: BaseResponse<string, ReciptDeleteRequest>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT_RESPONSE,
            payload: model
        };
    }

    public GetVoucherDetails(accountUniqueName: string, model: ReceiptVoucherDetailsRequest): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS,
            payload: { accountUniqueName, model }
        };
    }

    public GetVoucherDetailsResponse(response: BaseResponse<Voucher, ReceiptVoucherDetailsRequest>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS_RESPONSE,
            payload: response
        };
    }
    public getVoucherDetailsV4(accountUniqueName: string, model: ReceiptVoucherDetailsRequest): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILSV4,
            payload: { accountUniqueName, model }
        };
    }

    /**
     * Returns the action for fetching particular purchase record
     *
     * @param {string} accountUniqueName Account unique name for which purchase record is been made
     * @param {string} purchaseRecordUniqueName Purchase record unique name
     * @returns {CustomActions} Action for fetching particular purchase record
     * @memberof InvoiceReceiptActions
     */
    public GetPurchaseRecordDetails(accountUniqueName: string, purchaseRecordUniqueName: string): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_PURCHASE_RECORD_DETAILS,
            payload: { accountUniqueName, purchaseRecordUniqueName }
        };
    }

    /**
     * Returns the action for handling get purchase record API response
     *
     * @param {BaseResponse<Voucher, any>} response Response returned by the API
     * @returns {CustomActions} Action for handling get purchase record API response
     * @memberof InvoiceReceiptActions
     */
    public GetPurchaseRecordDetailsResponse(response: BaseResponse<Voucher, any>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS_RESPONSEV4,
            payload: response
        };
    }

    public GetVoucherDetailsResponseV4(response: BaseResponse<Voucher, ReceiptVoucherDetailsRequest>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS_RESPONSEV4,
            payload: response
        };
    }
    public ResetVoucherDetails(): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.RESET_VOUCHER_DETAILS
        }
    }

    public VoucherPreview(model: DownloadVoucherRequest, accountUniqueName: string) {
        return {
            type: INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_REQUEST,
            payload: { model, accountUniqueName }
        };
    }

    public VoucherPreviewResponse(response) {
        return {
            type: INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_RESPONSE,
            payload: response
        };
    }

    public GenerateVoucher(response) {
        return {
            type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
            payload: response
        };
    }

    public updateVoucherDetailsAfterVoucherUpdate(response: BaseResponse<VoucherClass, GenericRequestForGenerateSCD> | BaseResponse<any, PurchaseRecordRequest>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.UPDATE_VOUCHER_DETAILS_AFTER_VOUCHER_UPDATE,
            payload: response
        }
    }

    //region set voucher for details, send-email and generate and download
    public setVoucherForDetails(voucherNo: string, action: ActionTypeAfterVoucherGenerateOrUpdate): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.INVOICE_SET_VOUCHER_FOR_DETAILS,
            payload: { voucherNo, action }
        }
    }

    public resetVoucherForDetails(): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.INVOICE_RESET_VOUCHER_FOR_DETAILS
        }
    }

    // sales report
    public GetSalesRegistedDetails(requestModel: ReportsDetailedRequestFilter): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_SALESRAGISTED_DETAILS,
            payload: requestModel
        };
    }

    public GetSalesRegistedDetailsResponse(response: BaseResponse<any, SalesRegisteDetailedResponse>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_SALESRAGISTED_DETAILS_RESPONSE,
            payload: response
        };
    }

    // purchase report
    public GetPurchaseRegistedDetails(requestModel: ReportsDetailedRequestFilter): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_PURCHASE_REGISTERED_DETAILS,
            payload: requestModel
        };
    }

    public GetPurchaseRegistedDetailsResponse(response: BaseResponse<any, PurchaseRegisteDetailedResponse>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_PURCHASE_REGISTERED_DETAILS_RESPONSE,
            payload: response
        };
    }

    //endregion

    private showToaster(message: string, type: string = 'success') {
        if (type === 'error') {
            this._toasty.errorToast(message);
        } else {
            this._toasty.successToast(message);
        }
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>,
        successAction: CustomActions,
        showToast: boolean = false,
        errorAction: CustomActions = { type: 'EmptyAction' },
        message?: string): CustomActions {
        if (response?.status === 'error') {
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
