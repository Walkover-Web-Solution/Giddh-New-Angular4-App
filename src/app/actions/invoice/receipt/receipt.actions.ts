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
import { DownloadVoucherRequest } from '../../../models/api-models/recipt';

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
            let blob = new Blob([JSON.stringify(res)], {type: 'application/json'});
            // saveAs(blob, this._generalService.companyUniqueName + '.json');
            this._toasty.successToast('voucher downloaded');
          } else {
            this._toasty.errorToast(response.message);
          }
          return this.DownloadVoucherResponse(response);
        });
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
}
