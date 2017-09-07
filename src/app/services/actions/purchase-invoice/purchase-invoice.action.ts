import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { SETTINGS_PROFILE_ACTIONS } from './settings.profile.const';
import { SettingsProfileService } from '../../../settings.profile.service';
import { SmsKeyClass } from '../../../../models/api-models/SettingsIntegraion';
import { PURCHASE_INVOICE_ACTIONS } from './purchase-invoice.const';
import { PurchaseInvoiceService, IInvoicePurchaseResponse } from '../../purchase-invoice.service';
import { ToasterService } from '../../toaster.service';
import { AppState } from '../../../store/roots';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { saveAs } from 'file-saver';

@Injectable()
export class InvoicePurchaseActions {

  @Effect()
  public GetPurchaseInvoices$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES)
    .switchMap(action => this.purchaseInvoiceService.GetPurchaseInvoice())
    .map(res => this.validateResponse<IInvoicePurchaseResponse[], string>(res, {
      type: PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES_RESPONSE,
      payload: res
    }, true, {
        type: PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES_RESPONSE,
        payload: res
      }));

  @Effect()
  public UpdatePurchaseInvoice$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE)
    .switchMap(action => {
      return this.purchaseInvoiceService.UpdatePurchaseInvoice(action.payload)
        .map(response => this.UpdatePurchaseInvoiceResponse(response));
    });

  @Effect()
  private UpdatePurchaseInvoiceResponse$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE_RESPONSE)
    .map(response => {
      let data: BaseResponse<IInvoicePurchaseResponse, string> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Purchase Invoice Updated Successfully.');
      }
      return { type: '' };
    });

  @Effect()
  private DownloadGSTR1Sheet$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET)
    .switchMap(action => {
      return this.purchaseInvoiceService.DownloadGSTR1Sheet(action.payload.month, action.payload.gstNumber)
        .map(response => this.DownloadGSTR1SheetResponse(response));
    });

  @Effect()
  private DownloadGSTR1SheetResponse$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET_RESPONSE)
    .map(response => {
      let data: BaseResponse<any, string> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.downloadFile(data.body, data.queryString.month, data.queryString.gstNumber);
        this.toasty.successToast('GSTR1 Sheet Downloaded Successfully.');
      }
      return { type: '' };
    });

  @Effect()
  private DownloadGSTR1ErrorSheet$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET)
    .switchMap(action => {
      return this.purchaseInvoiceService.DownloadGSTR1ErrorSheet(action.payload.month, action.payload.gstNumber)
        .map(response => this.DownloadGSTR1SheetResponse(response));
    });

  @Effect()
  private DownloadGSTR1ErrorSheetResponse$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET_RESPONSE)
    .map(response => {
      let data: BaseResponse<any, string> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        // this.downloadFile(data.body, data.queryString.month, data.queryString.gstNumber);
        this.toasty.successToast('GSTR1 Error Sheet Downloaded Successfully.');
      }
      return { type: '' };
    });

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

  public downloadFile(data: Response, month: string, gstNumber: string) {
    let blob = this.base64ToBlob(data, 'application/xls', 512);
    return saveAs(blob, `GSTR1-Sheet-${month}-${gstNumber}.xls`);
  }

  public GetPurchaseInvoices(): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES
    };
  }

  public UpdatePurchaseInvoice(model: IInvoicePurchaseResponse): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE,
      payload: model
    };
  }

  public UpdatePurchaseInvoiceResponse(value: BaseResponse<IInvoicePurchaseResponse, string>): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE_RESPONSE,
      payload: value
    };
  }

  public DownloadGSTR1Sheet(month: string, gstNumber: string): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET,
      payload: { month, gstNumber }
    };
  }

  public DownloadGSTR1SheetResponse(value: BaseResponse<any, string>): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET_RESPONSE,
      payload: value
    };
  }

  public DownloadGSTR1ErrorSheet(month: string, gstNumber: string): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET,
      payload: { month, gstNumber }
    };
  }

  public DownloadGSTR1ErrorSheetResponse(value: BaseResponse<any, string>): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET_RESPONSE,
      payload: value
    };
  }

  public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = { type: '' }): Action {
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
