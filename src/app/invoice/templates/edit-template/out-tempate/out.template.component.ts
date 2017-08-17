import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import ownKeys = Reflect.ownKeys;
import { NgStyle } from '@angular/common';
import { InvoiceActions } from '../../../../services/actions/invoice/invoice.actions';
import * as _ from 'lodash';
import { InvoiceTemplatesService } from '../../../../services/invoice.templates.service';
import { ISection } from '../../../../models/api-models/Invoice';

@Component({
  selector: 'invoice-template',
  templateUrl: 'out.template.component.html',
  styleUrls: ['out.template.component.css']
})

export class OutTemplateComponent implements OnInit {
  @Input() public templateId: string;
  @Input() public templateSections: ISection[];
  public companyName$: Observable<string>;
  public GSTIN$: Observable<string>;
  public PAN$: Observable<string>;
  public address$: Observable<string>;
  public invoiceDate$: Observable<string>;
  public invoiceNo$: Observable<string>;
  public shippingDate$: Observable<string>;
  public shippingNo$: Observable<string>;
  public trackingDate$: Observable<string>;
  public trackingNo$: Observable<string>;
  public customeName$: Observable<string>;
  public customeEmail$: Observable<string>;
  public customerMobileNo$: Observable<string>;
  public dueDate$: Observable<string>;
  public billingState$: Observable<string>;
  public billingAddress$: Observable<string>;
  public billingGSTIN$: Observable<string>;
  public shippingState$: Observable<string>;
  public shippingAddress$: Observable<string>;
  public shippingGSTIN$: Observable<string>;
  public customField1$: Observable<string>;
  public customField2$: Observable<string>;
  public customField3$: Observable<string>;
  public formNameInvoice$: Observable<string>;
  public formNameTaxInvoice$: Observable<string>;
  public sNoLabel$: Observable<string>;
  public sNoWidth$: Observable<number>;
  public dateLabel$: Observable<string>;
  public dateWidth$: Observable<number>;
  public itemLabel$: Observable<string>;
  public itemWidth$: Observable<number>;
  public hsnSacLabel$: Observable<string>;
  public hsnSacWidth$: Observable<number>;
  public itemCodeLabel$: Observable<string>;
  public itemCodeWidth$: Observable<number>;
  public descLabel$: Observable<string>;
  public descWidth$: Observable<number>;
  public rateLabel$: Observable<string>;
  public rateWidth$: Observable<number>;
  public discountLabel$: Observable<string>;
  public discountWidth$: Observable<number>;
  public taxableValueLabel$: Observable<string>;
  public taxableValueWidth$: Observable<number>;
  public taxLabel$: Observable<string>;
  public taxWidth$: Observable<number>;
  public totalLabel$: Observable<string>;
  public totalWidth$: Observable<number>;
  public quantityLabel$: Observable<string>;
  public quantityWidth$: Observable<number>;
  public topMargin: number;
  public leftMargin: number;
  public bottomMargin: number;
  public rightMargin: number;
  public fontFamily: string;
  public value: string;
  public color: string;
  // public tableMeta$: Observable<TableMetaMap>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor( private store: Store<AppState>, private invoiceAction: InvoiceActions, private invoiceTemplatesService: InvoiceTemplatesService) {
    this.companyName$ = this.invoiceTemplatesService.getCompanyName();
    this.GSTIN$ = this.invoiceTemplatesService.getGSTIN();
    this.PAN$ = this.invoiceTemplatesService.getPAN();
    this.address$ = this.invoiceTemplatesService.getAddress();
    this.invoiceDate$ = this.invoiceTemplatesService.getInvoiceDate();
    this.invoiceNo$ = this.invoiceTemplatesService.getInvoiceNo();
    this.shippingDate$ = this.invoiceTemplatesService.getShippingDate();
    this.shippingNo$ = this.invoiceTemplatesService.getShippingNo();
    this.trackingDate$ = this.invoiceTemplatesService.getTrackingDate();
    this.trackingNo$ = this.invoiceTemplatesService.getTrackingNumber();
    this.customeName$ = this.invoiceTemplatesService.getCustomerName();
    this.customeEmail$ = this.invoiceTemplatesService.getCustomerEmail();
    this.customerMobileNo$ = this.invoiceTemplatesService.getCustomerMobileNo();
    this.dueDate$ = this.invoiceTemplatesService.getDueDate();
    this.billingAddress$ = this.invoiceTemplatesService.getBillingAddress();
    this.billingGSTIN$ = this.invoiceTemplatesService.getBillingGSTIN();
    this.billingState$ = this.invoiceTemplatesService.getBillingState();
    this.shippingAddress$ = this.invoiceTemplatesService.getShippingAddress();
    this.shippingGSTIN$ = this.invoiceTemplatesService.getShippingGSTIN();
    this.customField1$ = this.invoiceTemplatesService.getCustomField1();
    this.customField2$ = this.invoiceTemplatesService.getCustomField2();
    this.customField3$ = this.invoiceTemplatesService.getCustomField3();
    this.formNameInvoice$ = this.invoiceTemplatesService.getFormNameInvoice();
    this.formNameTaxInvoice$ = this.invoiceTemplatesService.getFormNameTaxInvoice();
    this.sNoLabel$ = this.invoiceTemplatesService.getSnoLabel();
    this.sNoWidth$ = this.invoiceTemplatesService.getSnoWidth();
    this.dateLabel$ = this.invoiceTemplatesService.getDateLabel();
    this.dateWidth$ = this.invoiceTemplatesService.getDateWidth();
    this.itemLabel$ = this.invoiceTemplatesService.getItemLabel();
    this.itemWidth$ = this.invoiceTemplatesService.getItemWidth();
    this.hsnSacLabel$ = this.invoiceTemplatesService.getHsnSacLabel();
    this.hsnSacWidth$ = this.invoiceTemplatesService.getHsnSaceWidth();
    this.itemCodeLabel$ = this.invoiceTemplatesService.getItemCodeLabel();
    this.itemCodeWidth$ = this.invoiceTemplatesService.getItemCodeWidth();
    this.descLabel$ = this.invoiceTemplatesService.getDescLabel();
    this.descWidth$ = this.invoiceTemplatesService.getDescWidth();
    this.rateLabel$ = this.invoiceTemplatesService.getRateLabel();
    this.rateWidth$ = this.invoiceTemplatesService.getRateWidth();
    this.discountLabel$ = this.invoiceTemplatesService.getDiscountLabel();
    this.discountWidth$ = this.invoiceTemplatesService.getDiscountWidth();
    this.taxableValueLabel$ = this.invoiceTemplatesService.getTaxableValueLabel();
    this.taxableValueWidth$ = this.invoiceTemplatesService.getTaxableValueWidth();
    this.taxLabel$ = this.invoiceTemplatesService.getTaxLabel();
    this.taxWidth$ = this.invoiceTemplatesService.getTaxWidth();
    this.totalWidth$ = this.invoiceTemplatesService.getTotalWidth();
    this.totalLabel$ = this.invoiceTemplatesService.getTaxLabel();
    this.quantityLabel$ = this.invoiceTemplatesService.getQuantityLabel();
    this.quantityWidth$ = this.invoiceTemplatesService.getQuantityWidth();
    this.invoiceTemplatesService.getTopMargin().subscribe( val => {
      if (val) {
        console.log('TOP MARGIN', val);
        this.topMargin = val;
      }
    });
    this.invoiceTemplatesService.getLeftMargin().subscribe( val => {
      if (val) {

        this.leftMargin = val;
      }
    });
    this.invoiceTemplatesService.getRightMargin().subscribe( val => {
      if (val) {
        this.rightMargin = val;
      }
    });
    this.invoiceTemplatesService.getBottomMargin().subscribe( val => {
      if (val) {
        this.bottomMargin = val;
      }
    });
    this.invoiceTemplatesService.getFontFamily().subscribe( val => {
      if (val) {
        this.fontFamily = val;
      }
    });
    this.invoiceTemplatesService.getColor().subscribe( val => {
      if (val) {
        this.color = val;
      }
    });
  //   this.tableMeta$ = this.store.select( state => {
  //     return state.invoice.table;
  //   }).takeUntil(this.destroyed$);
  //   this.tableMeta$.subscribe(val => {
  //     if (val['item']) {
  //       this.itemWidth = 20 + val['item'];
  //       console.log(this.itemWidth);
  //     }
  //     if (val['itemCode']) {
  //       this.itemCodeWidth = 30 + val['itemCode'];
  //     }
  //   });
  }

  public ngOnInit() {
    // do something
  }
}
//
// export interface TableMetaMap {
//   [ colName: string ]: number;
// }
