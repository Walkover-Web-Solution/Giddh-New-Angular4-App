import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { InvoiceService } from '../../invoice.service';
import { InvoiceTemplatesService } from '../../invoice.templates.service';
import { AppState } from '../../../store/roots';
import { INVOICE_ACTIONS, INVOICE } from './invoice.const';
import { ToasterService } from '../../toaster.service';
import { Router } from '@angular/router';
import {
  IGetAllInvoicesResponse,
  CommonPaginatedRequest,
  GetAllLedgersForInvoiceResponse,
  InvoiceFilterClass,
  PreviewAndGenerateInvoiceRequest,
  PreviewAndGenerateInvoiceResponse,
  GetInvoiceTemplateDetailsResponse,
  Template
} from '../../../models/api-models/Invoice';
import {Font} from "ngx-font-picker";
import {TaxInvoiceLabel} from "../../../invoice/templates/edit-template/filters-container/content-filters/content.filters.component";
// import {Section, Template} from "../../../models/api-models/invoice";

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

  // Preview and Generate Invoice
  @Effect()
  public PreviewInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.PREVIEW_INVOICE)
    .switchMap(action => this._invoiceService.PreviewInvoice(action.payload.accountUniqueName, action.payload.body))
    .map(res => this.validateResponse<PreviewAndGenerateInvoiceResponse, PreviewAndGenerateInvoiceRequest>(res, {
      type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
      payload: res
    }, true, {
      type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
      payload: res
    }));

  // get template details of invoice
  @Effect()
  public GetTemplateDetailsOfInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS)
    .switchMap(action => this._invoiceService.GetInvoiceTemplateDetails(action.payload))
    .map(res => this.validateResponse<GetInvoiceTemplateDetailsResponse, string>(res, {
      type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
      payload: res
    }, true, {
      type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
      payload: res
    }));

  // write above except kunal
  // get all templates
  @Effect()
  public GetUserTemplates$ = this.action$
    .ofType(INVOICE.TEMPLATE.GET_USER_TEMPLATES)
    .switchMap(action => this._invoiceTemplatesService.getTemplates())
    .map((response: Template) => {
      return this.setTemplateState(response);
    });

  constructor(
    private action$: Actions,
    private _invoiceService: InvoiceService,
    private _invoiceTemplatesService: InvoiceTemplatesService,
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

  public PreviewInvoice(accountUniqueName: string, model: PreviewAndGenerateInvoiceRequest): Action {
    return {
      type: INVOICE_ACTIONS.PREVIEW_INVOICE,
      payload: {accountUniqueName, body: model}
    };
  }

  public PreviewInvoiceResponse(model: PreviewAndGenerateInvoiceResponse): Action {
    return {
      type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
      payload: model
    };
  }

  public GetTemplateDetailsOfInvoice(model: string): Action {
    return {
      type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS,
      payload: model
    };
  }

  public GetTemplateDetailsOfInvoiceResponse(model: BaseResponse<GetInvoiceTemplateDetailsResponse, string>): Action {
    return {
      type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
      payload: model
    };
  }

  public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = {type: ''}): Action {
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

  public setTemplateData(section: any) {
    return {
      payload: section,
      type: INVOICE.TEMPLATE.SET_TEMPLATE_DATA
    };
  }

  public getTemplateState(): Action {
    return {
      type: INVOICE.TEMPLATE.GET_USER_TEMPLATES
    };
  }

  public getCurrentTemplateSate(uniqueName: string): Action {
    return {
      payload: uniqueName,
      type: INVOICE.TEMPLATE.GET_CURRENT_TEMPLATE
    };
  }

  public setTemplateState(temp: Template): Action {
    return {
      type: INVOICE.TEMPLATE.SET_TEMPLATE_STATE,
      payload: {temp}
    };
  }

  public setTemplateId(id: string): Action {
    return {
      type: INVOICE.TEMPLATE.SELECT_TEMPLATE,
      payload: {id}
    };
  }
  public setFont(font: string): Action {
  return {
  type: INVOICE.TEMPLATE.SET_FONT,
  payload: {font}
 };
}
  public setColor(color: string): Action {
    return {
      type: INVOICE.TEMPLATE.SET_COLOR,
      payload: {color}
    };
  }
  public updateGSTIN(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_GSTIN,
      payload: {data}
    };
  }

  public updatePAN(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_PAN,
      payload: {data}
    };
  }

  public update(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_PAN,
      payload: {data}
    };
  }

  public setColumnWidth(width: number, colName: string): Action {
    return {
      type: INVOICE.CONTENT.SET_COLUMN_WIDTH,
      payload: {width, colName}
    };

  }

  public updateInvoiceDate(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_INVOICE_DATE,
      payload: {data}
    };
  }

  public updateInvoiceNo(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_INVOICE_NO,
      payload: {data}
    };
  }

  public updateShippingDate(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_DATE,
      payload: {data}
    };
  }

  public updateShippingNo(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_NO,
      payload: {data}
    };
  }

  public updateShippingVia(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_VIA,
      payload: {data}
    };
  }

  public updateTrackingDate(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TRACKING_DATE,
      payload: {data}
    };
  }

  public updateTrackingNo(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TRACKING_NO,
      payload: {data}
    };
  }

  public updateCustomerName(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOMER_NAME,
      payload: {data}
    };
  }

  public updateCustomerEmail(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOMER_EMAIL,
      payload: {data}
    };
  }

  public updateCustomerMobileNo(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOMER_MOBILE_NO,
      payload: {data}
    };
  }

  public updateDueDate(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_DUE_DATE,
      payload: {data}
    };
  }

  public updateBillingState(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_BILLING_STATE,
      payload: {data}
    };
  }

  public updateBillingAddress(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_BILLING_ADDRESS,
      payload: {data}
    };
  }

  public updateBillingGSTIN(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_BILLING_GSTIN,
      payload: {data}
    };
  }

  public updateShippingState(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_STATE,
      payload: {data}
    };
  }

  public updateShippingAddress(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_ADDRESS,
      payload: {data}
    };
  }

  public updateShippingGSTIN(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_GSTIN,
      payload: {data}
    };
  }

  public updateCustomField1(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_1,
      payload: {data}
    };
  }

  public updateCustomField2(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_2,
      payload: {data}
    };
  }

  public updateCustomField3(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_3,
      payload: {data}
    };
  }

  public updateFormNameInvoice(ti: TaxInvoiceLabel): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_FORM_NAME_INVOICE,
      payload: {ti}
    };
  }

  public updateFormNameTaxInvoice(ti: TaxInvoiceLabel): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_FORM_NAME_TAX_INVOICE,
      payload: {ti}
    };
  }

  public updateSnoLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SNOLABEL,
      payload: {data}
    };
  }

  public updateDateLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_DATE_LABEL,
      payload: {data}
    };
  }

  public updateItemLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_ITEM_LABEL,
      payload: {data}
    };
  }

  public updateHsnSacLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_HSNSAC_LABEL,
      payload: {data}
    };
  }

  public updateItemCodeLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_ITEM_CODE_LABEL,
      payload: {data}
    };
  }

  public updateDescLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_DESC_LABEL,
      payload: {data}
    };
  }

  public updateRateLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_RATE_LABEL,
      payload: {data}
    };
  }

  public updateDiscountLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_DISCOUNT_LABEL,
      payload: {data}
    };
  }

  public updateTaxableValueLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TAXABLE_VALUE_LABEL,
      payload: {data}
    };
  }

  public updateTaxLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TAX_LABEL,
      payload: {data}
    };
  }

  public updateTotalLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TOTAL_LABEL,
      payload: {data}
    };
  }

  public updateQuantityLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_QUANTITY_LABEL,
      payload: {data}
    };
  }

  public setTopPageMargin(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TOP_MARGIN,
      payload: {data}
    };
  }

  public setLeftPageMargin(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_LEFT_MARGIN,
      payload: {data}
    };
  }

  public setBottomPageMargin(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_BOTTOM_MARGIN,
      payload: {data}
    };
  }

  public setRightPageMargin(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_RIGHT_MARGIN,
      payload: {data}
    };
  }

  public updateMessage1(data: string): Action {
    return{
      type: INVOICE.TEMPLATE.UPDATE_MESSAGE1,
      payload: {data}
    };
  }

  public updateMessage2(data: string): Action {
    return{
      type: INVOICE.TEMPLATE.UPDATE_MESSAGE2,
      payload: {data}
    };
  }
}
