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
  Template,
  CustomTemplateResponse
} from '../../../../models/api-models/Invoice';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from '../../../../services/invoice.ui.data.service';
// import { IsDivVisible, IsFieldVisible } from '../filters-container/content-filters/content.filters.component';

@Component({
  selector: 'invoice-template',
  templateUrl: 'out.template.component.html',
  styleUrls: ['out.template.component.css']
})

export class OutTemplateComponent implements OnInit, OnDestroy {

  public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
  public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
  public logoSrc: string;
  public showLogo: boolean = true;
  public showCompanyName: boolean;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private invoiceAction: InvoiceActions, private invoiceTemplatesService: InvoiceTemplatesService, private _invoiceUiDataService: InvoiceUiDataService) {}

  public ngOnInit() {
    this._invoiceUiDataService.customTemplate.subscribe((template: CustomTemplateResponse) => {
      this.inputTemplate = _.cloneDeep(template);
    });

    this._invoiceUiDataService.selectedSection.subscribe((info: TemplateContentUISectionVisibility) => {
      this.templateUISectionVisibility = _.cloneDeep(info);
    });

    this._invoiceUiDataService.logoPath.subscribe((path: string) => {
      this.logoSrc = _.cloneDeep(path);
    });

    this._invoiceUiDataService.isLogoVisible.subscribe((yesOrNo: boolean) => {
      this.showLogo = _.cloneDeep(yesOrNo);
    });

    this._invoiceUiDataService.isCompanyNameVisible.subscribe((yesOrNo: boolean) => {
      this.showCompanyName = _.cloneDeep(yesOrNo);
    });
  }

  public onClickSection(sectionName: string) {
    this._invoiceUiDataService.setSelectedSection(sectionName);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
  // public createTemplate() {
  //   // let temp = new GetInvoiceTemplateDetailsResponse();
  //   this.store.take(1).subscribe(val => {
  //     this.templateMeta = val.invtemp.templateMeta;
  //   });
  //   let temp: any = {
  //     name: 'my template',
  //     uniqueName: this.templateMeta.templateId,
  //     isSample: false,
  //     sections: [
  //       {
  //         sectionName: 'header',
  //         content: [
  //           {
  //             field: 'companyName',
  //             label: '',
  //             display: this.fieldDisplayState.enableCompanyName
  //           },
  //           {
  //             field: 'GSTIN',
  //             label: this.templateMeta.GSTIN,
  //             display: true
  //           },
  //           {
  //             field: 'PAN',
  //             label: this.templateMeta.PAN,
  //             display: true
  //           },
  //           {
  //             field: 'address',
  //             label: this.templateMeta.address,
  //             display: this.fieldDisplayState.enableCompanyAddress
  //           },
  //           {
  //             field: 'invoiceDate',
  //             label: this.templateMeta.invoiceDate,
  //             display: this.fieldDisplayState.enableInvoiceDate
  //           },
  //           {
  //             field: 'invoiceNumber',
  //             label: this.templateMeta.invoiceNumber,
  //             display: this.fieldDisplayState.enableInvoiceNo
  //           },
  //           {
  //             field: 'shippingDate',
  //             label: this.templateMeta.shippingDate,
  //             display: this.fieldDisplayState.enableShipDate
  //           },
  //           {
  //             field: 'shippedVia',
  //             label: this.templateMeta.shippingVia,
  //             display: this.fieldDisplayState.enableShipVia
  //           },
  //           {
  //             field: 'TrackingNumber',
  //             label: this.templateMeta.trackingNumber,
  //             display: this.fieldDisplayState.enableTrackingNo
  //           },
  //           {
  //             field: 'TrackingNumber',
  //             label: this.templateMeta.trackingNumber,
  //             display: this.fieldDisplayState.enableTrackingNo
  //           },
  //           {
  //             field: 'customerName',
  //             label: this.templateMeta.customerName,
  //             display: true
  //           },
  //           {
  //             field: 'customerEmail',
  //             label: this.templateMeta.customerEmail,
  //             display: true
  //           },
  //           {
  //             field: 'customerMobileNumber',
  //             label: this.templateMeta.customerMobileNumber,
  //             display: true
  //           },
  //           {
  //             field: 'dueDate',
  //             label: this.templateMeta.dueDate,
  //             display: this.fieldDisplayState.enableDueDate
  //           },
  //           {
  //             field: 'billingState',
  //             label: this.templateMeta.billingState,
  //             display: this.fieldDisplayState.enableBillingState
  //           },
  //           {
  //             field: 'billingAddress',
  //             label: this.templateMeta.billingAddress,
  //             display: this.fieldDisplayState.enableBillingAddress
  //           },
  //           {
  //             field: 'billingGstin',
  //             label: this.templateMeta.billingGstin,
  //             display: this.fieldDisplayState.enableBillingGstin
  //           },
  //           {
  //             field: 'shippingAddress',
  //             label: this.templateMeta.shippingAddress,
  //             display: this.fieldDisplayState.enableShippingAddress
  //           },
  //           {
  //             field: 'shippingState',
  //             label: this.templateMeta.shippingState,
  //             display: this.fieldDisplayState.enableShippingState
  //           },
  //           {
  //             field: 'shippingGstin',
  //             label: this.templateMeta.shippingGstin,
  //             display: this.fieldDisplayState.enableShippingGstin
  //           },
  //           {
  //             field: 'customField1',
  //             label: this.templateMeta.customField1,
  //             display: this.fieldDisplayState.enableCustom1
  //           },
  //           {
  //             field: 'customField2',
  //             label: this.templateMeta.customField2,
  //             display: this.fieldDisplayState.enableCustom2
  //           },
  //           {
  //             field: 'customField3',
  //             label: this.templateMeta.customField3,
  //             display: this.fieldDisplayState.enableCustom3
  //           },
  //           {
  //             field: 'formNameInvoice',
  //             label: this.templateMeta.formNameInvoice,
  //             display: this.fieldDisplayState.enableDocTitle
  //           },
  //           {
  //             field: 'formNameTaxInvoice',
  //             label: this.templateMeta.formNameTaxInvoice,
  //             display: this.fieldDisplayState.enableDocTitle
  //           }
  //         ]
  //       },
  //       {
  //         sectionName: 'table',
  //         content: [
  //           {
  //             field: 'sNo',
  //             display: this.fieldDisplayState.enableSno,
  //             label: this.templateMeta.sNoLabel,
  //             width: 10
  //           },
  //           {
  //             field: 'date',
  //             display: this.fieldDisplayState.enableDis,
  //             label: this.templateMeta.dateLabel,
  //             width: 10
  //           },
  //           {
  //             field: 'item',
  //             display: this.fieldDisplayState.enableItem,
  //             label: this.templateMeta.itemLabel,
  //             width: 10
  //           },
  //           {
  //             field: 'hsnSac',
  //             display: this.fieldDisplayState.enableHsn,
  //             label: this.templateMeta.hsnSacLabel,
  //             width: 10
  //           },
  //           {
  //             field: 'itemCode',
  //             display: true,
  //             label: this.templateMeta.itemCodeLabel,
  //             width: 10
  //           },
  //           {
  //             field: 'description',
  //             display: true,
  //             label: this.templateMeta.description,
  //             width: 10
  //           },
  //           {
  //             field: 'rate',
  //             display: this.fieldDisplayState.enableRate,
  //             label: this.templateMeta.rateLabel,
  //             width: 10
  //           },
  //           {
  //             field: 'discount',
  //             display: this.fieldDisplayState.enableDis,
  //             label: this.templateMeta.discountLabel,
  //             width: 10
  //           },
  //           {
  //             field: 'taxableValue',
  //             display: this.fieldDisplayState.enableTaxableValue,
  //             label: this.templateMeta.taxableValueLabel,
  //             width: 10
  //           },
  //           {
  //             field: 'tax',
  //             display: this.fieldDisplayState.enableTax,
  //             label: this.templateMeta.taxLabel,
  //             width: 10
  //           },
  //           {
  //             field: 'total',
  //             display: this.fieldDisplayState.enableTotal,
  //             label: this.templateMeta.totalLabel,
  //             width: 10
  //           },
  //           {
  //             field: 'quantity',
  //             display: this.fieldDisplayState.enableQty,
  //             label: this.templateMeta.quantityLabel,
  //             width: 10
  //           }
  //         ]
  //       },
  //       {
  //         sectionName: 'footer',
  //         content: [
  //           {
  //             field: 'taxableAmount',
  //             display: this.fieldDisplayState.enableTaxableAmount,
  //             label: this.templateMeta.taxableAmount
  //           },
  //           {
  //             field: 'totalTax',
  //             display: this.fieldDisplayState.enableTotalTax,
  //             label: this.templateMeta.totalTax
  //           },
  //           {
  //             field: 'otherDeduction',
  //             display: this.fieldDisplayState.enableOtherDeductions,
  //             label: this.templateMeta.otherDeduction
  //           },
  //           {
  //             field: 'total',
  //             display: this.fieldDisplayState.enableInvoiceTotal,
  //             label: this.templateMeta.total
  //           },
  //           {
  //             field: 'totalInWords',
  //             display: this.fieldDisplayState.enableInvoiceTotal,
  //             label: this.templateMeta.totalInWords
  //           },
  //           {
  //             field: 'message1',
  //             display: this.fieldDisplayState.enableMessage1,
  //             label: this.templateMeta.message1
  //           },
  //           {
  //             field: 'message2',
  //             display: this.fieldDisplayState.enableMessage2,
  //             label: this.templateMeta.message1
  //           },
  //           {
  //             field: 'thanks',
  //             display: this.fieldDisplayState.enableThanks,
  //             label: this.templateMeta.thanks
  //           },
  //           {
  //             field: 'companyAddress',
  //             display: this.fieldDisplayState.enableCompanyAddress,
  //             label: this.templateMeta.address
  //           },
  //           {
  //             field: 'imageSignature',
  //             display: true,
  //             label: this.templateMeta.imageSignature
  //           },
  //           {
  //             field: 'slogan',
  //             display: true,
  //             label: this.templateMeta.slogan
  //           }
  //         ]
  //       }
  //     ],
  //     copyFrom: this.templateMeta.companyName,
  //     color: this.templateMeta.color,
  //     font: this.templateMeta.font,
  //     fontSize: '10pt',
  //     topMargin: this.templateMeta.topMargin,
  //     leftMargin: this.templateMeta.leftMargin,
  //     rightMargin: this.templateMeta.rightMargin,
  //     bottomMargin: this.templateMeta.bottomMargin,
  //     logoPosition: '',
  //     logoSize: ''
  // }
  // }

// }
