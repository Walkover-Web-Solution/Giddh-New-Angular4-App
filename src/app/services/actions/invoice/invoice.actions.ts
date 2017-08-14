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
import { IGetAllInvoicesResponse, CommonPaginatedRequest, GetAllLedgersForInvoiceResponse, InvoiceFilterClass } from '../../../models/api-models/Invoice';

// The error is resolved
// Reference: https://stackoverflow.com/questions/44938803/error-with-actions-observable-in-ngrx-effects-using-typescript-2-4-1
// This error is due to Typescript version.

// import { Operator } from 'rxjs/Operator';
// declare module '@ngrx/effects/src/actions' {
//     interface Actions {
//         lift<R>(operator: Operator<Action, R>): Observable<R>;
//     }
// }

@Injectable()
export class InvoiceActions {

  // GET All Invoices
  @Effect()
  public GetAllInvoices$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GET_ALL_INVOICES)
    .switchMap(action => this._invoiceService.GetAllInvoices(action.payload))
    .map(response => {
      return this.GetAllInvoicesResponse(response);
    });

  @Effect()
  public GetAllInvoicesResponse$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE)
    .map(response => {
      return { type : ''};
    });

  // get all ledgers for invoice
  @Effect()
  public GetAllLedgersForInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE)
    .switchMap(action => this._invoiceService.GetAllLedgersForInvoice(action.payload.model, action.payload.body))
    .map(res => this.validateResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>(res, {
      type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
      payload: res
    }, true, {
      type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
      payload: res
    }));

  // Generate Bulk Invoice
  @Effect()
  public GenerateBulkInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GENERATE_BULK_INVOICE)
    .switchMap(action => this._invoiceService.GenerateBulkInvoice(action.payload.model, action.payload.data))
    .map(response => {
      return this.GenerateBulkInvoiceResponse(response);
    });

  @Effect()
  public GenerateBulkInvoiceResponse$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE)
    .map(response => {
      return { type : ''};
    });

  // Action On Invoice
  @Effect()
  public ActionOnInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.ACTION_ON_INVOICE)
    .switchMap(action => this._invoiceService.PerformActionOnInvoice(action.payload))
    .map(response => {
      return this.ActionOnInvoiceResponse(response);
    });

  @Effect()
  public ActionOnInvoiceResponse$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE)
    .map(response => {
      return { type : ''};
    });

  // Get Template
  @Effect()
  public GetTemplte$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GET_TEMPLATE)
    .switchMap(action => this._invoiceService.GetTemplate())
    .map(response => {
      return this.GetTemplateResponse(response);
    });

  @Effect()
  public GetTemplteResponse$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GET_TEMPLATE_RESPONSE)
    .map(response => {
      return { type : ''};
    });

  // Send Mail
  @Effect()
  public SendMail$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.SEND_MAIL)
    .switchMap(action => this._invoiceService.SendMail(action.payload))
    .map(response => {
      return this.SendMailResponse(response);
    });

  @Effect()
  public SendMailResponse$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.SEND_MAIL_RESPONSE)
    .map(response => {
      return { type : ''};
    });

  // Preview and Generate Invoice
  @Effect()
  public PreviewAndGenerateInvoive$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.PREVIEW_AND_GENERATE_INVOICE)
    .switchMap(action => this._invoiceService.PreviewAndGenerateInvoice(action.payload))
    .map(response => {
      return this.PreviewAndGenerateInvoiceResponse(response);
    });

  @Effect()
  public PreviewAndGenerateInvoiceResponse$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.PREVIEW_AND_GENERATE_INVOICE_RESPONSE)
    .map(response => {
      return { type : ''};
    });

  constructor(
    private action$: Actions,
    private _invoiceService: InvoiceService,
    private _toasty: ToasterService,
    private _router: Router
) {}

  public GetAllInvoices(model: CommonPaginatedRequest): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_INVOICES,
      payload: model
    };
  }

  public GetAllInvoicesResponse(model: BaseResponse<IGetAllInvoicesResponse, CommonPaginatedRequest>): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE,
      payload: model
    };
  }

  public GetAllLedgersForInvoice(model: CommonPaginatedRequest, data: InvoiceFilterClass): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE,
      payload: {model, body: data}
    };
  }

  public GetAllLedgersForInvoiceResponse(model: GetAllLedgersForInvoiceResponse): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
      payload: model
    };
  }

  public GenerateBulkInvoice(model: any, data: any): Action {
    return {
      type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE,
      payload: {model, body: data}
    };
  }

  public GenerateBulkInvoiceResponse(model: any): Action {
    return {
      type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE,
      payload: model
    };
  }

  public ActionOnInvoice(model: any): Action {
    return {
      type: INVOICE_ACTIONS.ACTION_ON_INVOICE,
      payload: model
    };
  }

  public ActionOnInvoiceResponse(model: any): Action {
    return {
      type: INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE,
      payload: model
    };
  }

  public GetTemplate(): Action {
    return {
      type: INVOICE_ACTIONS.GET_TEMPLATE
    };
  }

  public GetTemplateResponse(model: any): Action {
    return {
      type: INVOICE_ACTIONS.GET_TEMPLATE_RESPONSE,
      payload: model
    };
  }

  public SendMail(model: any): Action {
    return {
      type: INVOICE_ACTIONS.SEND_MAIL,
      payload: model
    };
  }

  public SendMailResponse(model: any): Action {
    return {
      type: INVOICE_ACTIONS.SEND_MAIL_RESPONSE,
      payload: model
    };
  }

  public PreviewAndGenerateInvoice(model: any): Action {
    return {
      type: INVOICE_ACTIONS.PREVIEW_AND_GENERATE_INVOICE,
      payload: model
    };
  }

  public PreviewAndGenerateInvoiceResponse(model: any): Action {
    return {
      type: INVOICE_ACTIONS.PREVIEW_AND_GENERATE_INVOICE_RESPONSE,
      payload: model
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = {type: ''}): Action {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    } else {
      if (showToast && typeof response.body === 'string') {
        this._toasty.successToast(response.body);
      }
    }
    return successAction;
  }
}
