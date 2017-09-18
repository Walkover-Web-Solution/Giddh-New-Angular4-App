/**
 * Created by kunalsaxena on 6/29/17.
 */

import {
  Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges, Component, ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceActions } from '../../../services/actions/invoice/invoice.actions';
import { ISection, GetInvoiceTemplateDetailsResponse } from '../../../models/api-models/Invoice';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap';
import { InvoiceTemplatesService } from '../../../services/invoice.templates.service';
import { IsFieldVisible } from './filters-container/content-filters/content.filters.component';
import { InvoiceUiDataService } from '../../../services/invoice.ui.data.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'edit-invoice',
  templateUrl: 'edit.invoice.component.html',
  styleUrls: ['edit-template.component.css']
})

export class EditInvoiceComponent implements OnInit {

  @ViewChild('templateModal') public templateModal: ModalDirective;
  @ViewChild('customTemplateConfirmationModal') public customTemplateConfirmationModal: ModalDirective;
  @ViewChild('invoiceTemplatePreviewModal') public invoiceTemplatePreviewModal: ModalDirective;

  public templateId: string = 'common_template_a';
  public heading: string = 'Walkover Web Solutions';
  public template: GetInvoiceTemplateDetailsResponse[];
  public customCreatedTemplates: GetInvoiceTemplateDetailsResponse[];
  public isLoadingCustomCreatedTemplates: boolean = false;
  public currentTemplate: any;
  public currentTemplateSections: ISection[];
  public deleteTemplateConfirmationMessage: string;
  public fieldDisplayState: IsFieldVisible;
  public invoiceTemplateBase64Data: string;
  public field: IsFieldVisible = {
    enableCompanyName: true,
    enableCompanyAddress: true,
    enableInvoiceDate: true,
    enableInvoiceNo: true,
    enableDueDate: true,
    enableCustomerName: true,
    enableMobileNo: true,
    enableCustomerAddress: true,
    enableEmailId: true,
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
    enableTotalInWords: true
  };
  private selectedTemplateUniqueName: string;
  private templateMeta: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private _toasty: ToasterService, private store: Store<AppState>, private invoiceActions: InvoiceActions, private _invoiceTemplatesService: InvoiceTemplatesService, private _invoiceUiDataService: InvoiceUiDataService) {

    this.store.dispatch(this.invoiceActions.getTemplateState());
    this.store.dispatch(this.invoiceActions.getAllCreatedTemplates());

    this.store.select(state => {
      return state.invtemp.templateMeta.templateId;
    }).takeUntil(this.destroyed$).subscribe((value) => {
      if (!_.isEmpty(value)) {
        let copyValue = _.cloneDeep(value);
        this.templateId = copyValue;
      }
    });

    this.store.select(state => {
      return Object.keys(state.invtemp.template).map(key => state.invtemp.template[key]);
    }).takeUntil(this.destroyed$).take(5).subscribe((value) => {
      if (!_.isEmpty(value)) {
        let copyValue = _.cloneDeep(value);
        this.template = copyValue;
        let currentTemplate = this.template.find((te) => {
          if (te[this.templateId]) {
            return te[this.templateId];
          }
        });
        this.currentTemplate = _.cloneDeep(currentTemplate);
        if (this.currentTemplate) {
          this.currentTemplateSections = this.currentTemplate.common_template_a.sections;
        }
        // this.store.dispatch(this.invoiceActions.setTemplateData(this.currentTemplateSections));
      }
    });

    // Get custom created templates
    this.store.select(c => c.invtemp.table).takeUntil(this.destroyed$).subscribe((s) => {
      if (s) {
        if (s.customCreatedTemplates) {
          this.customCreatedTemplates = _.cloneDeep(s.customCreatedTemplates);
        }
        this.isLoadingCustomCreatedTemplates = _.clone(s.isLoadingCustomCreatedTemplates);
      }
    });
  }
  public ngOnInit() {
    // TODO: Fetch current template object and bind to template component
    this._invoiceUiDataService.setFieldDisplay.subscribe((obj) => {
      this.fieldDisplayState = _.cloneDeep(obj);
    });
  }

  /**
   * onOpenTemplateModal
   */
  public onOpenTemplateModal() {
    this.templateModal.show();
  }

  /**
   * onCloseTemplateModal
   */
  public onCloseTemplateModal() {
    this.templateModal.hide();
  }

  public createTemplate() {
    if (!this._invoiceUiDataService.getTemplateName()) {
      this._toasty.errorToast('Please enter template name');
    } else {
      if (this.fieldDisplayState) {
        this.store.takeUntil(this.destroyed$).subscribe(val => {
          this.templateMeta = val.invtemp.templateMeta;
        });
        let data: any = {
          // name: 'my new template',
          name: this._invoiceUiDataService.getTemplateName(),
          uniqueName: '',
          isSample: false,
          sections: [
            {
              sectionName: 'header',
              content: [
                {
                  field: 'companyName',
                  label: 'Walkover',
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
                  // label: this.templateMeta.shippingState,
                  label: 'Shipping State',
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
          //  copyFrom: this.templateMeta.companyName,
          copyFrom: 'gst_template_a',
          // color: this.templateMeta.color,
          primaryColor: this.templateMeta.primaryColor,
          secondaryColor: this.templateMeta.secondaryColor,
          font: this.templateMeta.font,
          fontSize: '10pt',
          topMargin: this.templateMeta.topMargin,
          leftMargin: this.templateMeta.leftMargin,
          rightMargin: this.templateMeta.rightMargin,
          bottomMargin: this.templateMeta.bottomMargin,
          logoPosition: '',
          logoSize: ''
        };

        this._invoiceTemplatesService.saveTemplates(data).subscribe((res) => {
          if (res.status === 'success') {
            this._toasty.successToast('Template Saved Successfully.');
            this.templateModal.hide();
            this.store.dispatch(this.invoiceActions.getAllCreatedTemplates());
          }
        });
      } else {
        this._toasty.errorToast('None field were changed.');
        console.log('this.fieldDisplayState is not ready');
      }
    }
  }

  /**
   * onSetTemplateAsDefault
   */
  public onSetTemplateAsDefault(template) {
    if (template) {
      let selectedTemplate = _.cloneDeep(template);
      // console.log('the selectedTemplate is :', selectedTemplate);
      this.store.dispatch(this.invoiceActions.setTemplateAsDefault(selectedTemplate.uniqueName));
    }
  }

  /**
   * onDeleteTemplate
   */
  public onDeleteTemplate(template) {
    if (template) {
      let selectedTemplate = _.cloneDeep(template);
      this.deleteTemplateConfirmationMessage = `Are you sure want to delete "<b>${selectedTemplate.name}</b>" template?`;
      this.selectedTemplateUniqueName = selectedTemplate.uniqueName;
      this.customTemplateConfirmationModal.show();
    }
  }

  /**
   * onCloseConfirmationModal
   */
  public onCloseConfirmationModal(userResponse: boolean) {
    if (userResponse && this.selectedTemplateUniqueName) {
      this.store.dispatch(this.invoiceActions.deleteTemplate(this.selectedTemplateUniqueName));
    }
    this.customTemplateConfirmationModal.hide();
  }

  /**
   * onPreview
   */
  public onPreview(template) {
    let selectedTemplate = _.cloneDeep(template);
    this._invoiceTemplatesService.getCustomTemplate(selectedTemplate.uniqueName).subscribe((res) => {
      if (res.status === 'success') {
        this.currentTemplateSections = res.body.sections;
        let sections = _.cloneDeep(res.body.sections);
        sections.forEach((section) => {
          section.content.forEach((field) => {
            this.onCheckField(field.field, field.display);
          });
        });
        // this.templateId = res.body.uniqueName;
        this.invoiceTemplatePreviewModal.show();
      }
    });
  }

  // checking visibility of a field
  public onCheckField(field, value) {
    if (field === 'companyName') {
      this.field.enableCompanyName = value;
    } else if (field === 'invoiceDate') {
      this.field.enableInvoiceDate = value;
    } else if (field === 'invoiceNo') {
      this.field.enableInvoiceNo = value;
    } else if (field === 'companyAddress') {
      this.field.enableCompanyAddress = value;
    } else if (field === 'dueDa') {
      this.field.enableDueDate = value;
    } else if (field === 'billingAddr') {
      this.field.enableBillingAddress = value;
    } else if (field === 'billingGstin') {
      this.field.enableBillingGstin = value;
    } else if (field === 'billingState') {
      this.field.enableBillingState = value;
    } else if (field === 'shippingAddr') {
      this.field.enableShippingAddress = value;
    } else if (field === 'shippingGstin') {
      this.field.enableShippingGstin = value;
    } else if (field === 'shippingState') {
      this.field.enableShippingState = value;
    } else if (field === 'custom1') {
      this.field.enableCustom1 = value;
    } else if (field === 'custom2') {
      this.field.enableCustom2 = value;
    } else if (field === 'custom3') {
      this.field.enableCustom3 = value;
    } else if (field === 'sNo') {
      this.field.enableSno = value;
    } else if (field === 'date') {
      this.field.enableDate = value;
    } else if (field === 'item') {
      this.field.enableItem = value;
    } else if (field === 'hsn') {
      this.field.enableHsn = value;
    } else if (field === 'qty') {
      this.field.enableQty = value;
    } else if (field === 'rate') {
      this.field.enableRate = value;
    } else if (field === 'dis') {
      this.field.enableDis = value;
    } else if (field === 'taxableValue') {
      this.field.enableTaxableValue = value;
    } else if (field === 'tax') {
      this.field.enableTax = value;
    } else if (field === 'total') {
      this.field.enableTotal = value;
    } else if (field === 'taxableAmount') {
      this.field.enableTaxableAmount = value;
    } else if (field === 'totalTax') {
      this.field.enableTotalTax = value;
    } else if (field === 'otherDeductions') {
      this.field.enableOtherDeductions = value;
    } else if (field === 'invoiceTotal') {
      this.field.enableInvoiceTotal = value;
    } else if (field === 'message1') {
      this.field.enableMessage1 = value;
    } else if (field === 'message2') {
      this.field.enableMessage2 = value;
    } else if (field === 'thanks') {
      this.field.enableThanks = value;
    } else if (field === 'companyAddr') {
      this.field.enableCompanyAddress = value;
    } else if (field === 'invoiceTotalInWords') {
      this.field.enableTotalInWords = value;
    }
    this._invoiceUiDataService.setFieldDisplayState(this.field);
  }
  /**
   * onClosePreviewModal
   */
  public onClosePreviewModal() {
    this.invoiceTemplatePreviewModal.hide();
  }
}
