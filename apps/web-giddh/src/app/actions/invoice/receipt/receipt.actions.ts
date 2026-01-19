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

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * InvoiceReceiptActions actions
 * Defines invoicereceipt related action creators for state management
 */
export class InvoiceReceiptActions {

    public UPDATE_INVOICE_RECEIPT_REQUEST$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._receiptService.UpdateReceipt(action.payload.accountUniqueName, action.payload.model)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, ReciptRequest>(res, {
                type: INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT_RESPONSE,
                payload: res
            }))));

    public GET_ALL_INVOICE_RECEIPT$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._receiptService.GetAllReceipt(action.payload?.body, action.payload.type)),
            /**
             * Handles map functionality
             */
            map((response: BaseResponse<ReciptResponse, InvoiceReceiptFilter>) => {
                /**
                 * Handles if functionality
                 */
                if (response?.status !== 'success') {
                    this.showToaster(response.message, 'error');
                }
                return this.GetAllInvoiceReceiptResponse(response);
            })));

    public GET_VOUCHER_DETAILS$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._receiptService.GetVoucherDetails(action.payload.accountUniqueName,
                action.payload.model)),
            /**
             * Handles map functionality
             */
            map((response: BaseResponse<Voucher, ReceiptVoucherDetailsRequest>) => {
                /**
                 * Handles if functionality
                 */
                if (response?.status !== 'success') {
                    this.showToaster(response.message, 'error');
                }
                return this.GetVoucherDetailsResponse(response);
            })));

    public GET_VOUCHER_DETAILSV4$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILSV4),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._receiptService.getVoucherDetailsV4(action.payload.accountUniqueName,
                action.payload.model)),
            /**
             * Handles map functionality
             */
            map((response: BaseResponse<Voucher, ReceiptVoucherDetailsRequest>) => {
                /**
                 * Handles if functionality
                 */
                if (response?.status !== 'success') {
                    this.showToaster(response.message, 'error');
                }
                return this.GetVoucherDetailsResponseV4(response);
            })));

    public DELETE_INVOICE_RECEIPT$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._receiptService.DeleteReceipt(action.payload.accountUniqueName, action.payload.model)),
            /**
             * Handles map functionality
             */
            map((response: BaseResponse<string, ReciptDeleteRequest>) => {
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'success') {
                    this.showToaster(response?.body);
                } else {
                    this.showToaster(response.message, 'error');
                }
                return this.DeleteInvoiceReceiptResponse(response);
            })));

    public VoucherPreview$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._receiptService.DownloadVoucher(action.payload.model, action.payload.accountUniqueName)),
            /**
             * Handles map functionality
             */
            map((response: BaseResponse<any, any>) => {
                /**
                 * Handles if functionality
                 */
                if (!response) {
                    this.showToaster(response.message, 'error');
                }
                return this.VoucherPreviewResponse(response);
            })));

    public GetSalesRegistedDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_RECEIPT_ACTIONS.GET_SALESRAGISTED_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._receiptService.getDetailedSalesRegister(action.payload)),
            /**
             * Handles map functionality
             */
            map((response: BaseResponse<any, SalesRegisteDetailedResponse>) => {
                return this.GetSalesRegistedDetailsResponse(response);
            })));

    public GetPurchaseRegistedDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_RECEIPT_ACTIONS.GET_PURCHASE_REGISTERED_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._receiptService.getDetailedPurchaseRegister(action.payload)),
            /**
             * Handles map functionality
             */
            map((response: BaseResponse<any, PurchaseRegisteDetailedResponse>) => {
                return this.GetPurchaseRegistedDetailsResponse(response);
            })));

    public GetPurchaseRecordDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_RECEIPT_ACTIONS.GET_PURCHASE_RECORD_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._receiptService.GetPurchaseRecordDetails(action.payload.accountUniqueName, action.payload.purchaseRecordUniqueName)),
            /**
             * Handles map functionality
             */
            map((response: BaseResponse<Voucher, ReceiptVoucherDetailsRequest>) => {
                /**
                 * Handles if functionality
                 */
                if (response?.status !== 'success') {
                    this.showToaster(response.message, 'error');
                }
                return this.GetPurchaseRecordDetailsResponse(response);
            })));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions, private _toasty: ToasterService, private _receiptService: ReceiptService) {
    }

    /**
     * Handles UpdateInvoiceReceiptRequest functionality
     */
    public UpdateInvoiceReceiptRequest(model: ReciptRequest, accountUniqueName: string): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT,
            payload: { model, accountUniqueName }
        };
    }

    /**
     * Handles GetAllInvoiceReceiptRequest functionality
     */
    public GetAllInvoiceReceiptRequest(model: InvoiceReceiptFilter, type: string): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT,
            payload: { body: model, type }
        };
    }

    /**
     * Handles GetAllInvoiceReceiptResponse functionality
     */
    public GetAllInvoiceReceiptResponse(model: BaseResponse<ReciptResponse, InvoiceReceiptFilter>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles DeleteInvoiceReceiptRequest functionality
     */
    public DeleteInvoiceReceiptRequest(model: ReciptDeleteRequest, accountUniqueName: string): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT,
            payload: { model, accountUniqueName }
        };
    }

    /**
     * Handles DeleteInvoiceReceiptResponse functionality
     */
    public DeleteInvoiceReceiptResponse(model: BaseResponse<string, ReciptDeleteRequest>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles GetVoucherDetails functionality
     */
    public GetVoucherDetails(accountUniqueName: string, model: ReceiptVoucherDetailsRequest): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS,
            payload: { accountUniqueName, model }
        };
    }

    /**
     * Handles GetVoucherDetailsResponse functionality
     */
    public GetVoucherDetailsResponse(response: BaseResponse<Voucher, ReceiptVoucherDetailsRequest>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS_RESPONSE,
            payload: response
        };
    }
    /**
     * Retrieves voucherdetailsv4 data
     */
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

    /**
     * Handles GetVoucherDetailsResponseV4 functionality
     */
    public GetVoucherDetailsResponseV4(response: BaseResponse<Voucher, ReceiptVoucherDetailsRequest>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS_RESPONSEV4,
            payload: response
        };
    }
    /**
     * Handles ResetVoucherDetails functionality
     */
    public ResetVoucherDetails(): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.RESET_VOUCHER_DETAILS
        }
    }

    /**
     * Handles VoucherPreview functionality
     */
    public VoucherPreview(model: DownloadVoucherRequest, accountUniqueName: string) {
        return {
            type: INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_REQUEST,
            payload: { model, accountUniqueName }
        };
    }

    /**
     * Handles VoucherPreviewResponse functionality
     */
    public VoucherPreviewResponse(response) {
        return {
            type: INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles GenerateVoucher functionality
     */
    public GenerateVoucher(response) {
        return {
            type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
            payload: response
        };
    }

    /**
     * Updates existing voucherdetailsaftervoucherupdate
     */
    public updateVoucherDetailsAfterVoucherUpdate(response: BaseResponse<VoucherClass, GenericRequestForGenerateSCD> | BaseResponse<any, PurchaseRecordRequest>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.UPDATE_VOUCHER_DETAILS_AFTER_VOUCHER_UPDATE,
            payload: response
        }
    }

    //region set voucher for details, send-email and generate and download
    /**
     * Sets voucherfordetails value
     */
    public setVoucherForDetails(voucherNo: string, action: ActionTypeAfterVoucherGenerateOrUpdate): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.INVOICE_SET_VOUCHER_FOR_DETAILS,
            payload: { voucherNo, action }
        }
    }

    /**
     * Resets voucherfordetails to default state
     */
    public resetVoucherForDetails(): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.INVOICE_RESET_VOUCHER_FOR_DETAILS
        }
    }

    // sales report
    /**
     * Handles GetSalesRegistedDetails functionality
     */
    public GetSalesRegistedDetails(requestModel: ReportsDetailedRequestFilter): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_SALESRAGISTED_DETAILS,
            payload: requestModel
        };
    }

    /**
     * Handles GetSalesRegistedDetailsResponse functionality
     */
    public GetSalesRegistedDetailsResponse(response: BaseResponse<any, SalesRegisteDetailedResponse>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_SALESRAGISTED_DETAILS_RESPONSE,
            payload: response
        };
    }

    // purchase report
    /**
     * Handles GetPurchaseRegistedDetails functionality
     */
    public GetPurchaseRegistedDetails(requestModel: ReportsDetailedRequestFilter): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_PURCHASE_REGISTERED_DETAILS,
            payload: requestModel
        };
    }

    /**
     * Handles GetPurchaseRegistedDetailsResponse functionality
     */
    public GetPurchaseRegistedDetailsResponse(response: BaseResponse<any, PurchaseRegisteDetailedResponse>): CustomActions {
        return {
            type: INVOICE_RECEIPT_ACTIONS.GET_PURCHASE_REGISTERED_DETAILS_RESPONSE,
            payload: response
        };
    }

    //endregion

    /**
     * Shows toaster element
     */
    private showToaster(message: string, type: string = 'success') {
        /**
         * Handles if functionality
         */
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
        /**
         * Handles if functionality
         */
        if (response?.status === 'error') {
            /**
             * Handles if functionality
             */
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            /**
             * Handles if functionality
             */
            if (showToast && typeof response.body === 'string') {
                this._toasty.successToast(response.body);
            } else if (message) {
                this._toasty.successToast(message);
            }
        }
        return successAction;
    }
}
