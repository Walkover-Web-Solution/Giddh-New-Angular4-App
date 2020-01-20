import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CustomTemplateResponse } from '../models/api-models/Invoice';
import { CompanyResponse } from '../models/api-models/Company';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

export class TemplateContentUISectionVisibility {
    public header: boolean = true;
    public table: boolean = false;
    public footer: boolean = false;
}

declare var _: any;

@Injectable()

export class InvoiceUiDataService {

    public customTemplate: BehaviorSubject<CustomTemplateResponse> = new BehaviorSubject(new CustomTemplateResponse());
    public isLogoVisible: Subject<boolean> = new Subject();
    public isCompanyNameVisible: Subject<boolean> = new Subject();
    public logoPath: Subject<string> = new Subject();
    public selectedSection: Subject<TemplateContentUISectionVisibility> = new Subject();
    // Current company real values
    public companyGSTIN: BehaviorSubject<string> = new BehaviorSubject(null);
    public companyPAN: BehaviorSubject<string> = new BehaviorSubject(null);
    public fieldsAndVisibility: BehaviorSubject<any> = new BehaviorSubject(null);
    public templateVoucherType: BehaviorSubject<string> = new BehaviorSubject(null);

    private companyName: string;
    private companyAddress: string;
    private _: any;

    constructor(@Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this._ = config._;
        _ = config._;
        //
    }

    /**
     * initCustomTemplate
     */
    public initCustomTemplate(companyUniqueName: string = '', companies: CompanyResponse[] = [], defaultTemplate: CustomTemplateResponse) {
        this.isLogoVisible.next(true);
        let uniqueName = companyUniqueName;
        let currentCompany = companies.find((company) => company.uniqueName === uniqueName);
        if (currentCompany) {
            this.companyName = currentCompany.name;
            this.companyAddress = currentCompany.address;
            if (currentCompany.addresses[0]) {
                this.companyGSTIN.next(currentCompany.addresses[0].taxNumber);
            }
            if (currentCompany.panNumber) {
                this.companyPAN.next(currentCompany.panNumber);
            }
        }

        this.isCompanyNameVisible.next(true);
        if (defaultTemplate) {
            if (this.companyName) {
                defaultTemplate.sections['header'].data['companyName'].label = this.companyName;
                defaultTemplate.sections['footer'].data['companyName'].label = this.companyName;
                defaultTemplate.sections['footer'].data['companyAddress'].label = this.companyAddress;
            }
            this.BRToNewLine(defaultTemplate);
            this.customTemplate.next(_.cloneDeep(defaultTemplate));
        }

        this.selectedSection.next({
            header: true,
            table: false,
            footer: false
        });
    }

    /**
     * setCustomTemplate
     */
    public setCustomTemplate(template: CustomTemplateResponse) {
        template.sections['header'].data['companyName'].label = this.companyName;
        if (template.sections && template.sections.footer.data.companyName) {
            template.sections['footer'].data['companyName'].label = this.companyName;
            //  template.sections['footer'].data['companyAddress'].label = this.companyAddress;
        }

        this.BRToNewLine(template);
        this.customTemplate.next(template);
    }

    /**
     * setLogoVisibility
     */
    public setLogoVisibility(value: boolean) {
        this.isLogoVisible.next(value);
    }

    /**
     * setCompanyNameVisibility
     */
    public setCompanyNameVisibility(value: boolean) {
        this.isCompanyNameVisible.next(value);
    }

    /**
     * setLogoPath
     */
    public setLogoPath(path: string) {
        this.logoPath.next(path);
    }
    /**
      * setVoucher Type
      */
    public setTemplateVoucherType(type: string) {
        if (type === 'invoice') {
            type = 'sales'
        }
        this.templateVoucherType.next(type);
    }

    /**
     * setSelectedSection
     */
    public setSelectedSection(section: string) {
        let state = {
            header: false,
            table: false,
            footer: false
        };
        state[section] = true;
        this.selectedSection.next(state);
    }

    /**
     * resetCustomTemplate
     */
    public resetCustomTemplate() {
        this.customTemplate.next(new CustomTemplateResponse());
    }

    public BRToNewLine(template) {
        template.sections['footer'].data['message1'].label = template.sections['footer'].data['message1'].label ? template.sections['footer'].data['message1'].label.replace(/<br\s*[\/]?>/gi, '\n') : '';
        template.sections['footer'].data['companyAddress'].label = template.sections['footer'].data['companyAddress'].label ? template.sections['footer'].data['companyAddress'].label.replace(/<br\s*[\/]?>/gi, '\n') : '';
        template.sections['footer'].data['slogan'].label = template.sections['footer'].data['slogan'].label ? template.sections['footer'].data['slogan'].label.replace(/<br\s*[\/]?>/gi, '\n') : '';
        // template.sections[2].content[5].label = template.sections[2].content[5].label.replace(/<br\s*[\/]?>/gi, '\n');
        // template.sections[2].content[6].label = template.sections[2].content[6].label.replace(/<br\s*[\/]?>/gi, '\n');
        // template.sections[2].content[9].label = template.sections[2].content[9].label.replace(/<br\s*[\/]?>/gi, '\n');
        return template;
    }

    /**
     * set fields and their visibility
     */
    public setFieldsAndVisibility(statusObj: any) {
        this.fieldsAndVisibility.next(statusObj);
    }

    /**
     * setTemplateUniqueName
     */
    public setTemplateUniqueName(uniqueName: string, mode: string, customCreatedTemplates: CustomTemplateResponse[] = [], defaultTemplate: CustomTemplateResponse) {
        if (customCreatedTemplates && customCreatedTemplates.length) {
            let allTemplates = _.cloneDeep(customCreatedTemplates);
            let selectedTemplateIndex = allTemplates.findIndex((template) => template.uniqueName === uniqueName);
            let selectedTemplate = _.cloneDeep(allTemplates[selectedTemplateIndex]);

            if (selectedTemplate) {
                // &&
                // if (mode === 'create' && (selectedTemplate.sections[0].content[9].field !== 'trackingNumber' || selectedTemplate.sections[1].content[4].field !== 'description') && defaultTemplate) { // this is default(old) template
                //   selectedTemplate.sections = _.cloneDeep(defaultTemplate.sections);
                // }

                if (selectedTemplate.sections['header'].data['companyName'].display) {
                    this.isCompanyNameVisible.next(true);
                }
                if (this.companyName && mode === 'create') {
                    selectedTemplate.sections['footer'].data['companyName'].label = this.companyName;
                }
                if (this.companyAddress) { // due to this on edit mode company address was not pre-filling
                    // selectedTemplate.sections['footer'].data['companyAddress'].label = this.companyAddress;
                }
                selectedTemplate.sections['header'].data['companyName'].label = this.companyName;
                if (!selectedTemplate.logoUniqueName) {
                    this.isLogoVisible.next(false);
                } else {
                    this.isLogoVisible.next(true);
                }

                selectedTemplate.sections['header'].data['attentionTo'] = {
                    display: true,
                    label: 'Attention To',
                    field: 'attentionTo',
                    width: null
                };

                this.BRToNewLine(selectedTemplate);
                this.customTemplate.next(_.cloneDeep(selectedTemplate));
            }

            selectedTemplate.sections['header'].data['attentionTo'] = {
                display: true,
                label: 'Attention To',
                field: 'attentionTo',
                width: null
            };

            this.customTemplate.next(_.cloneDeep(selectedTemplate));
        }
    }
}
