import { take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../store/roots';
import { InvoiceUiDataService } from '../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../models/api-models/Invoice';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from '../../../../../services/toaster.service';
import { InvoiceTemplatesService } from '../../../../../services/invoice.templates.service';
import { InvoiceActions } from '../../../../../actions/invoice/invoice.actions';
import { IOption } from '../../../../../theme/ng-virtual-select/sh-options.interface';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { CommonService } from 'apps/web-giddh/src/app/services/common.service';

export class TemplateDesignUISectionVisibility {
    public templates: boolean = false;
    public logo: boolean = false;
    public color: boolean = false;
    public font: boolean = false;
    public print: boolean = false;
    public fontSize: string = '';
}

@Component({
    selector: 'design-filters',
    templateUrl: 'design.filters.component.html',
    styleUrls: ['design.filters.component.scss']
})

export class DesignFiltersContainerComponent implements OnInit, OnDestroy {
    @Input() public design: boolean;
    @Input() public mode: string = 'create';
    public customTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    public templateUISectionVisibility: TemplateDesignUISectionVisibility = new TemplateDesignUISectionVisibility();
    public logoAttached: boolean = false;
    public showLogo: boolean = true;
    public selectedTemplateUniqueName: string = 'gst_template_a';
    public _presetFonts = [
        { label: 'Open Sans', value: 'Open Sans' },
        { label: 'Sans-Serif', value: 'Sans-Serif' },
        { label: 'opensans-regular', value: 'opensans-regular' }
    ];
    public _presetFontsSize = [
        { label: '16px', value: 16 },
        { label: '14px', value: 14 },
        { label: '12px', value: 12 },
        { label: '10px', value: 10 }

    ];
    public presetFonts = this._presetFonts;
    public presetFontsSize = this._presetFontsSize;
    public formData: FormData;
    public files: any[] = [];
    public dragOver: boolean;
    public imagePreview: any;
    public isFileUploaded: boolean = false;
    public isFileUploadInProgress: boolean = false;
    public sampleTemplates: CustomTemplateResponse[];
    public companyUniqueName: string = '';
    public templateType: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public showDeleteButton: boolean = false;
    @ViewChild('fileInput', { static: true }) logoFile: ElementRef;
    public selectedFont: string = "";
    public selectedFontSize: string = "";
    /** Default image size */
    public defaultImageSize: string = 'S';

    constructor(
        private _invoiceUiDataService: InvoiceUiDataService,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _activatedRoute: ActivatedRoute,
        private _invoiceTemplatesService: InvoiceTemplatesService,
        private invoiceActions: InvoiceActions,
        private generalService: GeneralService,
        private commonService: CommonService
    ) {
        let companyUniqueName = null;
        let companies = null;
        let defaultTemplate = null;

        this.store.pipe(select(s => s.session), take(1)).subscribe(ss => {
            companyUniqueName = ss.companyUniqueName;
            companies = ss.companies;
            this.companyUniqueName = ss.companyUniqueName;
        });

        this.store.pipe(select(s => s.invoiceTemplate), take(1)).subscribe(ss => {
            defaultTemplate = ss.defaultTemplate;
        });

        this.store.pipe(select(s => s.invoiceTemplate.sampleTemplates), take(2)).subscribe((sampleTemplates: CustomTemplateResponse[]) => {
            this.sampleTemplates = cloneDeep(sampleTemplates);
        });
        this._invoiceUiDataService.initCustomTemplate(companyUniqueName, companies, defaultTemplate);

        this.files = []; // local uploading files array
    }

    public ngOnInit() {
        this._invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
            this.customTemplate = cloneDeep(template);
            this.setFontAndFontSize();

            let op = {
                header: {},
                table: {},
                footer: {}
            };

            this._activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(a => {
                if (a && (a.voucherType === 'credit note' || a.voucherType === 'debit note')) {
                    this.templateType = 'voucher';
                } else {
                    this.templateType = 'invoice';
                }
            });

            if (this.customTemplate && this.customTemplate.sections) {
                op.header = this.customTemplate.sections.header.data;
                op.table = this.customTemplate.sections.table.data;
                op.footer = this.customTemplate.sections.footer.data;

                this._invoiceUiDataService.setFieldsAndVisibility(op);
                if (this.customTemplate.logoSize) {
                    this.defaultImageSize = this.customTemplate.logoSize === '100' ? 'L' :
                        this.customTemplate.logoSize === '80' ? 'M' : 'S';
                }
                if (this.customTemplate.logoUniqueName) {
                    this.logoAttached = true;
                    this.isFileUploaded = false;
                    if (!this._invoiceUiDataService.isLogoUpdateInProgress) {
                        this.showDeleteButton = true;
                        let preview: any = document.getElementById('logoImage');
                        preview?.setAttribute('src', ApiUrl + 'company/' + this.companyUniqueName + '/image/' + template.logoUniqueName);
                    }
                }
            }
        });

        this._invoiceUiDataService.logoPath.pipe(takeUntil(this.destroyed$)).subscribe((path: string) => {
            if (!path) {
                this.showDeleteButton = false;
                this.logoAttached = false;
                this.isFileUploaded = false;
                this.defaultImageSize = 'S';
                const preview: any = document.getElementById('logoImage');
                preview?.setAttribute('src', '');
            }
        });

    }

    /**
     * onValueChange
     */
    public onValueChange(fieldName: string, value: string) {
        let template = cloneDeep(this.customTemplate);
        if (fieldName) {
            template[fieldName] = value;
        }
        this._invoiceUiDataService.setCustomTemplate(template);
    }

    /**
     * changeColor
     */
    public changeColor(primaryColor: string, secondaryColor: string) {
        let template = cloneDeep(this.customTemplate);
        template.templateColor = primaryColor;
        template.tableColor = secondaryColor;
        this._invoiceUiDataService.setCustomTemplate(template);
    }

    /**
     * onDesignChange
     */
    public onDesignChange(fieldName, value) {
        let template;
        if (fieldName === 'uniqueName') { // change whole template
            const selectedTemplate = cloneDeep(this.sampleTemplates.find((t: CustomTemplateResponse) => (t?.uniqueName === value)));
            template = selectedTemplate ? selectedTemplate : cloneDeep(this.customTemplate);
            if (this.mode === 'update' && selectedTemplate) {
                template.uniqueName = cloneDeep(this.customTemplate?.uniqueName);
                template.name = cloneDeep(this.customTemplate.name);
            }
        } else { // change specific field
            template = cloneDeep(this.customTemplate);
            template[fieldName] = value;
        }
        template.copyFrom = cloneDeep(value);
        this.selectedTemplateUniqueName = value;
        this._invoiceUiDataService.setCustomTemplate(cloneDeep(template));
    }

    /**
     * resetPrintSetting
     */
    public resetPrintSetting() {
        let template = cloneDeep(this.customTemplate);
        template.topMargin = 10;
        template.bottomMargin = 10;
        template.leftMargin = 10;
        template.rightMargin = 10;
        this.customTemplate = cloneDeep(template);
        this.setFontAndFontSize();
        this.onValueChange(null, null);
    }

    /**
     * onFontSelect
     */
    public onFontSelect(font: IOption) {
        this.onValueChange('font', font?.value);
    }

    /**
     * onFontSizeSelect
     */
    public onFontSizeSelect(fontSize: IOption) {
        if (!fontSize?.value) {
            let template = cloneDeep(this.customTemplate);
            this.onValueChange('fontSize', template.fontSize);
        } else {
            this.onValueChange('fontSize', fontSize?.value);
        }
    }

    /**
     * onChangeVisibility
     */
    public onChangeVisibility(section: string) {
        let visibility = cloneDeep(this.templateUISectionVisibility);
        visibility.color = false;
        visibility.font = false;
        visibility.fontSize = false;
        visibility.logo = false;
        visibility.print = false;
        visibility.templates = false;
        if (section) {
            visibility[section] = true;
        }
        this.templateUISectionVisibility = visibility;
    }

    public clickedOutside() {
        this.onChangeVisibility(null);
    }

    /**
     * Uploads logo
     *
     * @memberof DesignFiltersContainerComponent
     */
    public uploadLogo(): void {
        const selectedFile: any = document.getElementById("logo-edit");
        if (selectedFile?.files?.length) {
            const file = selectedFile?.files[0];

            this.generalService.getSelectedFile(file, (blob, file) => {
                this.isFileUploadInProgress = true;
                this._invoiceUiDataService.isLogoUpdateInProgress = true;
                this.previewFile(file);

                this.commonService.uploadFile({ file: blob, fileName: file.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isFileUploadInProgress = false;
                    if (response?.status === 'success') {
                        this.showDeleteButton = true;
                        this.onValueChange('logoUniqueName', response.body?.uniqueName);
                        this.isFileUploaded = true;
                        this._invoiceUiDataService.isLogoUpdateInProgress = false;
                        this._toasty.successToast('File uploaded successfully.');
                    } else {
                        this._toasty.showSnackBar("error", response.message);
                    }
                });
            });
        }
    }

    public updateTemplate(logoUniqueName: string) {
        let data = cloneDeep(this._invoiceUiDataService.customTemplate.getValue());
        if (data.name) {
            data.logoUniqueName = logoUniqueName;
            data.updatedAt = null;
            data.updatedBy = null;
            data.sections['header'].data['pan'].label = '';
            data.sections['header'].data['companyName'].label = '';

            data = this.newLineToBR(data);

            this._invoiceTemplatesService.updateTemplate(data?.uniqueName, data).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'success') {
                    this._toasty.successToast('Template Updated Successfully.');
                    this.store.dispatch(this.invoiceActions.getAllCreatedTemplates(this.templateType));
                } else {
                    this._toasty.errorToast(res?.message, res?.code);
                }
            });
        } else {
            this._toasty.errorToast('Please enter template name.');
        }
    }

    public newLineToBR(template) {
        template.sections['footer'].data['message1'].label = template.sections['footer'].data['message1'].label?.replace(/(?:\r\n|\r|\n)/g, '<br />');
        template.sections['footer'].data['companyAddress'].label = template.sections['footer'].data['companyAddress'].label?.replace(/(?:\r\n|\r|\n)/g, '<br />');
        template.sections['footer'].data['slogan'].label = template.sections['footer'].data['slogan'].label?.replace(/(?:\r\n|\r|\n)/g, '<br />');
        return template;
    }

    public previewFile(file: any) {
        let preview: any = document.getElementById('logoImage');
        let reader = new FileReader();

        reader.onloadend = () => {
            preview.src = reader.result;
            this._invoiceUiDataService.setLogoPath(preview.src);
        };

        if (file) {
            reader.readAsDataURL(file);
            this.logoAttached = true;
        } else {
            preview.src = '';
            this.logoAttached = false;
            this._invoiceUiDataService.setLogoPath('');
        }
    }

    public toogleLogoVisibility(show?: boolean): void {
        if (!this.isFileUploaded) {
            this.showLogo = show ? show : !this.showLogo;
            this._invoiceUiDataService.setLogoVisibility(this.showLogo);
        }
    }

    /**
     * deleteLogo
     */
    public deleteLogo() {
        this.onValueChange('logoUniqueName', null);
        this._invoiceUiDataService.setLogoPath('');
        this.files = []; // local uploading files array
        this.logoAttached = false;
        this.isFileUploaded = false;
        this.isFileUploadInProgress = false;
        this.showDeleteButton = false;
        if (this.logoFile && this.logoFile.nativeElement) {
            this.logoFile.nativeElement.value = "";
        }
    }

    /**
     * validatePrintSetting
     */
    public validatePrintSetting(val, idx, marginPosition) {
        let paddingCordinatesValue = [200, 200, 200, 200];
        let paddingCordinates = ['Top', 'Left', 'Bottom', 'Right'];
        if (val > paddingCordinatesValue[idx]) {
            let maxVal = paddingCordinatesValue[idx];
            this.customTemplate[marginPosition] = maxVal;
            this._invoiceUiDataService.setCustomTemplate(this.customTemplate);
            this._toasty.errorToast(paddingCordinates[idx] + ' margin cannot be more than ' + paddingCordinatesValue[idx]);
        }
    }

    public setFontAndFontSize() {
        if (this.customTemplate) {
            if (this.customTemplate.font) {
                this.presetFonts.map(font => {
                    if (font?.value === this.customTemplate.font) {
                        this.selectedFont = font.label;
                    }
                });
            }

            if (this.customTemplate.fontSize) {
                this.presetFontsSize.map(fontSize => {
                    if (fontSize?.value === this.customTemplate.fontSize) {
                        this.selectedFontSize = fontSize.label;
                    }
                });
            }
        }
    }

    /**
     * This will be use for on change field visibility
     *
     * @param {string} fieldName
     * @param {string} value
     * @memberof DesignFiltersContainerComponent
     */
    public onChangeFieldVisibility(fieldName: string, value: string): void {
        let template = cloneDeep(this.customTemplate);
        if (fieldName) {
            template[fieldName] = value;
        }
        this._invoiceUiDataService.setCustomTemplate(template);
    }

    /**
     * Releases memory
     *
     * @memberof DesignFiltersContainerComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
