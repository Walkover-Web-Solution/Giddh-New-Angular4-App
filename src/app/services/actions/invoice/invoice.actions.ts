import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { InvoiceService } from '../../invoice.service';
import { AppState } from '../../../store/roots';
import { INVOICE_ACTIONS } from './invoice.const';
import { ToasterService } from '../../toaster.service';
import { Router } from '@angular/router';
import { GetAllInvoicesResponse, CommonPaginatedRequest } from '../../../models/api-models/Invoice';

@Injectable()
export class InvoiceActions {

  // GET All Invoices

  // private GetAllInvoices$: Observable<Action> = this.action$
  //   .ofType(INVOICE_ACTIONS.GET_ALL_INVOICES)
  //   .switchMap(action => this._invoiceService.GetAllInvoices(action.payload))
  //   .map(response => {
  //     return this.GetAllInvoicesResponse(response);
  //   });

  // @Effect()
  // private GetAllInvoicesResponse$: Observable<Action> = this.action$
  //   .ofType(INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE)
  //   .map(response => {
  //     return { type : ''};
  //   });

  // CREATE MANUFACTURING ITEM
  // @Effect()
  // private CreateMFItem$: Observable<Action> = this.action$
  //   .ofType(MANUFACTURING_ACTIONS.CREATE_MF_ITEM)
  //   .switchMap(action => {
  //     return this._invoiceService.CreateManufacturingItem(action.payload, action.payload.stockUniqueName)
  //       .map(response => this.CreateMfItemResponse(response));
  //   });

  // @Effect()
  // private CreateMFItemResponse$: Observable<Action> = this.action$
  //   .ofType(MANUFACTURING_ACTIONS.CREATE_MF_ITEM_RESPONSE)
  //   .map(response => {
  //     let data: BaseResponse<ICommonResponseOfManufactureItem, ICommonResponseOfManufactureItem> = response.payload;
  //     if (data.status === 'error') {
  //       this._toasty.errorToast(data.message, data.code);
  //     } else {
  //       this._toasty.successToast('Manufacturing Entry Created Successfully');
  //       this._router.navigate(['/pages', 'manufacturing', 'report']);
  //     }
  //     return { type: '' };
  //   });

  constructor(
    private action$: Actions,
    private _invoiceService: InvoiceService,
    private _toasty: ToasterService,
    private _router: Router
) {}

  public GetAllInvoices(value: string): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_INVOICES,
      payload: { stockUniqueName: value }
    };
  }

  public GetAllInvoicesResponse(value: BaseResponse<GetAllInvoicesResponse, CommonPaginatedRequest>): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE,
      payload: value
    };
  }

  public GetAllLedgersForInvoice(value): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE,
      payload: value
    };
  }

  public GetAllLedgersForInvoiceResponse(value): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
      payload: value
    };
  }
}
