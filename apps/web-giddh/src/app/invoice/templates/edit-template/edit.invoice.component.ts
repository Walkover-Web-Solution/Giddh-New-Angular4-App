import { take, takeUntil } from 'rxjs/operators';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { CustomTemplateResponse, GetInvoiceTemplateDetailsResponse, ISection } from '../../../models/api-models/Invoice';
import * as _ from '../../../lodash-optimized';
import { ModalDirective } from 'ngx-bootstrap';
import { InvoiceTemplatesService } from '../../../services/invoice.templates.service';
import { InvoiceUiDataService } from '../../../services/invoice.ui.data.service';
import { ToasterService } from '../../../services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { InvoiceTemplateModalComponent } from './modals/template-modal/template-modal.component';

/**
 * Created by kunalsaxena on 6/29/17.
 */

@Component({
    selector: 'edit-invoice',
    templateUrl: 'edit.invoice.component.html',
    styleUrls: ['edit-template.component.scss']
})

export class EditInvoiceComponent implements OnInit, OnChanges, OnDestroy {

    @ViewChild('templateModal') public templateModal: ModalDirective;
    @ViewChild('customTemplateConfirmationModal') public customTemplateConfirmationModal: ModalDirective;
    @ViewChild('invoiceTemplatePreviewModal') public invoiceTemplatePreviewModal: ModalDirective;
    public voucherType: string;
    @ViewChild(InvoiceTemplateModalComponent) public invoiceTemplateModalComponent: InvoiceTemplateModalComponent;

    public templateId: string = 'common_template_a';
    public heading: string = 'Walkover Web Solutions';
    public template: GetInvoiceTemplateDetailsResponse[];
    public customCreatedTemplates: CustomTemplateResponse[];
    public isLoadingCustomCreatedTemplates: boolean = false;
    public currentTemplate: any;
    public currentTemplateSections: ISection;
    public deleteTemplateConfirmationMessage: string;
    public confirmationFlag: string;
    public transactionMode: string = 'create';
    public invoiceTemplateBase64Data: string;

    public selectedTemplateUniqueName: string;
    public templateMeta: any;
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public fakeTemplateH = {
        createdBy: {
            name: 'System Admin',
            email: 'business@giddh.com',
            uniqueName: 'system_admin',
            mobileNo: '99-99999999990'
        },
        fontSize: '10pt',
        sections: [{
            sectionName: 'header',
            content: [{
                field: 'companyName',
                label: '',
                display: true,
                width: null
            }, {
                field: 'gstin',
                label: 'GSTIN',
                display: true,
                width: null
            }, {
                field: 'pan',
                label: 'PAN',
                display: true,
                width: null
            }, {
                field: 'address',
                label: '',
                display: true,
                width: null
            }, {
                field: 'invoiceDate',
                label: 'Date',
                display: true,
                width: null
            }, {
                field: 'invoiceNumber',
                label: 'Number',
                display: true,
                width: null
            }, {
                field: 'shippingDate',
                label: 'Ship Date',
                display: true,
                width: null
            }, {
                field: 'shippedVia',
                label: 'Ship Via',
                display: true,
                width: null
            }, {
                field: 'trackingNumber',
                label: 'Tracking No.',
                display: true,
                width: null
            }, {
                field: 'customerName',
                label: '',
                display: true,
                width: null
            }, {
                field: 'customerEmail',
                label: '',
                display: true,
                width: null
            }, {
                field: 'customerMobileNumber',
                label: '',
                display: true,
                width: null
            }, {
                field: 'dueDate',
                label: 'Due Date',
                display: true,
                width: null
            }, {
                field: 'billingState',
                label: 'State',
                display: true,
                width: null
            }, {
                field: 'billingAddress',
                label: 'Billing Address',
                display: true,
                width: null
            }, {
                field: 'billingGstin',
                label: 'GSTIN',
                display: true,
                width: null
            }, {
                field: 'shippingAddress',
                label: 'Shipping Address',
                display: true,
                width: null
            }, {
                field: 'shippingState',
                label: 'State',
                display: true,
                width: null
            }, {
                field: 'shippingGstin',
                label: 'GSTIN',
                display: true,
                width: null
            }, {
                field: 'customField1',
                label: '',
                display: true,
                width: null
            }, {
                field: 'customField2',
                label: '',
                display: true,
                width: null
            }, {
                field: 'customField3',
                label: '',
                display: true,
                width: null
            }, {
                field: 'formNameInvoice',
                label: 'INVOICE',
                display: true,
                width: null
            }, {
                field: 'formNameTaxInvoice',
                label: 'TAX INVOICE',
                display: true,
                width: null
            }, {
                field: 'attentionTo',
                label: 'Attention To',
                display: true,
                width: null
            }]
        }, {
            sectionName: 'table',
            content: [{
                field: 'sNo',
                label: '#',
                display: true,
                width: '10'
            }, {
                field: 'date',
                label: 'Date',
                display: true,
                width: '10'
            }, {
                field: 'item',
                label: 'Descripion',
                display: true,
                width: '10'
            }, {
                field: 'hsnSac',
                label: 'HSN/SAC',
                display: true,
                width: '10'
            }, {
                field: 'quantity',
                label: 'Qty.',
                display: true,
                width: '10'
            }, {
                field: 'description',
                label: 'Some label',
                display: true,
                width: '10'
            }, {
                field: 'rate',
                label: 'Rate/ Item',
                display: true,
                width: '10'
            }, {
                field: 'discount',
                label: 'Dis./ Item',
                display: true,
                width: '10'
            }, {
                field: 'taxableValue',
                label: 'Taxable Amt.',
                display: true,
                width: '10'
            }, {
                field: 'taxes',
                label: 'Taxes',
                display: true,
                width: '10'
            }, {
                field: 'total',
                label: 'Amount',
                display: true,
                width: '10'
            }, {
                field: 'previousDue',
                label: 'Previous Due',
                display: true,
                width: null
            }]
        }, {
            sectionName: 'footer',
            content: [{
                field: 'taxableAmount',
                label: 'Sub Total',
                display: true,
                width: null
            }, {
                field: 'totalTax',
                label: 'Total Tax*',
                display: true,
                width: null
            }, {
                field: 'otherDeduction',
                label: '',
                display: true,
                width: null
            }, {
                field: 'grandTotal',
                label: 'Invoice Total',
                display: true,
                width: null
            }, {
                field: 'totalInWords',
                label: 'Invoice Total (In words)',
                display: true,
                width: null
            }, {
                field: 'message1',
                label: '',
                display: true,
                width: null
            }, {
                field: 'thanks',
                label: '',
                display: true,
                width: null
            }, {
                field: 'companyAddress',
                label: '',
                display: true,
                width: null
            }, {
                field: 'imageSignature',
                label: '',
                display: false,
                width: null
            }, {
                field: 'slogan',
                label: '',
                display: true,
                width: null
            }, {
                field: 'companyName',
                label: '',
                display: true,
                width: null
            }, {
                field: 'totalDue',
                label: 'Total Due',
                display: true,
                width: null
            }]
        }],
        isDefault: false,
        isDefaultForVoucher: false,
        uniqueName: 'gst_template_f',
        createdAt: '29-09-2018 08:55:24',
        updatedAt: '24-10-2018 06:03:41',
        updatedBy: {
            name: 'System Admin',
            email: 'business@giddh.com',
            uniqueName: 'system_admin',
            mobileNo: '99-99999999990'
        },
        // primaryColor: '#f63407',
        // secondaryColor: '#fff6f4',
        font: 'open sans',
        topMargin: 10,
        leftMargin: 10,
        rightMargin: 10,
        bottomMargin: 10,
        logoPosition: 'center/left/right',
        logoSize: 'small/medium/large',
        logoUniqueName: null,
        copyFrom: null,
        templateColor: '#f63407',
        tableColor: '#fff6f4',
        templateType: 'gst_template_h',
        name: 'Template H',
        type: 'invoice'
    };
    public fakeTemplateI = {
        createdBy: {
            name: 'System Admin',
            email: 'business@giddh.com',
            uniqueName: 'system_admin',
            mobileNo: '99-99999999990'
        },
        fontSize: '10pt',
        sections: [{
            sectionName: 'header',
            content: [{
                field: 'companyName',
                label: '',
                display: true,
                width: null
            }, {
                field: 'gstin',
                label: 'GSTIN',
                display: true,
                width: null
            }, {
                field: 'pan',
                label: 'PAN',
                display: true,
                width: null
            }, {
                field: 'address',
                label: '',
                display: true,
                width: null
            }, {
                field: 'invoiceDate',
                label: 'Date',
                display: true,
                width: null
            }, {
                field: 'invoiceNumber',
                label: 'Number',
                display: true,
                width: null
            }, {
                field: 'shippingDate',
                label: 'Ship Date',
                display: true,
                width: null
            }, {
                field: 'shippedVia',
                label: 'Ship Via',
                display: true,
                width: null
            }, {
                field: 'trackingNumber',
                label: 'Tracking No.',
                display: true,
                width: null
            }, {
                field: 'customerName',
                label: '',
                display: true,
                width: null
            }, {
                field: 'customerEmail',
                label: '',
                display: true,
                width: null
            }, {
                field: 'customerMobileNumber',
                label: '',
                display: true,
                width: null
            }, {
                field: 'dueDate',
                label: 'Due Date',
                display: true,
                width: null
            }, {
                field: 'billingState',
                label: 'State',
                display: true,
                width: null
            }, {
                field: 'billingAddress',
                label: 'Billing Address',
                display: true,
                width: null
            }, {
                field: 'billingGstin',
                label: 'GSTIN',
                display: true,
                width: null
            }, {
                field: 'shippingAddress',
                label: 'Shipping Address',
                display: true,
                width: null
            }, {
                field: 'shippingState',
                label: 'State',
                display: true,
                width: null
            }, {
                field: 'shippingGstin',
                label: 'GSTIN',
                display: true,
                width: null
            }, {
                field: 'customField1',
                label: '',
                display: true,
                width: null
            }, {
                field: 'customField2',
                label: '',
                display: true,
                width: null
            }, {
                field: 'customField3',
                label: '',
                display: true,
                width: null
            }, {
                field: 'formNameInvoice',
                label: 'INVOICE',
                display: true,
                width: null
            }, {
                field: 'formNameTaxInvoice',
                label: 'TAX INVOICE',
                display: true,
                width: null
            }, {
                field: 'attentionTo',
                label: 'Attention To',
                display: true,
                width: null
            }]
        }, {
            sectionName: 'table',
            content: [{
                field: 'sNo',
                label: '#',
                display: true,
                width: '10'
            }, {
                field: 'date',
                label: 'Date',
                display: true,
                width: '10'
            }, {
                field: 'item',
                label: 'Descripion',
                display: true,
                width: '10'
            }, {
                field: 'hsnSac',
                label: 'HSN/SAC',
                display: true,
                width: '10'
            }, {
                field: 'quantity',
                label: 'Qty.',
                display: true,
                width: '10'
            }, {
                field: 'description',
                label: 'Some label',
                display: true,
                width: '10'
            }, {
                field: 'rate',
                label: 'Rate/ Item',
                display: true,
                width: '10'
            }, {
                field: 'discount',
                label: 'Dis./ Item',
                display: true,
                width: '10'
            }, {
                field: 'taxableValue',
                label: 'Taxable Amt.',
                display: true,
                width: '10'
            }, {
                field: 'taxes',
                label: 'Taxes',
                display: true,
                width: '10'
            }, {
                field: 'total',
                label: 'Amount',
                display: true,
                width: '10'
            }, {
                field: 'previousDue',
                label: 'Previous Due',
                display: true,
                width: null
            }]
        }, {
            sectionName: 'footer',
            content: [{
                field: 'taxableAmount',
                label: 'Sub Total',
                display: true,
                width: null
            }, {
                field: 'totalTax',
                label: 'Total Tax*',
                display: true,
                width: null
            }, {
                field: 'otherDeduction',
                label: '',
                display: true,
                width: null
            }, {
                field: 'grandTotal',
                label: 'Invoice Total',
                display: true,
                width: null
            }, {
                field: 'totalInWords',
                label: 'Invoice Total (In words)',
                display: true,
                width: null
            }, {
                field: 'message1',
                label: '',
                display: true,
                width: null
            }, {
                field: 'thanks',
                label: '',
                display: true,
                width: null
            }, {
                field: 'companyAddress',
                label: '',
                display: true,
                width: null
            }, {
                field: 'imageSignature',
                label: '',
                display: false,
                width: null
            }, {
                field: 'slogan',
                label: '',
                display: true,
                width: null
            }, {
                field: 'companyName',
                label: '',
                display: true,
                width: null
            }, {
                field: 'totalDue',
                label: 'Total Due',
                display: true,
                width: null
            }]
        }],
        isDefault: false,
        isDefaultForVoucher: false,
        uniqueName: 'gst_template_g',
        createdAt: '29-09-2018 08:55:24',
        updatedAt: '24-10-2018 06:03:41',
        updatedBy: {
            name: 'System Admin',
            email: 'business@giddh.com',
            uniqueName: 'system_admin',
            mobileNo: '99-99999999990'
        },
        primaryColor: '#f63407',
        secondaryColor: '#fff6f4',
        font: 'open sans',
        topMargin: 10,
        leftMargin: 10,
        rightMargin: 10,
        bottomMargin: 10,
        logoPosition: 'center/left/right',
        logoSize: 'small/medium/large',
        logoUniqueName: null,
        copyFrom: null,
        templateColor: '#f63407',
        tableColor: '#fff6f4',
        templateType: 'gst_template_i',
        name: 'Template I',
        type: 'invoice'
    };
    public showinvoiceTemplatePreviewModal: boolean = false;
    public showtemplateModal: boolean = false;
    public templateType: any;

    constructor(private _toasty: ToasterService, private store: Store<AppState>, private invoiceActions: InvoiceActions, private _invoiceTemplatesService: InvoiceTemplatesService, private _activatedRoute: ActivatedRoute, private _invoiceUiDataService: InvoiceUiDataService) {

        this.store.dispatch(this.invoiceActions.getTemplateState());
    }

    public ngOnInit() {
        this._activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(route => {
            if(route && route.selectedType) {
                if(route.selectedType === "credit note" || route.selectedType === "debit note") {
                    this.voucherTypeChanged(route.selectedType);
                } else {
                    this.voucherTypeChanged("sales");
                }
            } else {
                this.voucherTypeChanged("sales");
            }
        });
        // this._activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(a => {
        //   debugger;
        //   this.voucherType = a.voucherType;
        //   if (this.voucherType === 'credit note' || this.voucherType === 'debit note') {
        //     this.templateType = 'voucher';
        //   } else {
        //     this.templateType = 'invoice';
        //   }
        //   this.store.dispatch(this.invoiceActions.getAllCreatedTemplates(this.templateType));
        // });

        // Get custom created templates
        this.store.select(c => c.invoiceTemplate).pipe(takeUntil(this.destroyed$)).subscribe((s) => {
            if (s && s.customCreatedTemplates) {
                this.customCreatedTemplates = _.cloneDeep(s.customCreatedTemplates);
                this.customCreatedTemplates.sort((a, b) => {
                    if (a.uniqueName < b.uniqueName) {
                        return -1;
                    }
                    if (a.uniqueName > b.uniqueName) {
                        return 1;
                    }
                    return 0;
                });
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // if (changes['voucherType'] && changes['voucherType'].currentValue !== changes['voucherType'].previousValue) {
        //   this.voucherType = changes['voucherType'].currentValue;
        //   if (this.voucherType === 'credit note' || this.voucherType === 'debit note') {
        //     this.templateType = 'voucher';
        //   } else {
        //     this.templateType = 'invoice';
        //   }
        // }
    }

    public voucherTypeChanged(voucherType: string) {
        this.voucherType = voucherType;
        if (this.voucherType === 'credit note' || this.voucherType === 'debit note') {
            this.templateType = 'voucher';
        } else {
            this.templateType = 'invoice';
        }
        this._invoiceUiDataService.setTemplateVoucherType(this.voucherType);
        this.store.dispatch(this.invoiceActions.getAllCreatedTemplates(this.templateType));
    }

    /**
     * onOpenTemplateModal
     */
    public onOpenTemplateModal() {
        this.transactionMode = 'create';
        let companyUniqueName = null;
        let companies = null;
        let defaultTemplate = null;
        this.store.select(s => s.session).pipe(take(1)).subscribe(ss => {
            companyUniqueName = ss.companyUniqueName;
            companies = ss.companies;
        });
        this.store.select(s => s.invoiceTemplate).pipe(take(1)).subscribe(ss => {
            defaultTemplate = ss.defaultTemplate;
            if (this.templateType === 'voucher') {
                defaultTemplate = ss.sampleTemplates[9];
            }
        });

        if (defaultTemplate.sections.footer.data.companyName) { // slogan default company on new template creation
            defaultTemplate.sections.footer.data.slogan.label = defaultTemplate.sections.footer.data.companyName.label;
        }
        this._invoiceUiDataService.initCustomTemplate(companyUniqueName, companies, defaultTemplate);
        this.showtemplateModal = true;
        this.templateModal.show();
    }

    /**
     * onCloseTemplateModal
     */
    public onCloseTemplateModal() {
        this.confirmationFlag = 'closeConfirmation';
        this.selectedTemplateUniqueName = null;
        this.deleteTemplateConfirmationMessage = `Are you sure want to close this popup? Your unsaved changes will be discarded`;
        this.customTemplateConfirmationModal.show();
    }

    /**
     * createTemplate
     */
    public createTemplate(vouchertyp: string) {
        let data = _.cloneDeep(this._invoiceUiDataService.customTemplate.getValue());
        data.type = vouchertyp;
        this.templateType = vouchertyp;
        let copiedTemplate = _.cloneDeep(data);
        if (data.name) {
            data = this.newLineToBR(data);
            data.sections['header'].data['companyName'].label = '';
            // data.sections['table'].content['taxes'].field = 'taxes';
            data.sections['footer'].data['grandTotal'].field = 'grandTotal';
            // if (data.sections[1].content[8].field === 'taxes' && data.sections[1].content[7].field !== 'taxableValue') {
            //   data.sections[1].content[8].field = 'taxableValue';
            // }
            data.copyFrom = copiedTemplate.uniqueName;
            if (data.fontSize) {
                data.fontSmall = data.fontSize - 4;
                data.fontDefault = data.fontSize;
                data.fontMedium = data.fontSize - 2;
            }
            delete data['uniqueName'];

            this._invoiceTemplatesService.saveTemplates(data).subscribe((res) => {
                if (res.status === 'success') {
                    this._toasty.successToast('Template Saved Successfully.');
                    this.templateModal.hide();
                    this.showtemplateModal = false;
                    this.store.dispatch(this.invoiceActions.getAllCreatedTemplates(this.templateType));
                } else {
                    this._toasty.errorToast(res.message, res.code);
                }
            });
        } else {
            this._toasty.errorToast('Please enter template name.');
        }
    }

    /**
     * updateTemplate
     */
    public updateTemplate(templateType: string) {
        let data = _.cloneDeep(this._invoiceUiDataService.customTemplate.getValue());
        if (data.name) {
            data.updatedAt = null;
            data.updatedBy = null;
            // data.copyFrom = 'gst_template_a'; // this should be dynamic
            data.sections['header'].data['address'].label = '';
            data.sections['header'].data['companyName'].label = '';
            data.sections['table'].data['taxes'].field = 'taxes';
            data.sections['footer'].data['grandTotal'].field = 'grandTotal';
            // if (data.sections[1].content[8].field === 'taxes' && data.sections[1].content[7].field !== 'taxableValue') {
            //   data.sections[1].content[8].field = 'taxableValue';
            // }
            if (data.fontSize) {
                data.fontSize = Number(data.fontSize);
                data.fontSmall = data.fontSize - 4;
                data.fontDefault = data.fontSize;
                data.fontMedium = data.fontSize - 2;
            }
            data = this.newLineToBR(data);
            this._invoiceTemplatesService.updateTemplate(data.uniqueName, data).subscribe((res) => {
                if (res.status === 'success') {
                    this._toasty.successToast('Template Updated Successfully.');
                    this.confirmationFlag = null;
                    this.selectedTemplateUniqueName = null;
                    this.deleteTemplateConfirmationMessage = null;
                    this.customTemplateConfirmationModal.hide();
                    this.templateModal.hide();

                    if (this.invoiceTemplateModalComponent && this.invoiceTemplateModalComponent.editFiltersComponent) {
                        this.invoiceTemplateModalComponent.editFiltersComponent.openTab('design');
                    }

                    this.showtemplateModal = false;
                    this.store.dispatch(this.invoiceActions.getAllCreatedTemplates(this.templateType));
                } else {
                    this._toasty.errorToast(res.message, res.code);
                }
            });
        } else {
            this._toasty.errorToast('Please enter template name.');
        }
    }

    public newLineToBR(template) {
        template.sections['footer'].data['message1'].label = template.sections['footer'].data['message1'].label ? template.sections['footer'].data['message1'].label.replace(/(?:\r\n|\r|\n)/g, '<br />') : template.sections['footer'].data['message1'].label = '';
        template.sections['footer'].data['companyAddress'].label = template.sections['footer'].data['companyAddress'].label ? template.sections['footer'].data['companyAddress'].label.replace(/(?:\r\n|\r|\n)/g, '<br />') : template.sections['footer'].data['companyAddress'].label = '';
        template.sections['footer'].data['slogan'].label = template.sections['footer'].data['slogan'].label.replace(/(?:\r\n|\r|\n)/g, '<br />');

        // template.sections[2].content[9].label = template.sections[2].content[9].label.replace(/(?:\r\n|\r|\n)/g, '<br />');
        return template;
    }

    /**
     * onPreview
     */
    public onPreview(template) {
        let customCreatedTemplates = null;
        let defaultTemplate = null;

        this.store.select(s => s.invoiceTemplate).pipe(take(1)).subscribe(ss => {
            customCreatedTemplates = ss.customCreatedTemplates;
            defaultTemplate = ss.defaultTemplate;
        });

        this._invoiceUiDataService.setTemplateUniqueName(template.uniqueName, 'preview', customCreatedTemplates, defaultTemplate);
        // let data = _.cloneDeep(this._invoiceUiDataService.customTemplate.getValue());
        this.showinvoiceTemplatePreviewModal = true;
        this.invoiceTemplatePreviewModal.show();
    }

    /**
     * onUpdateTemplate
     */
    public onUpdateTemplate(template) {
        this.showtemplateModal = true;
        let customCreatedTemplates = null;
        let defaultTemplate = null;

        this.store.select(s => s.invoiceTemplate).pipe(take(1)).subscribe(ss => {
            customCreatedTemplates = ss.customCreatedTemplates;
            defaultTemplate = ss.defaultTemplate;
        });

        this.transactionMode = 'update';
        this._invoiceUiDataService.setTemplateUniqueName(template.uniqueName, 'update', customCreatedTemplates, defaultTemplate);
        this.selectedTemplateUniqueName = template.copyFrom;
        this.templateModal.show();
    }

    /**
     * onSetTemplateAsDefault
     */
    public onSetTemplateAsDefault(template, templateType: string) {
        if (template) {
            let selectedTemplate = _.cloneDeep(template);
            this.store.dispatch(this.invoiceActions.setTemplateAsDefault(selectedTemplate.uniqueName, templateType));
        }
    }

    /**
     * onDeleteTemplate
     */
    public onDeleteTemplate(template) {
        if (template) {
            this.confirmationFlag = 'deleteConfirmation';
            let selectedTemplate = _.cloneDeep(template);
            this.deleteTemplateConfirmationMessage = `Are you sure you want to delete "<b>${selectedTemplate.name}</b>" template?`;
            this.selectedTemplateUniqueName = selectedTemplate.uniqueName;
            this.customTemplateConfirmationModal.show();
        }
    }

    /**
     * onCloseConfirmationModal
     */
    public onCloseConfirmationModal(userResponse: any) {
        if (userResponse.response && userResponse.close === 'deleteConfirmation') {
            this.store.dispatch(this.invoiceActions.deleteTemplate(this.selectedTemplateUniqueName));
        } else if (userResponse.response && userResponse.close === 'closeConfirmation') {
            if (this.invoiceTemplateModalComponent && this.invoiceTemplateModalComponent.editFiltersComponent) {
                this.invoiceTemplateModalComponent.editFiltersComponent.openTab('design');
            }
            this._invoiceUiDataService.resetCustomTemplate();
            this.templateModal.hide();
            this.showtemplateModal = false;
        }
        this.customTemplateConfirmationModal.hide();
    }

    /**
     * onClosePreviewModal
     */
    public onClosePreviewModal() {
        this.invoiceTemplatePreviewModal.hide();
        this.showinvoiceTemplatePreviewModal = false;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
