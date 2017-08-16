
import { Template } from '../models/api-models/invoice';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { INVOICE_API } from './apiurls/invoice';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { map } from 'rxjs/operator/map';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { HandleCatch } from './catchManager/catchmanger';

@Injectable()
export class InvoiceTemplatesService {
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
    return this._http.get(INVOICE_API.GET_USER_TEMPLATES.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
      let data: Template = res.json();
      return data;
    }).catch((e) => HandleCatch<Template, string>(e));
  }
  public getTopMargin(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.topMargin);
  }

  public getBottomMargin(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.bottomMargin);
  }

  public getLeftMargin(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.leftMargin);
  }

  public getRightMargin(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.rightMargin);
  }

  public getFontFamily(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.fontFamily);
  }

  public getCompanyName(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.companyName);
  }

  public getGSTIN(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.GSTIN);
  }

  public getPAN(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.PAN);
  }

  public getAddress(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.address);
  }

  public getInvoiceDate(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.invoiceDate);
  }

  public getInvoiceNo(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.invoiceNumber);
  }

  public getShippingDate(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.shippingDate);
  }

  public getShippingNo(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.shippingNo);
  }

  public getTrackingDate(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.trackingDate);
  }

  public getTrackingNumber(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.trackingNumber);
  }

  public getCustomerName(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.customerName);
  }

  public getCustomerEmail(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.customerEmail);
  }

  public getCustomerMobileNo(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.customerMobileNumber);
  }

  public getDueDate(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.dueDate);
  }

  public getBillingAddress(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.billingAddress);
  }

  public getBillingState(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.billingState);
  }

  public getBillingGSTIN(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.billingGstin);
  }

  public getShippingAddress(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.shippingAddress);
  }

  public getShippingState(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.shippingDate);
  }

  public getShippingGSTIN(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.shippinGstin);
  }

  public getCustomField1(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.customField1);
  }

  public getCustomField2(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.customField2);
  }

  public getCustomField3(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.customField3);
  }

  public getFormNameInvoice(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.formNameInvoice);
  }

  public getFormNameTaxInvoice(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.formNameTaxInvoice);
  }

  public getSnoLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.formNameTaxInvoice);
  }

  public getDateLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.dateLabel);
  }

  public getItemLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.itemLabel);
  }

  public getHsnSacLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.hsnSacLabel);
  }

  public getItemCodeLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.itemCodeLabel);
  }

  public getDescLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.descLabel);
  }

  public getRateLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.rateLabel);
  }

  public getDiscountLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.discountLabel);
  }

  public getTotalLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.totalLabel);
  }

  public getTaxableValueLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.taxableValueLabel);
  }

  public getTaxLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.taxLabel);
  }

  public getQuantityLabel(): Observable<string> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.quantityLabel);
  }

  public getQuantityWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.quantityWidth);
  }

  public getTaxWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.taxWidth);
  }

  public getTaxableValueWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.taxableValueWidth);
  }

  public getTotalWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.totalWidth);
  }

  public getDiscountWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.discountWidth);
  }

  public getRateWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.rateWidth);
  }

  public getDescWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.descWidth);
  }

  public getItemCodeWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.itemCodeWidth);
  }

  public getHsnSaceWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.hsnSacWidth);
  }

  public getItemWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.itemWidth);
  }

  public getDateWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.dateWidth);
  }

  public getSnoWidth(): Observable<number> {
    return this.store.select((state: AppState) => state.invoice.templates.templateMetaData.sNoWidth);
  }
}
