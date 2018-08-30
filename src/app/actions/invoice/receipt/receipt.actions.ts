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
import { DownloadVoucherRequest, InvoiceReceiptFilter, ReciptRequest, ReciptRequestParams, ReciptResponse } from '../../../models/api-models/recipt';

@Injectable()
export class InvoiceReceiptActions {
  @Effect()
  private DOWNLOAD_VOUCHER_REQUEST$: Observable<Action> = this.action$
    .ofType(INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_REQUEST)
    .switchMap((action: CustomActions) => {

      return this._receiptService.DownloadVoucher(action.payload.model, action.payload.accountUniqueName)
        .map((response: BaseResponse<any, DownloadVoucherRequest>) => {
          if (response.status === 'success') {
            let res = {body: response.body};
            let blob = new Blob([JSON.stringify(res)], {type: 'application/pdf'});
            saveAs(blob, response.queryString.accountUniqueName + '.pdf');
            this._toasty.successToast('voucher downloaded');
          } else {
            this._toasty.errorToast(response.message);
          }
          return this.DownloadVoucherResponse(response);
        });
    });

  @Effect()
  private UPDATE_INVOICE_RECEIPT_REQUEST$: Observable<Action> = this.action$
    .ofType(INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT)
    .switchMap((action: CustomActions) => this._receiptService.UpdateReceipt(action.payload.accountUniqueName, action.payload.model))
    .map(res => this.validateResponse<string, ReciptRequest>(res, {
      type: INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT_RESPONSE,
      payload: res
    }, true, {
      type: INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT_RESPONSE,
      payload: res
    }));

  @Effect()
  private GET_ALL_INVOICE_RECEIPT$: Observable<Action> = this.action$
    .ofType(INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT)
    .switchMap((action: CustomActions) => this._receiptService.GetAllReceipt(action.payload.model))
    .map((response: BaseResponse<ReciptResponse, InvoiceReceiptFilter>) => {
      if (response.status === 'success') {
        // this.showToaster('');
      } else {
        this.showToaster(response.message, 'error');
      }
      return this.GetAllInvoiceReceiptResponse(response);
    });

  @Effect()
  private DELETE_INVOICE_RECEIPT$: Observable<Action> = this.action$
    .ofType(INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT)
    .switchMap((action: CustomActions) => this._receiptService.DeleteReceipt(action.payload.accountUniqueName, action.payload.querRequest))
    .map(response => {
      return this.DeleteInvoiceReceiptResponse(response);
    });

  constructor(private action$: Actions, private _toasty: ToasterService,
              private store: Store<AppState>, private _receiptService: ReceiptService) {
  }

  public DownloadVoucherRequest(model: DownloadVoucherRequest, accountUniqueName: string): CustomActions {
    return {
      type: INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_REQUEST,
      payload: {model, accountUniqueName}
    };
  }

  public DownloadVoucherResponse(response: BaseResponse<any, DownloadVoucherRequest>): CustomActions {
    return {
      type: INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_RESPONSE,
      payload: response
    };
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

  public DeleteInvoiceReceiptResponse(model): CustomActions {
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
