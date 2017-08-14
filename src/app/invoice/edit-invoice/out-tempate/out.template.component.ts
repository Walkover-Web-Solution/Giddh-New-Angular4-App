import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges
} from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { Store} from '@ngrx/store';
import { AppState} from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
// import {TableMetaMap} from '../edit.invoice.component';
import ownKeys = Reflect.ownKeys;
import {Section} from '../../../models/api-models/invoice';
import {InvoiceAction} from '../../../services/actions/invoice/invoice.actions';
import * as _ from 'lodash';
import {InvoiceService} from "../../../services/invoice.services";
@Component({
  selector: 'invoice-template',

  templateUrl: 'out.template.component.html',
  styleUrls: ['out.template.component.css']
})

export class OutTemplateComponent implements OnInit {
  @Input() public templateId: string;
  @Input() public templateSections: Section[];
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
  public value: string;
  // public tableMeta$: Observable<TableMetaMap>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor( private store: Store<AppState>, private invoiceAction: InvoiceAction, private invoiceService: InvoiceService) {
    console.log('out-template-component constructor called');
    this.companyName$ = this.invoiceService.getCompanyName();
    // this.companyName$.subscribe((value) => {
    //   console.log(value);
    // });
    this.GSTIN$ = this.invoiceService.getGSTIN();
    this.PAN$ = this.invoiceService.getPAN();
    this.address$ = this.invoiceService.getAddress();
    this.invoiceDate$ = this.invoiceService.getInvoiceDate();
    this.invoiceNo$ = this.invoiceService.getInvoiceNo();
    this.shippingDate$ = this.invoiceService.getShippingDate();
    this.shippingNo$ = this.invoiceService.getShippingNo();
    this.trackingDate$ = this.invoiceService.getTrackingDate();
    this.trackingNo$ = this.invoiceService.getTrackingNumber();
    this.customeName$ = this.invoiceService.getCustomerName();
    this.customeEmail$ = this.invoiceService.getCustomerEmail();
    this.customerMobileNo$ = this.invoiceService.getCustomerMobileNo();
    this.dueDate$ = this.invoiceService.getDueDate();
    this.billingAddress$ = this.invoiceService.getBillingAddress();
    this.billingGSTIN$ = this.invoiceService.getBillingGSTIN();
    this.billingState$ = this.invoiceService.getBillingState();
    this.shippingAddress$ = this.invoiceService.getShippingAddress();
    this.shippingGSTIN$ = this.invoiceService.getShippingGSTIN();
    this.customField1$ = this.invoiceService.getCustomField1();
    this.customField2$ = this.invoiceService.getCustomField2();
    this.customField3$ = this.invoiceService.getCustomField3();
    this.formNameInvoice$ = this.invoiceService.getFormNameInvoice();
    this.formNameTaxInvoice$ = this.invoiceService.getFormNameTaxInvoice();
    this.sNoLabel$ = this.invoiceService.getSnoLabel();
    this.sNoWidth$ = this.invoiceService.getSnoWidth();
    this.dateLabel$ = this.invoiceService.getDateLabel();
    this.dateWidth$ = this.invoiceService.getDateWidth();
    this.itemLabel$ = this.invoiceService.getItemLabel();
    this.itemWidth$ = this.invoiceService.getItemWidth();
    this.hsnSacLabel$ = this.invoiceService.getHsnSacLabel();
    this.hsnSacWidth$ = this.invoiceService.getHsnSaceWidth();
    this.itemCodeLabel$ = this.invoiceService.getItemCodeLabel();
    this.itemCodeWidth$ = this.invoiceService.getItemCodeWidth();
    this.descLabel$ = this.invoiceService.getDescLabel();
    this.descWidth$ = this.invoiceService.getDescWidth();
    this.rateLabel$ = this.invoiceService.getRateLabel();
    this.rateWidth$ = this.invoiceService.getRateWidth();
    this.discountLabel$ = this.invoiceService.getDiscountLabel();
    this.discountWidth$ = this.invoiceService.getDiscountWidth();
    this.taxableValueLabel$ = this.invoiceService.getTaxableValueLabel();
    this.taxableValueWidth$ = this.invoiceService.getTaxableValueWidth();
    this.taxLabel$ = this.invoiceService.getTaxLabel();
    this.taxWidth$ = this.invoiceService.getTaxWidth();
    this.totalWidth$ = this.invoiceService.getTotalWidth();
    this.totalLabel$ = this.invoiceService.getTaxLabel();
    this.quantityLabel$ = this.invoiceService.getQuantityLabel();
    this.quantityWidth$ = this.invoiceService.getQuantityWidth();
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

  public ngOnInit(){

  }
}
//
// export interface TableMetaMap {
//   [ colName: string ]: number;
// }
