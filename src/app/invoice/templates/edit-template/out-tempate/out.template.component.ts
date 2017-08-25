import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges, OnDestroy
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
import {
  GetInvoiceTemplateDetailsResponse, GetTemplateResponse, ISection,
  Template
} from '../../../../models/api-models/Invoice';
import { InvoiceUiDataService } from '../../../../services/invoice.ui.data.service';
import { IsDivVisible, IsFieldVisible } from '../filters-container/content-filters/content.filters.component';

@Component({
  selector: 'invoice-template',
  templateUrl: 'out.template.component.html',
  styleUrls: ['out.template.component.css']
})

export class OutTemplateComponent implements OnInit, OnDestroy {
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
  public shippingVia$: Observable<string>;
  public trackingDate$: Observable<string>;
  public trackingNo$: Observable<string>;
  public customerName$: Observable<string>;
  public customerEmail$: Observable<string>;
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
  public formNameInvoice: string;
  public formNameTaxInvoice: string;
  public sNoLabel$: Observable<string>;
  public dateLabel$: Observable<string>;
  public itemLabel$: Observable<string>;
  public hsnSacLabel$: Observable<string>;
  public itemCodeLabel$: Observable<string>;
  public descLabel$: Observable<string>;
  public rateLabel$: Observable<string>;
  public discountLabel$: Observable<string>;
  public taxableValueLabel$: Observable<string>;
  public taxLabel$: Observable<string>;
  public totalLabel$: Observable<string>;
  public quantityLabel$: Observable<string>;
  public message1$: Observable<string>;
  public message2$: Observable<string>;
  public taxableAmount$: Observable<string>;
  public total$: Observable<string>;
  public otherDeduction$: Observable<string>;
  public totalTax$: Observable<string>;
  public totalInWords$: Observable<string>;
  public slogan$: Observable<string>;
  public thanks$: Observable<string>;
  public topMargin: number;
  public leftMargin: number;
  public bottomMargin: number;
  public rightMargin: number;
  public fontFamily: string;
  public value: string;
  public color: string;
  public logoSrc: string;
  public imageSignatureSrc: string;
  public taxInvoiceLabelFlag$: Observable<boolean>;
  public activeHeader: boolean = true;
  public activeGrid: boolean = false;
  public activeFooter: boolean = false;
  public templateMeta: any;
  public divVis: IsDivVisible = {
    header: true,
    grid: false,
    footer: false,
  }
  public fieldDisplayState: IsFieldVisible = {
    enableCompanyName: true,
    enableCompanyAddress: true,
    enableInvoiceDate: true,
    enableInvoiceNo: true,
    enableDueDate: true,
    enableBillingAddress: true,
    enableShipDate: true,
    enableShipVia: true,
    enableTrackingNo: true,
    enableDocTitle: true,
    enableBillingState: true,
    enableBillingGstin: true,
    enableShippingAddress: true,
    enableShippingState: true,
    enableShippingGstin: true,
    enableCustom1: true,
    enableCustom2: true,
    enableCustom3: true,
    enableSno: true,
    enableDate: true,
    enableItem: true,
    enableHsn: true,
    enableQty: true,
    enableRate: true,
    enableDis: true,
    enableTaxableValue: true,
    enableTax: true,
    enableTotal: true,
    enableTaxableAmount: true,
    enableTotalTax: true,
    enableOtherDeductions: true,
    enableInvoiceTotal: true,
    enableMessage1: true,
    enableMessage2: true,
    enableThanks: true,

  }
  public logoSize: string;
  public showLogo: boolean = true;
  // public tableMeta$: Observable<TableMetaMap>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private invoiceAction: InvoiceActions, private invoiceTemplatesService: InvoiceTemplatesService, private _invoiceUiDataService: InvoiceUiDataService) {
    this.companyName$ = this.invoiceTemplatesService.getCompanyName().takeUntil(this.destroyed$);
    this.GSTIN$ = this.invoiceTemplatesService.getGSTIN().takeUntil(this.destroyed$);
    this.PAN$ = this.invoiceTemplatesService.getPAN().takeUntil(this.destroyed$);
    this.address$ = this.invoiceTemplatesService.getAddress().takeUntil(this.destroyed$);
    this.invoiceDate$ = this.invoiceTemplatesService.getInvoiceDate().takeUntil(this.destroyed$);
    this.invoiceNo$ = this.invoiceTemplatesService.getInvoiceNo().takeUntil(this.destroyed$);
    this.shippingDate$ = this.invoiceTemplatesService.getShippingDate().takeUntil(this.destroyed$);
    this.shippingVia$ = this.invoiceTemplatesService.getShippingVia().takeUntil(this.destroyed$);
    this.shippingNo$ = this.invoiceTemplatesService.getShippingNo().takeUntil(this.destroyed$);
    this.trackingDate$ = this.invoiceTemplatesService.getTrackingDate().takeUntil(this.destroyed$);
    this.trackingNo$ = this.invoiceTemplatesService.getTrackingNumber().takeUntil(this.destroyed$);
    this.customerName$ = this.invoiceTemplatesService.getCustomerName().takeUntil(this.destroyed$);
    this.customerEmail$ = this.invoiceTemplatesService.getCustomerEmail().takeUntil(this.destroyed$);
    this.customerMobileNo$ = this.invoiceTemplatesService.getCustomerMobileNo().takeUntil(this.destroyed$);
    this.dueDate$ = this.invoiceTemplatesService.getDueDate().takeUntil(this.destroyed$);
    this.billingAddress$ = this.invoiceTemplatesService.getBillingAddress().takeUntil(this.destroyed$);
    this.billingGSTIN$ = this.invoiceTemplatesService.getBillingGSTIN().takeUntil(this.destroyed$);
    this.billingState$ = this.invoiceTemplatesService.getBillingState().takeUntil(this.destroyed$);
    this.shippingAddress$ = this.invoiceTemplatesService.getShippingAddress().takeUntil(this.destroyed$);
    this.shippingGSTIN$ = this.invoiceTemplatesService.getShippingGSTIN().takeUntil(this.destroyed$);
    this.customField1$ = this.invoiceTemplatesService.getCustomField1().takeUntil(this.destroyed$);
    this.customField2$ = this.invoiceTemplatesService.getCustomField2().takeUntil(this.destroyed$);
    this.customField3$ = this.invoiceTemplatesService.getCustomField3().takeUntil(this.destroyed$);

    this.invoiceTemplatesService.getFormNameTaxInvoice().subscribe(val => {
      if (val) {

        this.formNameTaxInvoice = val;
      }
    });
    this.taxInvoiceLabelFlag$ = this.invoiceTemplatesService.getFormNameTaxInvoiceFlag().takeUntil(this.destroyed$);
    this.sNoLabel$ = this.invoiceTemplatesService.getSnoLabel().takeUntil(this.destroyed$);
    this.dateLabel$ = this.invoiceTemplatesService.getDateLabel().takeUntil(this.destroyed$);
    this.itemLabel$ = this.invoiceTemplatesService.getItemLabel().takeUntil(this.destroyed$);
    this.hsnSacLabel$ = this.invoiceTemplatesService.getHsnSacLabel().takeUntil(this.destroyed$);
    this.itemCodeLabel$ = this.invoiceTemplatesService.getItemCodeLabel().takeUntil(this.destroyed$);
    this.descLabel$ = this.invoiceTemplatesService.getDescLabel().takeUntil(this.destroyed$);
    this.rateLabel$ = this.invoiceTemplatesService.getRateLabel().takeUntil(this.destroyed$);
    this.discountLabel$ = this.invoiceTemplatesService.getDiscountLabel().takeUntil(this.destroyed$);
    this.taxableValueLabel$ = this.invoiceTemplatesService.getTaxableValueLabel().takeUntil(this.destroyed$);
    this.taxLabel$ = this.invoiceTemplatesService.getTaxLabel().takeUntil(this.destroyed$);
    this.totalLabel$ = this.invoiceTemplatesService.getTotalLabel().takeUntil(this.destroyed$);
    this.quantityLabel$ = this.invoiceTemplatesService.getQuantityLabel().takeUntil(this.destroyed$);
    this.invoiceTemplatesService.getTopMargin().subscribe(val => {
      if (val) {
        this.topMargin = val;
      }
    });
    this.invoiceTemplatesService.getLeftMargin().subscribe(val => {
      if (val) {

        this.leftMargin = val;
      }
    });
    this.invoiceTemplatesService.getRightMargin().subscribe(val => {
      if (val) {
        this.rightMargin = val;
      }
    });
    this.invoiceTemplatesService.getBottomMargin().subscribe(val => {
      if (val) {
        this.bottomMargin = val;
      }
    });
    this.invoiceTemplatesService.getFontFamily().subscribe(val => {
      if (val) {
        this.fontFamily = val;
      }
    });
    this.invoiceTemplatesService.getColor().subscribe(val => {
      if (val) {
        this.color = val;
      }
    });
    this.message1$ = this.invoiceTemplatesService.getMessage1();
    this.message2$ = this.invoiceTemplatesService.getMessage2();
    this.taxableAmount$ = this.invoiceTemplatesService.getTaxableAmount();
    this.totalTax$ = this.invoiceTemplatesService.getTotalTax();
    this.total$ = this.invoiceTemplatesService.getTotal();
    this.totalInWords$ = this.invoiceTemplatesService.getTotalInWords();
    this.otherDeduction$ = this.invoiceTemplatesService.getOtherDeduction();
    this.thanks$ = this.invoiceTemplatesService.getThanks();
    this.slogan$ = this.invoiceTemplatesService.getSlogan();
    this._invoiceUiDataService.setFieldDisplay.subscribe((val) => {
      this.fieldDisplayState = val;
    });

    this._invoiceUiDataService.logoPath.subscribe((val) => {
      this.logoSrc = val;
    });

    this._invoiceUiDataService.imageSignaturePath.subscribe((val) => {
      this.imageSignatureSrc = val;
    });
    this._invoiceUiDataService.logoSize.subscribe((val) => {
      this.logoSize = val;
    });
    this._invoiceUiDataService.defaultPrintSetting.subscribe((val) => {
      this.leftMargin = val
      this.rightMargin = val
      this.topMargin = val
      this.bottomMargin = val
    });
    this._invoiceUiDataService.showLogo.subscribe((val) => {
      this.showLogo = val;
    });
  }

  public ngOnInit() {
    // do something
  }

  public onClickHeader() {
    this.activeHeader = true;
    this.activeGrid = false;
    this.activeFooter = false;
    this.divVis = {
      header: true,
      grid: false,
      footer: false
    }

    this._invoiceUiDataService.setDivStatus(this.divVis);
  }

  public onClickGrid() {
    this.activeHeader = false;
    this.activeGrid = true;
    this.activeFooter = false;
    this.divVis = {
      header: false,
      grid: true,
      footer: false
    }
    this._invoiceUiDataService.setDivStatus(this.divVis);
  }

  public onClickFooter() {
    this.activeHeader = false;
    this.activeGrid = false;
    this.activeFooter = true;
    this.divVis = {
      header: false,
      grid: false,
      footer: true
    }
    this._invoiceUiDataService.setDivStatus(this.divVis);
  }

  public createTemplate() {
    // let temp = new GetInvoiceTemplateDetailsResponse();
    this.store.take(1).subscribe(val => {
      this.templateMeta = val.invtemp.templateMeta;
    });
    let temp: any = {
      name: 'my template',
      uniqueName: this.templateMeta.templateId,
      isSample: false,
      sections: [
        {
          sectionName: 'header',
          content: [
            {
              field: 'companyName',
              label: '',
              display: this.fieldDisplayState.enableCompanyName
            },
            {
              field: 'GSTIN',
              label: this.templateMeta.GSTIN,
              display: true
            },
            {
              field: 'PAN',
              label: this.templateMeta.PAN,
              display: true
            },
            {
              field: 'address',
              label: this.templateMeta.address,
              display: this.fieldDisplayState.enableCompanyAddress
            },
            {
              field: 'invoiceDate',
              label: this.templateMeta.invoiceDate,
              display: this.fieldDisplayState.enableInvoiceDate
            },
            {
              field: 'invoiceNumber',
              label: this.templateMeta.invoiceNumber,
              display: this.fieldDisplayState.enableInvoiceNo
            },
            {
              field: 'shippingDate',
              label: this.templateMeta.shippingDate,
              display: this.fieldDisplayState.enableShipDate
            },
            {
              field: 'shippedVia',
              label: this.templateMeta.shippingVia,
              display: this.fieldDisplayState.enableShipVia
            },
            {
              field: 'TrackingNumber',
              label: this.templateMeta.trackingNumber,
              display: this.fieldDisplayState.enableTrackingNo
            },
            {
              field: 'TrackingNumber',
              label: this.templateMeta.trackingNumber,
              display: this.fieldDisplayState.enableTrackingNo
            },
            {
              field: 'customerName',
              label: this.templateMeta.customerName,
              display: true
            },
            {
              field: 'customerEmail',
              label: this.templateMeta.customerEmail,
              display: true
            },
            {
              field: 'customerMobileNumber',
              label: this.templateMeta.customerMobileNumber,
              display: true
            },
            {
              field: 'dueDate',
              label: this.templateMeta.dueDate,
              display: this.fieldDisplayState.enableDueDate
            },
            {
              field: 'billingState',
              label: this.templateMeta.billingState,
              display: this.fieldDisplayState.enableBillingState
            },
            {
              field: 'billingAddress',
              label: this.templateMeta.billingAddress,
              display: this.fieldDisplayState.enableBillingAddress
            },
            {
              field: 'billingGstin',
              label: this.templateMeta.billingGstin,
              display: this.fieldDisplayState.enableBillingGstin
            },
            {
              field: 'shippingAddress',
              label: this.templateMeta.shippingAddress,
              display: this.fieldDisplayState.enableShippingAddress
            },
            {
              field: 'shippingState',
              label: this.templateMeta.shippingState,
              display: this.fieldDisplayState.enableShippingState
            },
            {
              field: 'shippingGstin',
              label: this.templateMeta.shippingGstin,
              display: this.fieldDisplayState.enableShippingGstin
            },
            {
              field: 'customField1',
              label: this.templateMeta.customField1,
              display: this.fieldDisplayState.enableCustom1
            },
            {
              field: 'customField2',
              label: this.templateMeta.customField2,
              display: this.fieldDisplayState.enableCustom2
            },
            {
              field: 'customField3',
              label: this.templateMeta.customField3,
              display: this.fieldDisplayState.enableCustom3
            },
            {
              field: 'formNameInvoice',
              label: this.templateMeta.formNameInvoice,
              display: this.fieldDisplayState.enableDocTitle
            },
            {
              field: 'formNameTaxInvoice',
              label: this.templateMeta.formNameTaxInvoice,
              display: this.fieldDisplayState.enableDocTitle
            }
          ]
        },
        {
          sectionName: 'table',
          content: [
            {
              field: 'sNo',
              display: this.fieldDisplayState.enableSno,
              label: this.templateMeta.sNoLabel,
              width: 10
            },
            {
              field: 'date',
              display: this.fieldDisplayState.enableDis,
              label: this.templateMeta.dateLabel,
              width: 10
            },
            {
              field: 'item',
              display: this.fieldDisplayState.enableItem,
              label: this.templateMeta.itemLabel,
              width: 10
            },
            {
              field: 'hsnSac',
              display: this.fieldDisplayState.enableHsn,
              label: this.templateMeta.hsnSacLabel,
              width: 10
            },
            {
              field: 'itemCode',
              display: true,
              label: this.templateMeta.itemCodeLabel,
              width: 10
            },
            {
              field: 'description',
              display: true,
              label: this.templateMeta.description,
              width: 10
            },
            {
              field: 'rate',
              display: this.fieldDisplayState.enableRate,
              label: this.templateMeta.rateLabel,
              width: 10
            },
            {
              field: 'discount',
              display: this.fieldDisplayState.enableDis,
              label: this.templateMeta.discountLabel,
              width: 10
            },
            {
              field: 'taxableValue',
              display: this.fieldDisplayState.enableTaxableValue,
              label: this.templateMeta.taxableValueLabel,
              width: 10
            },
            {
              field: 'tax',
              display: this.fieldDisplayState.enableTax,
              label: this.templateMeta.taxLabel,
              width: 10
            },
            {
              field: 'total',
              display: this.fieldDisplayState.enableTotal,
              label: this.templateMeta.totalLabel,
              width: 10
            },
            {
              field: 'quantity',
              display: this.fieldDisplayState.enableQty,
              label: this.templateMeta.quantityLabel,
              width: 10
            }
          ]
        },
        {
          sectionName: 'footer',
          content: [
            {
              field: 'taxableAmount',
              display: this.fieldDisplayState.enableTaxableAmount,
              label: this.templateMeta.taxableAmount
            },
            {
              field: 'totalTax',
              display: this.fieldDisplayState.enableTotalTax,
              label: this.templateMeta.totalTax
            },
            {
              field: 'otherDeduction',
              display: this.fieldDisplayState.enableOtherDeductions,
              label: this.templateMeta.otherDeduction
            },
            {
              field: 'total',
              display: this.fieldDisplayState.enableInvoiceTotal,
              label: this.templateMeta.total
            },
            {
              field: 'totalInWords',
              display: this.fieldDisplayState.enableInvoiceTotal,
              label: this.templateMeta.totalInWords
            },
            {
              field: 'message1',
              display: this.fieldDisplayState.enableMessage1,
              label: this.templateMeta.message1
            },
            {
              field: 'message2',
              display: this.fieldDisplayState.enableMessage2,
              label: this.templateMeta.message1
            },
            {
              field: 'thanks',
              display: this.fieldDisplayState.enableThanks,
              label: this.templateMeta.thanks
            },
            {
              field: 'companyAddress',
              display: this.fieldDisplayState.enableCompanyAddress,
              label: this.templateMeta.address
            },
            {
              field: 'imageSignature',
              display: true,
              label: this.templateMeta.imageSignature
            },
            {
              field: 'slogan',
              display: true,
              label: this.templateMeta.slogan
            }
          ]
        }
      ],
      copyFrom: this.templateMeta.companyName,
      color: this.templateMeta.color,
      font: this.templateMeta.font,
      fontSize: '10pt',
      topMargin: this.templateMeta.topMargin,
      leftMargin: this.templateMeta.leftMargin,
      rightMargin: this.templateMeta.rightMargin,
      bottomMargin: this.templateMeta.bottomMargin,
      logoPosition: '',
      logoSize: ''
    };
    // console.log(JSON.stringify(temp));
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
