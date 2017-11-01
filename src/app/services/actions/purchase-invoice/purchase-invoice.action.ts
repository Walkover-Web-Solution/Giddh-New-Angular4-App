import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { SETTINGS_PROFILE_ACTIONS } from './settings.profile.const';
import { SettingsProfileService } from '../../../settings.profile.service';
import { SmsKeyClass } from '../../../../models/api-models/SettingsIntegraion';
import { PURCHASE_INVOICE_ACTIONS } from './purchase-invoice.const';
import { PurchaseInvoiceService, IInvoicePurchaseResponse, ITaxResponse, IInvoicePurchaseItem } from '../../purchase-invoice.service';
import { ToasterService } from '../../toaster.service';
import { AppState } from '../../../store/roots';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { saveAs } from 'file-saver';
import { CommonPaginatedRequest } from '../../../models/api-models/Invoice';

@Injectable()
export class InvoicePurchaseActions {

  @Effect()
  public GetPurchaseInvoices$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES)
    .switchMap(action => this.purchaseInvoiceService.GetPurchaseInvoice(action.payload))
    .map(res => this.validateResponse<IInvoicePurchaseResponse, string>(res, {
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
      console.log('Effect CAlled');
      return this.purchaseInvoiceService.UpdatePurchaseInvoice(action.payload.entryUniqueName, action.payload.taxUniqueName, action.payload.accountUniqueName)
        .map(response => this.UpdatePurchaseInvoiceResponse(response));
    });

  @Effect()
  public GetTaxesForThisCompany$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.GET_TAXES)
    .switchMap(action => this.purchaseInvoiceService.GetTaxesForThisCompany())
    .map(res => this.validateResponse<ITaxResponse[], string>(res, {
      type: PURCHASE_INVOICE_ACTIONS.SET_TAXES_FOR_COMPANY,
      payload: res
    }, true, {
        type: PURCHASE_INVOICE_ACTIONS.SET_TAXES_FOR_COMPANY,
        payload: res
      }));

  @Effect()
  public GeneratePurchaseInvoice$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.GENERATE_PURCHASE_INVOICE)
    .switchMap(action => {
      return this.purchaseInvoiceService.GeneratePurchaseInvoice(action.payload)
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
      return this.purchaseInvoiceService.DownloadGSTR1Sheet(action.payload)
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
        this.downloadFile(data.body, data.queryString.reqObj.month, data.queryString.reqObj.gstNumber, data.queryString.reqObj.type);
        this.toasty.successToast('Sheet Downloaded Successfully.');
      }
      return { type: '' };
    });

  @Effect()
  private DownloadGSTR1ErrorSheet$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET)
    .switchMap(action => {
      return this.purchaseInvoiceService.DownloadGSTR1ErrorSheet(action.payload)
        .map(response => this.DownloadGSTR1ErrorSheetResponse(response));
    });

  @Effect()
  private DownloadGSTR1ErrorSheetResponse$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET_RESPONSE)
    .map(response => {
      let data: BaseResponse<any, string> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.downloadFile(data.body, data.queryString.reqObj.month, data.queryString.reqObj.gstNumber, data.queryString.reqObj.gstNumber);
        this.toasty.successToast('Error Sheet Downloaded Successfully.');
      }
      return { type: '' };
    });

  /**
   * UPDATE PURCHASE ENTRY
   */
  @Effect()
  private UpdatePurchaseEntry$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_ENTRY)
    .switchMap(action => {
      return this.purchaseInvoiceService.UpdatePurchaseEntry(action.payload)
        .map(response => this.UpdatePurchaseEntryResponse(response));
    });

  /**
   * UPDATE PURCHASE ENTRY RESPONSE
   */
  @Effect()
  private UpdatePurchaseEntryResponse$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_ENTRY_RESPONSE)
    .map(response => {
      let data: BaseResponse<IInvoicePurchaseResponse, string> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Entry Updated Successfully.');
      }
      return { type: '' };
    });

  /**
   * UPDATE INVOICE
   */
  @Effect()
  private UpdateInvoice$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_INVOICE)
    .switchMap(action => {
      return this.purchaseInvoiceService.UpdateInvoice(action.payload)
        .map(response => this.UpdateInvoiceResponse(response));
    });

  /**
   * UPDATE PURCHASE ENTRY RESPONSE
   */
  @Effect()
  private UpdateInvoiceResponse$: Observable<Action> = this.action$
    .ofType(PURCHASE_INVOICE_ACTIONS.UPDATE_INVOICE_RESPONSE)
    .map(response => {
      let data: BaseResponse<IInvoicePurchaseResponse, string> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Entry Updated Successfully.');
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

  public downloadFile(data: Response, month: string, gstNumber: string, type: string) {
    let blob = this.base64ToBlob(data, 'application/xls', 512);
    return saveAs(blob, `${type}-${month}-${gstNumber}.xlsx`);
    // if (type === 'gstr1_sheet') {
    //   return saveAs(blob, `${type}-${month}-${gstNumber}.xlsx`);
    // } else if (type === 'error_sheet') {
    //   return saveAs(blob, `${type}-${month}-${gstNumber}.xlsx`);
    // }
  }

  public GetPurchaseInvoices(model: CommonPaginatedRequest): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES,
      payload: model
    };
  }

  public UpdatePurchaseInvoice(entryUniqueName: string[], taxUniqueName: string[], accountUniqueName: string): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE,
      payload: { entryUniqueName, taxUniqueName, accountUniqueName }
    };
  }

  public GetTaxesForThisCompany(): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.GET_TAXES
    };
  }

  public GeneratePurchaseInvoice(model: IInvoicePurchaseItem): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.GENERATE_PURCHASE_INVOICE,
      payload: model
    };
  }

  public UpdatePurchaseInvoiceResponse(value: BaseResponse<IInvoicePurchaseItem, string>): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE_RESPONSE,
      payload: value
    };
  }

  public DownloadGSTR1Sheet(month: string, gstNumber: string, type: string): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET,
      payload: { month, gstNumber, type }
    };
  }

  public DownloadGSTR1SheetResponse(value: BaseResponse<any, string>): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET_RESPONSE,
      payload: value
    };
  }

  public DownloadGSTR1ErrorSheet(month: string, gstNumber: string, type: string): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET,
      payload: { month, gstNumber, type }
    };
  }

  public DownloadGSTR1ErrorSheetResponse(value: BaseResponse<any, string>): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET_RESPONSE,
      payload: value
    };
  }

  public UpdatePurchaseEntry(model): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.UPDATE_ENTRY,
      payload: model
    };
  }

  public UpdatePurchaseEntryResponse(response): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.UPDATE_ENTRY_RESPONSE,
      payload: response
    };
  }

  public UpdateInvoice(model): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.UPDATE_INVOICE,
      payload: model
    };
  }

  public UpdateInvoiceResponse(response): Action {
    return {
      type: PURCHASE_INVOICE_ACTIONS.UPDATE_INVOICE_RESPONSE,
      payload: response
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
