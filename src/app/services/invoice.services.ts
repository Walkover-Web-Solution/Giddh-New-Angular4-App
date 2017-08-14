
import { Template } from '../models/api-models/invoice';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import {INVOICE_API} from "./apiurls/invoice";
import {HttpWrapperService} from "./httpWrapper.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../store/roots";
import {map} from "rxjs/operator/map";
import {BaseResponse} from "../models/api-models/BaseResponse";
import {UserDetails} from "../models/api-models/loginModels";
import {HandleCatch} from "./catchManager/catchmanger";

@Injectable()
export class InvoiceService {
  private companyUniqueName: string;
  private user: UserDetails;
  constructor(public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {
  }

  public getTemplates(): Observable<Template> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    console.log('companyName', this.companyUniqueName);
    return this._http.get(INVOICE_API.GET_USER_TEMPLATES.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
      let data: Template = res.json();
      return data;
    }).catch((e) => HandleCatch<Template, string>(e));
  }
  public getTopMargin(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.topMargin);
  }

  public getBottomMargin(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.bottomMargin);
  }

  public getLeftMargin(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.leftMargin);
  }

  public getRightMargin(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.rightMargin);
  }

  public getFontFamily(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.fontFamily);
  }

  public getCompanyName(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.companyName);
  }

  public getGSTIN(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.GSTIN);
  }

  public getPAN(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.PAN);
  }

  public getAddress(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.address);
  }

  public getInvoiceDate(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.invoiceDate);
  }

  public getInvoiceNo(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.invoiceNumber);
  }

  public getShippingDate(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.shippingDate);
  }


  public getShippingNo(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.shippingNo);
  }

  public getTrackingDate(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.trackingDate);
  }

  public getTrackingNumber(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.trackingNumber);
  }

  public getCustomerName(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.customerName);
  }

  public getCustomerEmail(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.customerEmail);
  }

  public getCustomerMobileNo(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.customerMobileNumber);
  }

  public getDueDate(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.dueDate);
  }

  public getBillingAddress(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.billingAddress);
  }

  public getBillingState(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.billingState);
  }

  public getBillingGSTIN(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.billingGstin);
  }

  public getShippingAddress(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.shippingAddress);
  }

  public getShippingState(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.shippingDate);
  }

  public getShippingGSTIN(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.shippinGstin);
  }

  public getCustomField1(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.customField1);
  }

  public getCustomField2(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.customField2);
  }

  public getCustomField3(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.customField3);
  }

  public getFormNameInvoice(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.formNameInvoice);
  }

  public getFormNameTaxInvoice(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.formNameTaxInvoice);
  }

  public getSnoLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.formNameTaxInvoice);
  }

  public getDateLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.dateLabel);
  }

  public getItemLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.itemLabel);
  }

  public getHsnSacLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.hsnSacLabel);
  }

  public getItemCodeLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.itemCodeLabel);
  }

  public getDescLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.descLabel);
  }

  public getRateLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.rateLabel);
  }

  public getDiscountLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.discountLabel);
  }

  public getTotalLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.totalLabel);
  }

  public getTaxableValueLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.taxableValueLabel);
  }

  public getTaxLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.taxLabel);
  }

  public getQuantityLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.quantityLabel);
  }

  public getQuantityWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.quantityWidth);
  }

  public getTaxWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.taxWidth);
  }

  public getTaxableValueWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.taxableValueWidth);
  }

  public getTotalWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.totalWidth);
  }

  public getDiscountWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.discountWidth);
  }

  public getRateWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.rateWidth);
  }

  public getDescWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.descWidth);
  }

  public getItemCodeWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.itemCodeWidth);
  }

  public getHsnSaceWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.hsnSacWidth);
  }

  public getItemWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.itemWidth);
  }

  public getDateWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.dateWidth);
  }

  public getSnoWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templateMeta.sNoWidth);
  }
}
