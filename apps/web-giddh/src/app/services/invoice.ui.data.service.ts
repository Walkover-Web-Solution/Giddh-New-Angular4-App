import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CustomTemplateResponse } from '../models/api-models/Invoice';
import { CompanyResponse } from '../models/api-models/Company';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { NgForm } from '@angular/forms';

export class TemplateContentUISectionVisibility {
    public header: boolean = true;
    public table: boolean = false;
    public footer: boolean = false;
}
declare var _: any;
@Injectable()

export class InvoiceUiDataService {
    /** Holds the current custom template data */
    public customTemplate: BehaviorSubject<CustomTemplateResponse> = new BehaviorSubject(new CustomTemplateResponse());
    /** Emits logo visibility state */
    public isLogoVisible: Subject<boolean> = new Subject();
    /** Emits company name visibility state */
    public isCompanyNameVisible: Subject<boolean> = new Subject();
    /** Emits the logo image path */
    public logoPath: Subject<string> = new Subject();
    /** Emits the selected template section for UI visibility */
    public selectedSection: Subject<TemplateContentUISectionVisibility> = new Subject();
    /** Stores the company's GSTIN value */
    public companyGSTIN: BehaviorSubject<string> = new BehaviorSubject(null);
    /** Stores the company's PAN value */
    public companyPAN: BehaviorSubject<string> = new BehaviorSubject(null);
    /** Stores fields and their visibility for the template */
    public fieldsAndVisibility: BehaviorSubject<any> = new BehaviorSubject(null);
    /** Stores the selected voucher type for the template */
    public templateVoucherType: BehaviorSubject<string> = new BehaviorSubject(null);
    /** Stores the content form instance */
    public contentForm: NgForm;
    /** Stores the content form controls with errors */
    public contentFormErrors: number;
    /** Stores the image uniquename if signature image is uploaded but not linked to the invoice */
    public unusedImageSignature: string;
    /** Indicates if a logo update is in progress */
    public isLogoUpdateInProgress: boolean;
    /** Stores the company name */
    private companyName: string;
    /** Stores the company address */
    private companyAddress: string;
    /** Internal utility variable */
    private _: any;
    /** Emits the preview mode state */
    public isPreviewMode: BehaviorSubject<boolean> = new BehaviorSubject(false);

    /**
     * Creates an instance of InvoiceUiDataService.
     * @param {IServiceConfigArgs} config
     * @memberof InvoiceUiDataService
     */
    constructor(@Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this._ = config._;
        _ = config._;
    }

    /**
     * Initializes the custom template with company and template details.
     *
     * @param {string} companyUniqueName Unique name of the company
     * @param {CompanyResponse[]} companies List of companies
     * @param {CustomTemplateResponse} defaultTemplate Default template object
     * @memberof InvoiceUiDataService
     */
    public initCustomTemplate(companyUniqueName: string = '', companies: CompanyResponse[] = [], defaultTemplate: CustomTemplateResponse): void {
        this.isLogoVisible.next(true);
        const currentCompany = companies.find(company => company?.uniqueName === companyUniqueName);
        if (currentCompany) {
            this.companyName = currentCompany.name;
            this.companyAddress = currentCompany.address;
            const firstAddress = currentCompany.addresses?.[0];
            if (firstAddress?.taxNumber) {
                this.companyGSTIN.next(firstAddress.taxNumber);
            }
            if (currentCompany.panNumber) {
                this.companyPAN.next(currentCompany.panNumber);
            }
        }
        this.isCompanyNameVisible.next(true);
        if (defaultTemplate) {
            if (this.companyName) {
                defaultTemplate.sections.header.data.companyName.label = this.companyName;
                defaultTemplate.sections.footer.data.companyName.label = this.companyName;
                defaultTemplate.sections.footer.data.companyAddress.label = this.companyAddress;
            }
            this.BRToNewLine(defaultTemplate);
            this.customTemplate.next(_.cloneDeep(defaultTemplate));
        }
        this.selectedSection.next({ header: true, table: false, footer: false });
    }


    /**
     * Sets the custom template and processes line breaks.
     *
     * @param {CustomTemplateResponse} template Custom template object
     * @memberof InvoiceUiDataService
     */
    public setCustomTemplate(template: CustomTemplateResponse): void {
        this.BRToNewLine(template);
        this.customTemplate.next(template);
    }


    /**
     * Sets the visibility of the logo.
     *
     * @param {boolean} value Visibility state
     * @memberof InvoiceUiDataService
     */
    public setLogoVisibility(value: boolean): void {
        this.isLogoVisible.next(value);
    }

    /**
     * Sets the preview mode state.
     *
     * @param {boolean} value Preview mode state
     * @memberof InvoiceUiDataService
     */
    public setIsPreviewMode(value: boolean): void {
        this.isPreviewMode.next(value);
    }

    /**
     * Sets the preview mode state (alias for setIsPreviewMode).
     *
     * @param {boolean} value Preview mode state
     * @memberof InvoiceUiDataService
     */
    public set(value: boolean): void {
        this.isPreviewMode.next(value);
    }


    /**
     * Sets the visibility of the company name.
     *
     * @param {boolean} value Visibility state
     * @memberof InvoiceUiDataService
     */
    public setCompanyNameVisibility(value: boolean): void {
        this.isCompanyNameVisible.next(value);
    }


    /**
     * Sets the logo path.
     *
     * @param {string} path Logo path
     * @memberof InvoiceUiDataService
     */
    public setLogoPath(path: string): void {
        this.logoPath.next(path);
    }

    /**
     * Sets the voucher type for the template.
     *
     * @param {string} type Voucher type
     * @memberof InvoiceUiDataService
     */
    public setTemplateVoucherType(type: string): void {
        if (type === 'invoice') {
            type = 'sales'
        }
        this.templateVoucherType.next(type);
    }


    /**
     * Sets the selected section for the template.
     *
     * @param {string} section Section name ('header', 'table', 'footer')
     * @memberof InvoiceUiDataService
     */
    public setSelectedSection(section: string): void {
        let state = {
            header: false,
            table: false,
            footer: false
        };
        state[section] = true;
        this.selectedSection.next(state);
    }


    /**
     * Resets the custom template to its default state.
     *
     * @memberof InvoiceUiDataService
     */
    public resetCustomTemplate(): void {
        this.customTemplate.next(new CustomTemplateResponse());
        this.isLogoUpdateInProgress = false;
    }

    /**
     * Converts <br> tags to newlines in template footer fields.
     *
     * @param {*} template Template object
     * @returns {*} Modified template object
     * @memberof InvoiceUiDataService
     */
    public BRToNewLine(template: any): any {
        const fields = ['message1', 'companyAddress', 'slogan'];
        fields.forEach(field => {
            const label = template.sections.footer.data[field]?.label;
            template.sections.footer.data[field].label = label ? label.replace(/<br\s*[\/]?>/gi, '\n') : '';
        });
        return template;
    }


    /**
     * Sets the fields and their visibility status.
     *
     * @param {*} statusObj Status object
     * @memberof InvoiceUiDataService
     */
    public setFieldsAndVisibility(statusObj: any): void {
        this.fieldsAndVisibility.next(statusObj);
    }

    /**
     * Sets the template by unique name and applies visibility and default values.
     *
     * @param {string} uniqueName Unique name of the template
     * @param {string} mode Mode of operation
     * @param {CustomTemplateResponse[]} customCreatedTemplates List of custom templates
     * @param {CustomTemplateResponse} defaultTemplate Default template object
     * @memberof InvoiceUiDataService
     */
    public setTemplateUniqueName(uniqueName: string, mode: string, customCreatedTemplates: CustomTemplateResponse[] = [], defaultTemplate: CustomTemplateResponse): void {
        if (!customCreatedTemplates?.length) return;
        const allTemplates = _.cloneDeep(customCreatedTemplates);
        const selectedTemplateIndex = allTemplates.findIndex(template => template?.uniqueName === uniqueName);
        let selectedTemplate = _.cloneDeep(allTemplates[selectedTemplateIndex]);
        if (!selectedTemplate) return;

        const headerData = selectedTemplate.sections.header.data;
        const footerData = selectedTemplate.sections.footer.data;
        const tableData = selectedTemplate.sections.table.data;
        const defaultHeader = defaultTemplate?.sections.header.data;
        const defaultFooter = defaultTemplate?.sections.footer.data;
        const defaultTable = defaultTemplate?.sections.table.data;

        if (headerData.companyName.display) {
            this.isCompanyNameVisible.next(true);
        }
        this.isLogoVisible.next(!!selectedTemplate.logoUniqueName);

        headerData.attentionTo = { display: true, label: 'Attention To', field: 'attentionTo', width: null };
        if (!headerData.showCompanyAddress) {
            headerData.showCompanyAddress = {
                label: '',
                display: headerData.warehouseAddress?.display,
                width: null
            };
        }
        if (!headerData.showQrCode) {
            headerData.showQrCode = defaultHeader?.showQrCode ?? { label: '', display: false, width: null };
        }
        if (!headerData.showEInvoiceDetails) {
            headerData.showEInvoiceDetails = defaultHeader?.showEInvoiceDetails ?? { label: '', display: false, width: null };
        }
        if (!headerData.gstComposition) {
            headerData.gstComposition = defaultHeader?.gstComposition ?? { label: '', display: true, width: null };
        }
        if (!footerData.textUnderSlogan) {
            footerData.textUnderSlogan = { label: this.companyName, display: true, width: null };
        }
        if (!footerData.showNotesAtLastPage) {
            footerData.showNotesAtLastPage = defaultFooter?.showNotesAtLastPage ?? { label: '', display: false, width: null };
        }
        if (!footerData.showMessage2) {
            footerData.showMessage2 = defaultFooter?.showMessage2 ?? { label: '', display: false, width: null };
        }
        if (!tableData.showDescriptionInRows) {
            tableData.showDescriptionInRows = defaultTable?.showDescriptionInRows ?? { label: '', display: false, width: null };
        }
        if (!headerData.companyName.label) {
            headerData.companyName.label = this.companyName;
        }
        if (!footerData.companyName.label) {
            footerData.companyName.label = this.companyName;
        }
        this.BRToNewLine(selectedTemplate);
        this.customTemplate.next(_.cloneDeep(selectedTemplate));
    }

    /**
     * Sets the content form instance for carrying out validation
     *
     * @param {NgForm} form Content form instance
     * @memberof InvoiceUiDataService
     */
    public setContentForm(form: NgForm): void {
        if (form) {
            this.contentForm = form;
            this.contentFormErrors = 0;
            Object.keys(form.controls).forEach(key => {
                if (form.controls[key].errors) {
                    this.contentFormErrors++;
                }
            });
        }
    }
}
