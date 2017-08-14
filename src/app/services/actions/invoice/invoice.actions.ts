import { INVOICE } from './invoice.const';
import {Action, Store} from '@ngrx/store';
import { Injectable } from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import {InvoiceService} from "../../invoice.services";
import {AppState} from "../../../store/roots";
import {Router} from "@angular/router";
import {ToasterService} from "../../toaster.service";
import {Section, Template} from "../../../models/api-models/invoice";
@Injectable()
export class InvoiceAction {
  @Effect()
  public GetUserTemplates$ = this.action$
    .ofType(INVOICE.TEMPLATE.GET_USER_TEMPLATES)
    .switchMap(action => this._invoiceService.getTemplates())
    .map((response: Template) => {
      console.log('API Response', response);
      // console.log('TEMPLATE BODY', response.body);
      return this.setTemplateState(response);
      // console.log('GET_USER_TEMPLATE effect callee');
      // this.store.dispatch(this.setTemplateState());
    });

  constructor(private store: Store<AppState>, private _invoiceService: InvoiceService, private action$: Actions,
              private _toasty: ToasterService, private router: Router) {
  }

  public setTemplateData(section: any) {
    // console.log('DATA', section );
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

  public updateFormNameInvoice(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_FORM_NAME_INVOICE,
      payload: {data}
    };
  }

  public updateFormNameTaxInvoice(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_FORM_NAME_TAX_INVOICE,
      payload: {data}
    };
  }

  public updateSnoWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SNOWIDTH,
      payload: {data}
    };
  }

  public updateDateWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_DATE_WIDTH,
      payload: {data}
    };
  }

  public updateItemWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_ITEM_WIDTH,
      payload: {data}
    };
  }

  public updateHsnSacWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_HSNSAC_WIDTH,
      payload: {data}
    };
  }

  public updateItemCodeWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_ITEM_CODE_WIDTH,
      payload: {data}
    };
  }

  public updateDescWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_DESC_WIDTH,
      payload: {data}
    };
  }

  public updateRateWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_RATE_WIDTH,
      payload: {data}
    };
  }

  public updateDiscountWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_DISCOUNT_WIDTH,
      payload: {data}
    };
  }

  public updateTaxableValueWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TAXABLE_VALUE_WIDTH,
      payload: {data}
    };
  }

  public updateTaxWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TAX_WIDTH,
      payload: {data}
    };
  }

  public updateTotalWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TOTAL_WIDTH,
      payload: {data}
    };
  }

  public updateQuantityWidth(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_QUANTITY_WIDTH,
      payload: {data}
    };
  }
  public setTopPageMargin(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TOP_MARGIN,
      payload: {data}
    };
  }
  public setLeftPageMargin(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_LEFT_MARGIN,
      payload: {data}
    };
  }
  public setBottomPageMargin(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_BOTTOM_MARGIN,
      payload: {data}
    };
  }


  public setRightPageMargin(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_RIGHT_MARGIN,
      payload: {data}
    };
  }

}

