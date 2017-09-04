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

  constructor(private action$: Actions,
    private toasty: ToasterService,
    private router: Router,
    private store: Store<AppState>,
    private purchaseInvoiceService: PurchaseInvoiceService) {
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

  public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = {type: ''}): Action {
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
