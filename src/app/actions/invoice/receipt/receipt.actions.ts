import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { CustomActions } from '../../../store/customActions';
import { INVOICE_RECEIPT_ACTIONS } from './receipt.const';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { ReceiptService } from '../../../services/receipt.service';
import { Observable } from 'rxjs';
import { InvoiceReceiptFilter, ReciptDeleteRequest, ReciptRequest, ReciptResponse } from '../../../models/api-models/recipt';

@Injectable()
export class InvoiceReceiptActions {

  @Effect()
  private UPDATE_INVOICE_RECEIPT_REQUEST$: Observable<Action> = this.action$
    .ofType(INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT).pipe(
      switchMap((action: CustomActions) => this._receiptService.UpdateReceipt(action.payload.accountUniqueName, action.payload.model)),
      map(res => this.validateResponse<string, ReciptRequest>(res, {
        type: INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT_RESPONSE,
        payload: res
      }, true, {
        type: INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT_RESPONSE,
        payload: res
      })),);

  @Effect()
  private GET_ALL_INVOICE_RECEIPT$: Observable<Action> = this.action$
    .ofType(INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT).pipe(
      switchMap((action: CustomActions) => this._receiptService.GetAllReceipt(action.payload)),
      map((response: BaseResponse<ReciptResponse, InvoiceReceiptFilter>) => {
        if (response.status === 'success') {
          // this.showToaster('');
        } else {
          this.showToaster(response.message, 'error');
        }
        return this.GetAllInvoiceReceiptResponse(response);
      }),);

  @Effect()
  private DELETE_INVOICE_RECEIPT$: Observable<Action> = this.action$
    .ofType(INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT).pipe(
      switchMap((action: CustomActions) => this._receiptService.DeleteReceipt(action.payload.accountUniqueName, action.payload.model)),
      map((response: BaseResponse<string, ReciptDeleteRequest>) => {
        let success = response.status === 'success';
        this.showToaster(success ? 'Receipt Deleted Successfully' : response.message, success ? 'success' : 'error');
        return this.DeleteInvoiceReceiptResponse(response);
      }),);

  constructor(private action$: Actions, private _toasty: ToasterService,
              private store: Store<AppState>, private _receiptService: ReceiptService) {
  }

  public ResetInvoiceReceiptState(): CustomActions {
    return {
      type: INVOICE_RECEIPT_ACTIONS.INVOICE_RECEIPT_RESET
    };
  }

  public UpdateInvoiceReceiptRequest(accountUniqueName: string, model: ReciptRequest): CustomActions {
    return {
      type: INVOICE_RECEIPT_ACTIONS.UPDATE_GENERATED_INVOICE_RECEIPT,
      payload: {accountUniqueName, body: model}
    };
  }

  public GetAllInvoiceReceiptRequest(model: InvoiceReceiptFilter): CustomActions {
    return {
      type: INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT,
      payload: model
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
      payload: {model, accountUniqueName}
    };
  }

  public DeleteInvoiceReceiptResponse(model: BaseResponse<string, ReciptDeleteRequest>): CustomActions {
    return {
      type: INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT_RESPONSE,
      payload: model
    };
  }

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
                                                errorAction: CustomActions = {type: 'EmptyAction'},
                                                message?: string): CustomActions {
    if (response.status === 'error') {
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
