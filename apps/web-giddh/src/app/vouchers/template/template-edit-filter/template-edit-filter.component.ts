import { Component, OnInit, ViewChild, Input, ElementRef, SimpleChanges } from '@angular/core';
import { CustomTemplateResponse } from '../../../models/api-models/Invoice';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { TemplateContentUISectionVisibility, InvoiceUiDataService } from '../../../services/invoice.ui.data.service';
import { cloneDeep } from '../../../lodash-optimized';
import { GeneralService } from '../../../services/general.service';
import { CommonService } from '../../../services/common.service';
import { ToasterService } from '../../../services/toaster.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { API_BULK_FETCH_LIMIT, IOption } from '../../../app.constant';
import { InvoiceService } from '../../../services/invoice.service';
import { NgForm } from '@angular/forms';
import { CountryNames } from '../../../shared/Enums/common.enum';
import { CurrentCompanyState } from '../../../store/company/company.reducer';
import { TemplateModeEnum, TemplateTypeEnum, VoucherTypeEnum } from '../../../models/api-models/Sales';
import { CustomFieldsService } from '../../../services/custom-fields.service';

@Component({
    selector: 'template-edit-filter',
    templateUrl: './template-edit-filter.component.html',
    styleUrls: ['./template-edit-filter.component.scss'],

})
export class TemplateEditFilterComponent implements OnInit {
    /** Ng form instance of content filter component */
    @ViewChild(NgForm) templateForm: NgForm;
    /** Input data passed to the component */
    @Input() public dialogData: any;
    /** Current mode of the component (e.g., 'create', 'edit') */
    public templateModeEnum = TemplateModeEnum;
    /** Current template type (e.g., 'invoice', 'voucher') */
    public templateTypeEnum = TemplateTypeEnum;
    /** Current template mode (e.g., 'create', 'edit') */
    public templateMode: string;
    /** Stores the custom template response object */
    public customTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    /** True, if a logo is attached */
    public logoAttached: boolean = false;
    /** Unique name of the selected template */
    public selectedTemplateUniqueName: string = TemplateTypeEnum.GstTemplateA;
    /** List of preset font options */
    public templateFonts = [
        { label: 'Open Sans', value: 'Open Sans' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Lato', value: 'Lato' },
        { label: 'Inter', value: 'Inter' }
    ];
    /** List of preset font size options */
    public templateFontsSize = [
        { label: '16px', value: "16" },
        { label: '14px', value: "14" },
        { label: '12px', value: "12" },
        { label: '10px', value: "10" }
    ];
    /** Available image sizes for selection */
    public imageSizes = [
        { label: 'S', value: '60' },
        { label: 'M', value: '80' },
        { label: 'L', value: '100' }
    ];
    /** List of preset font options */
    public presetFonts = this.templateFonts;
    /** List of preset font size options */
    public presetFontsSize = this.templateFontsSize;
    /** True, if file has been uploaded */
    public isFileUploaded: boolean = false;
    /** True, if file upload is in progress */
    public isFileUploadInProgress: boolean = false;
    /** List of sample templates */
    public sampleTemplates: any[] = [];
    /** Unique name of the company */
    public companyUniqueName: string = '';
    /** Type of the template */
    public templateType: any;
    /** Emits when the component is destroyed */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True, if delete button should be shown */
    public showDeleteButton: boolean = false;
    /** Name of the selected font */
    public selectedFont: string = "";
    /** Size of the selected font */
    public selectedFontSize: string = "";
    /** Default image size */
    public defaultImageSize: string = 'S';
    /** Controls visibility of template UI sections */
    public templateSectionsVisible: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
    /** True, if company name should be shown */
    public showCompanyName: boolean;
    /** Stores fields and their visibility settings */
    public sectionSettings: any;
    /** Type of the voucher */
    public voucherType = '';
    /** Source URL of the signature image */
    public signatureSrc: string = '';
    /** True, if signature image is attached */
    public signatureImgAttached: boolean = false;
    /** True, if signature upload is in progress */
    public isSignatureUploadInProgress: boolean = false;
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    /** True, if GST composition should be shown */
    public showGstComposition: boolean = false;
    /** Stores the active company name */
    public activeCompanyName: string;
    /** Stores the voucher API version of company */
    public voucherApiVersion: number;
    /** Holds the value if company is Indian */
    public isIndianCompany: boolean = false;
    /** Hold list of suggestion items for Tribute.js */
    public suggestionList: any[] = [];
    /** Default template */
    public templateObj: any = {}
    /** Default Tally template */
    public tallyTemplateObj: any = {};
    /** Index of selected tab */
    public selectedTabIndex: number = 0;
    /** Active tab name */
    public activeTab: string;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** Selected signature type for radio button group */
    public selectedSignatureType: string = '';
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds voucher type enum */
    public voucherTypeEnum: any = VoucherTypeEnum;
    /** Holds images folder path */
    public imgPath: string = "";
    /** Timer for debouncing field changes */
    private fieldChangeTimer: any;
    /** Color palette for template customization */
    public readonly colorPalette = [
        { primary: '#bdbdbd', secondary: '#fcfcfc' },
        { primary: '#636363', secondary: '#f7f7f7' },
        { primary: '#000000', secondary: '#f2f2f2' },
        { primary: '#e34818', secondary: '#f2f3f4' },
        { primary: '#7889a1', secondary: '#f8f9fa' },
        { primary: '#48565f', secondary: '#f6f6f7' },
        { primary: '#79bd58', secondary: '#f8fcf6' },
        { primary: '#0e909a', secondary: '#f3f9fa' },
        { primary: '#202e5a', secondary: '#f4f4f7' },
        { primary: '#96bc2d', secondary: '#fafcf4' },
        { primary: '#2a651d', secondary: '#f4f7f3' },
        { primary: '#004254', secondary: '#f2f5f6' },
        { primary: '#ff8c00', secondary: '#fffaf3' },
        { primary: '#82001d', secondary: '#f9f2f3' },
        { primary: '#6b1438', secondary: '#f7f3f5' },
        { primary: '#f4749b', secondary: '#fef8fa' },
        { primary: '#950069', secondary: '#faf2f7' },
        { primary: '#542852', secondary: '#f6f4f6' }
    ];
    /** Selected file for image upload */
    public footerSelectedFile: any;
    /** Holds the file object after selection */
    public footerFile: any;
    /** Selected file for image upload */
    public mainLogoSelectedFile: any;
    /** Holds the file object after selection */
    public mainLogoFile: any;
    /** Hold list of account custom fields */
    public accountCustomFields: IOption[] = [];

    constructor(
        private generalService: GeneralService,
        private toasty: ToasterService,
        private commonService: CommonService,
        private store: Store<AppState>,
        private invoiceService: InvoiceService,
        private templateService: InvoiceUiDataService,
        private customFieldsService: CustomFieldsService
    ) {
    }

    /**
     * TrackBy function for color palette to optimize ngFor performance
     *
     * @param {number} index
     * @param {any} color
     * @returns {string}
     * @memberof TemplateEditFilterComponent
     */
    public trackByColor(index: number, color: any): string {
        return color.primary;
    }

    /**
     * Gets remaining character count for a field
     *
     * @param {number} maxLength Maximum allowed length
     * @param {string} currentValue Current field value
     * @returns {number} Remaining character count
     * @memberof TemplateEditFilterComponent
     */
    public getRemainingCharacters(maxLength: number, currentValue: string): number {
        const currentLength = currentValue?.length || 0;
        return Math.max(0, maxLength - currentLength);
    }

    /**
     * Checks if character limit is exceeded for a field
     *
     * @param {number} maxLength Maximum allowed length
     * @param {string} currentValue Current field value
     * @returns {boolean} True if character limit is exceeded
     * @memberof TemplateEditFilterComponent
     */
    public isCharacterLimitExceeded(maxLength: number, currentValue: string): boolean {
        const currentLength = currentValue?.length || 0;
        return currentLength > maxLength;
    }

    /**
     * Angular lifecycle hook that is called after data-bound properties are initialized.
     *
     * @memberof TemplateEditFilterComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
        // Initialize dialog data
        const { templateType, voucherType, templateList, mode, localeData, commonLocaleData } = this.dialogData || {};
        this.templateType = templateType;
        this.voucherType = voucherType;
        this.sampleTemplates = templateList;
        this.templateMode = mode;
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.localeData = localeData;
        this.commonLocaleData = commonLocaleData;

        // Get company info and companies list
        let companies: any = null;
        this.store.pipe(select(s => s.session), take(1)).subscribe(ss => {
            this.companyUniqueName = ss.companyUniqueName;
            companies = ss.companies;
        });

        this.templateService.setTemplateVoucherType(this.voucherType);
        if (this.templateMode === TemplateModeEnum.Create) {
            if (this.templateType === VoucherTypeEnum.purchase_order || this.templateType === VoucherTypeEnum.purchase_bill) {
                const tallyTemplate = this.sampleTemplates?.find(template => template?.templateType === TemplateTypeEnum.TallyTemplate);
                this.initializeTemplate(this.companyUniqueName, companies, cloneDeep(tallyTemplate));
            } else {
                const gstTemplate = this.sampleTemplates?.find(template => template?.templateType === TemplateTypeEnum.GstTemplateA);
                this.initializeTemplate(this.companyUniqueName, companies, cloneDeep(gstTemplate));
            }
        } else {
            this.initializeTemplate(this.companyUniqueName, companies, cloneDeep(this.dialogData?.updateTemplate));
        }

        this.templateService.setIsPreviewMode(false);

        // Subscribe to active company info
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            const countryName = activeCompany?.countryV2?.countryName;
            this.showGstComposition = countryName === CountryNames.INDIA;
            this.activeCompanyName = activeCompany?.name;
            this.isIndianCompany = countryName === CountryNames.INDIA;
        });

        // Subscribe to company state for TCS/TDS applicability
        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            this.isTcsTdsApplicable = companyData?.isTcsTdsApplicable;
        });

        // Subscribe to template changes

        this.templateService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
            this.customTemplate = cloneDeep(template);
            this.setFontAndFontSize();

            // Always assign sectionSettings to prevent undefined errors in the template
            this.sectionSettings = {
                header: this.customTemplate?.sections?.header?.data || {},
                table: this.customTemplate?.sections?.table?.data || {},
                footer: this.customTemplate?.sections?.footer?.data || {}
            };

            // Prepare section data
            const section = {
                header: this.customTemplate?.sections?.header?.data || {},
                table: this.customTemplate?.sections?.table?.data || {},
                footer: this.customTemplate?.sections?.footer?.data || {}
            };
            this.templateService.setFieldsAndVisibility(section);

            // Initialize selected signature type based on current template state
            this.initializeSelectedSignatureType();

            // Set logo size and preview
            if (this.customTemplate?.logoSize) {
                this.defaultImageSize = this.customTemplate.logoSize === '100' ? 'L'
                    : this.customTemplate.logoSize === '80' ? 'M' : 'S';
            }
            if (this.customTemplate?.logoUniqueName) {
                this.logoAttached = true;
                this.isFileUploaded = false;
                if (!this.templateService.isLogoUpdateInProgress) {
                    this.showDeleteButton = true;
                    const preview: any = document.getElementById('logoImage');
                    preview?.setAttribute('src', ApiUrl + 'company/' + this.companyUniqueName + '/image/' + template?.logoUniqueName);
                }
            }

            // Tally template-specific logic

            if (this.customTemplate?.templateType === TemplateTypeEnum.TallyTemplate) {
                const footerData = this.customTemplate?.sections?.footer?.data;
                const headerData = this.customTemplate?.sections?.header?.data;
                if (footerData?.imageSignature) footerData.imageSignature.display = true;
                if (footerData?.slogan) footerData.slogan.display = false;
                if (this.voucherType !== VoucherTypeEnum.sales) {
                    if (headerData?.invoiceDate && headerData?.voucherDate) headerData.invoiceDate.label = headerData.voucherDate.label;
                    if (headerData?.invoiceNumber && headerData?.voucherNumber) headerData.invoiceNumber.label = headerData.voucherNumber.label;
                } else {
                    if (headerData?.voucherDate && headerData?.invoiceDate) headerData.voucherDate.label = headerData.invoiceDate.label;
                    if (headerData?.voucherNumber && headerData?.invoiceNumber) headerData.voucherNumber.label = headerData.invoiceNumber.label;
                }
            }

            this.assignImageSignature();
        });

        // Listen for logo path changes
        this.templateService.logoPath.pipe(takeUntil(this.destroyed$)).subscribe((path: string) => {
            if (!path) {
                this.showDeleteButton = false;
                this.logoAttached = false;
                this.isFileUploaded = false;
                this.defaultImageSize = 'S';
            }
        });

        // Fetch email content suggestions
        this.invoiceService.getEmailContentSuggestions('account').pipe(takeUntil(this.destroyed$)).subscribe(response => {
            const suggestions = response?.body?.accountSuggestions;
            this.suggestionList = suggestions ? suggestions.map((item: string) => ({ label: item, value: item })) : [];
        });
        this.getCustomFields();

        // Subscribe to UI section visibility changes
        this.templateService.selectedSection.pipe(takeUntil(this.destroyed$)).subscribe((info: TemplateContentUISectionVisibility) => {
            this.templateSectionsVisible = cloneDeep(info);
        });

        // Subscribe to company name visibility changes
        this.templateService.isCompanyNameVisible.pipe(takeUntil(this.destroyed$)).subscribe((yesOrNo: boolean) => {
            this.showCompanyName = cloneDeep(yesOrNo);
        });

        // Subscribe to fields and visibility settings
        this.templateService.fieldsAndVisibility.pipe(takeUntil(this.destroyed$)).subscribe((obj) => {
            this.sectionSettings = cloneDeep(obj);
        });
    }

    /**
     * Handles value change for a given template field.
     *
     * @param {string} fieldName The name of the field to update
     * @param {string} value The new value for the field
     * @memberof TemplateEditFilterComponent
     */
    public onValueChange(fieldName: string, value: string) {
        // Clear existing timer
        if (this.fieldChangeTimer) {
            clearTimeout(this.fieldChangeTimer);
        }

        // Set new timer with 500ms delay
        this.fieldChangeTimer = setTimeout(() => {
            const template = cloneDeep(this.customTemplate);
            if (fieldName) template[fieldName] = value;
            this.templateService.setCustomTemplate(template);
        }, 1500);

    }

    /**
     * Handles pattern validation for input fields
     *
     * @param {object} validation Validation result with isValid and value
     * @memberof TemplateEditFilterComponent
     */
    public onPatternValidation(validation: { isValid: boolean, value: string }): void {
        if (!validation.isValid) {
            this.toasty.showSnackBar("error", `Invalid UPI ID: ${validation.value}`);
        }
    }

    /**
     * Updates the primary and secondary colors of the template.
     *
     * @param {string} primaryColor The new primary color
     * @param {string} secondaryColor The new secondary color
     * @memberof TemplateEditFilterComponent
     */
    public changeColor(primaryColor: string, secondaryColor: string) {
        const template = cloneDeep(this.customTemplate);
        if (template) {
            template.templateColor = primaryColor;
            template.tableColor = secondaryColor;
        }
        this.templateService.setCustomTemplate(template);
    }


    /**
     * Handles design changes, either switching template or updating a specific field.
     *
     * @param {string} fieldName The name of the field or 'uniqueName' to change the template
     * @param {string} value The new value or uniqueName of the template
     * @memberof TemplateEditFilterComponent
     */
    public onDesignChange(fieldName: string, value: string): void {
        let template;
        if (fieldName === 'uniqueName') {
            const selectedTemplate = cloneDeep(this.sampleTemplates?.find((t: CustomTemplateResponse) => t?.uniqueName === value));
            template = selectedTemplate || cloneDeep(this.customTemplate);
            if (this.templateMode === TemplateModeEnum.Update && selectedTemplate) {
                template.uniqueName = this.customTemplate?.uniqueName;
                template.name = this.customTemplate?.name;
            }
        } else {
            template = cloneDeep(this.customTemplate);
            template[fieldName] = value;
        }
        template.copyFrom = value;
        this.selectedTemplateUniqueName = value;
        if (template?.sections?.['header']?.data?.['companyName']) {
            template.sections['header'].data['companyName'].label = this.activeCompanyName;
        }
        if (template?.sections?.['footer']?.data?.['companyName']) {
            template.sections['footer'].data['companyName'].label = this.activeCompanyName;
        }
       this.deleteLogo();
       this.removeFile();
        this.templateService.setCustomTemplate(cloneDeep(template));
    }

    /**
     * Resets print margin settings to their default values.
     *
     * @memberof TemplateEditFilterComponent
     */
    public resetPrintSetting(): void {
        const template = cloneDeep(this.customTemplate);
        if (template) {
            template.topMargin = template.bottomMargin = template.leftMargin = template.rightMargin = 25;
        }
        this.customTemplate = cloneDeep(template)
        this.setFontAndFontSize();
        this.onValueChange(null, null);
    }

    /**
     * Handles font selection for the template.
     *
     * @param {IOption} font The selected font option
     * @memberof TemplateEditFilterComponent
     */
    public onFontSelect(font: IOption): void {
        this.onValueChange('font', font?.value);
    }

    /**
     * Handles font size selection for the template.
     *
     * @param {IOption} fontSize The selected font size option
     * @memberof TemplateEditFilterComponent
     */
    public onFontSizeSelect(fontSize: IOption): void {
        if (!fontSize?.value) {
            const template = cloneDeep(this.customTemplate);
            this.onValueChange('fontSize', template?.fontSize);
        } else {
            this.onValueChange('fontSize', fontSize.value);
        }
    }

    /**
     * Uploads a logo image for the template and updates the UI accordingly.
     *
     * @memberof TemplateEditFilterComponent
     */
    public uploadLogo(): void {
        this.mainLogoSelectedFile = document.getElementById("logo-edit");
        if (this.mainLogoSelectedFile?.files?.length) {
            this.mainLogoFile = this.mainLogoSelectedFile.files[0];
            this.generalService.getSelectedFile(this.mainLogoFile, (blob, fileObj) => {
                this.isFileUploadInProgress = true;
                this.templateService.isLogoUpdateInProgress = true;
                this.previewFile(fileObj);
                this.commonService.uploadFile({ file: blob, fileName: fileObj.name })
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe(response => {
                        this.isFileUploadInProgress = false;
                        if (response?.status === 'success') {
                            this.showDeleteButton = true;
                            this.onValueChange('logoUniqueName', response?.body?.uniqueName);
                            this.isFileUploaded = true;
                            this.templateService.isLogoUpdateInProgress = false;
                            this.toasty.successToast(this.localeData.file_uploaded_successfully);
                        } else {
                            this.toasty.showSnackBar("error", response?.message);
                        }
                    });
            });
        }
    }

    /**
     * Previews the selected logo file and updates the preview image in the UI.
     *
     * @param {*} file The file object to preview
     * @memberof TemplateEditFilterComponent
     */
    public previewFile(file: any): void {
        const preview: any = document.getElementById('logoImage');
        const reader = new FileReader();
        reader.onloadend = () => {
            preview.src = reader.result;
            this.templateService.setLogoPath(preview.src);
        };
        if (file) {
            reader.readAsDataURL(file);
            this.logoAttached = true;
        } else {
            preview.src = '';
            this.logoAttached = false;
            this.templateService.setLogoPath('');
        }
    }

    /**
     * Deletes the logo from the template and resets related UI state.
     *
     * @memberof TemplateEditFilterComponent
     */
    public deleteLogo(): void {
        this.templateService.setLogoPath('');
        this.logoAttached = false;
        this.isFileUploaded = false;
        this.isFileUploadInProgress = false;
        this.showDeleteButton = false;
        this.mainLogoFile = null;
        this.mainLogoSelectedFile = null;

        // Clear the file input element to allow re-uploading the same file
        const logoInput = document.getElementById("logo-edit") as HTMLInputElement;
        if (logoInput) {
            logoInput.value = "";
        }

        if (this.customTemplate?.logoUniqueName) {
            this.customTemplate.logoUniqueName = '';
        }
        this.templateService.setCustomTemplate(this.customTemplate);
    }

    /**
     * Validates and restricts the print margin settings.
     *
     * @param {number} val The margin value
     * @param {number} idx The index for the margin position
     * @param {string} marginPosition The margin position (top, left, bottom, right)
     * @memberof TemplateEditFilterComponent
     */
    public validatePrintSetting(val: number, idx: number, marginPosition: string): void {
        const paddingCordinatesValue = [200, 200, 200, 200];
        const paddingCordinates = ['Top', 'Left', 'Bottom', 'Right'];
        if (val > paddingCordinatesValue[idx]) {
            const maxVal = paddingCordinatesValue[idx];
            this.customTemplate[marginPosition] = maxVal;
            this.templateService.setCustomTemplate(this.customTemplate);
            this.toasty.errorToast(`${paddingCordinates[idx]} ${this.localeData.margin_cannot_be_more_than} ${paddingCordinatesValue[idx]}`);
        }
    }

    /**
     * Sets the selected font and font size based on the template data.
     *
     * @memberof TemplateEditFilterComponent
     */
    public setFontAndFontSize(): void {
        if (!this.customTemplate) return;
        if (this.customTemplate?.font) {
            if (this.customTemplate?.templateType === TemplateTypeEnum.TallyTemplate) {
                this.presetFonts = [
                    { label: 'Open Sans', value: 'Open Sans' },
                    { label: 'Roboto', value: 'Roboto' }
                ];
            } else {
                this.presetFonts = this.templateFonts;
            }
            this.templateFonts.forEach(font => {
                if (font?.value === this.customTemplate?.font) this.selectedFont = font?.label;
            });
        }
        if (this.customTemplate?.fontSize) {
            this.customTemplate.fontSize = this.customTemplate?.fontSize.toString();
            this.templateFontsSize.forEach(fontSize => {
                if (fontSize?.value == this.customTemplate?.fontSize) this.selectedFontSize = fontSize?.label;
            });
        }
    }


    /**
     * Handles the visibility change of a design field.
     *
     * @param {string} fieldName The name of the field
     * @param {string} value The value to set for the field
     * @memberof TemplateEditFilterComponent
     */
    public onChangeDesignFieldVisibility(fieldName: string, value: string): void {
        const template = cloneDeep(this.customTemplate);
        template[fieldName] = value;
        this.templateService.setCustomTemplate(template);
    }

    /**
     * Shows a warning message when attempting to change the template type in update mode.
     *
     * @memberof TemplateEditFilterComponent
     */
    public showMessage(): void {
        this.toasty.showSnackBar("warning", this.localeData.you_can_not_change_the_template_type_in_update_mode);
    }

    /**
     * Angular lifecycle hook called when an input property changes.
     *
     * @param {SimpleChanges} changes The changed input properties
     * @memberof TemplateEditFilterComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['content'] && changes['content'].currentValue !== changes['content'].previousValue) {
            this.signatureImgAttached = false;
            this.signatureSrc = '';
            this.assignImageSignature();
        }
    }


    /**
     * Handles field changes within a template section with debounce delay.
     *
     * @param {string} sectionName The name of the section
     * @param {string} fieldName The name of the field
     * @param {string} value The value to set
     * @memberof TemplateEditFilterComponent
     */
    public onFieldChange(): void {
        // Clear existing timer
        if (this.fieldChangeTimer) {
            clearTimeout(this.fieldChangeTimer);
        }

        // Set new timer with 500ms delay
        this.fieldChangeTimer = setTimeout(() => {
            let template = cloneDeep(this.customTemplate);
            this.templateService.setCustomTemplate(template);
        }, 1500);
    }

    /**
     * Toggles the display state of shipping address related fields in the template.
     *
     * @memberof TemplateEditFilterComponent
     */
    public changeDisableShipping(): void {
        let template = cloneDeep(this.customTemplate);
        if (!template?.sections?.header?.data?.shippingAddress?.display) {
            if (template?.sections?.header?.data?.shippingGstin) template.sections.header.data.shippingGstin.display = false;
            if (template?.sections?.header?.data?.shippingState) template.sections.header.data.shippingState.display = false;

        } else {
            if (template?.sections?.header?.data?.shippingGstin) template.sections.header.data.shippingGstin.display = true;
            if (template?.sections?.header?.data?.shippingState) template.sections.header.data.shippingState.display = true;
        }

        this.templateService.setCustomTemplate(template);
    }

    /**
     * Toggles the display state of billing address related fields in the template.
     *
     * @memberof TemplateEditFilterComponent
     */
    public changeDisableBilling(): void {
        let template = cloneDeep(this.customTemplate);
        if (!template?.sections?.header?.data?.billingAddress?.display) {
            if (template?.sections?.header?.data?.billingGstin) template.sections.header.data.billingGstin.display = false;
            if (template?.sections?.header?.data?.billingState) template.sections.header.data.billingState.display = false;
        } else {
            if (template?.sections?.header?.data?.billingGstin) template.sections.header.data.billingGstin.display = true;
            if (template?.sections?.header?.data?.billingState) template.sections.header.data.billingState.display = true;
        }

        this.templateService.setCustomTemplate(template);
    }

    /**
     * Handles the visibility change of a field within a section.
     *
     * @param {string} sectionName The section name
     * @param {string} fieldName The field name
     * @param {boolean} value The visibility value
     * @memberof TemplateEditFilterComponent
     */
    public onChangeFieldVisibility(): void {
        let template = cloneDeep(this.customTemplate);
        this.templateService.setCustomTemplate(template);
    }

    /**
     * Toggles the visibility of the company name in the template.
     *
     * @memberof TemplateEditFilterComponent
     */
    public onChangeCompanyNameVisibility(): void {
        this.templateService.setCompanyNameVisibility(this.showCompanyName);
    }

    /**
     * Uploads signature
     *
     * @memberof TemplateEditFilterComponent
     */
    public uploadImage(): void {
        this.footerSelectedFile = document.getElementById("signatureImg-edit");
        if (this.footerSelectedFile?.files?.length) {
            this.footerFile = this.footerSelectedFile?.files[0];

            this.generalService.getSelectedFileBase64(this.footerFile, (base64) => {
                this.isSignatureUploadInProgress = true;

                this.commonService.uploadImageBase64({ base64: base64, format: this.footerFile.type, fileName: this.footerFile.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isSignatureUploadInProgress = false;

                    if (response?.status === 'success') {
                        if (this.templateService.unusedImageSignature) {
                            this.removeFileFromServer();
                        }
                        this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + response?.body?.uniqueName;
                        if (this.customTemplate?.sections?.footer?.data?.imageSignature) {
                            this.customTemplate.sections.footer.data.imageSignature.label = response?.body?.uniqueName;
                        }
                        this.templateService.unusedImageSignature = response?.body?.uniqueName;
                        this.onChangeFieldVisibility();
                        this.toasty.showSnackBar("success", this.localeData.file_uploaded_successfully);
                    } else {
                        this.signatureImgAttached = false;
                        this.toasty.showSnackBar("error", response?.message);
                    }
                });
            });
        }
    }

    /**
     * Removes the signature image from the template.
     *
     * @memberof TemplateEditFilterComponent
     */
    public removeFile(): void {
        this.signatureImgAttached = false;
        this.signatureSrc = '';
        this.isSignatureUploadInProgress = false;
        this.footerFile = null;
        this.footerSelectedFile = null;

        // Clear the file input element to allow re-uploading the same file
        const signatureInput = document.getElementById("signatureImg-edit") as HTMLInputElement;
        if (signatureInput) {
            signatureInput.value = "";
        }

        if (this.customTemplate?.sections?.footer?.data?.imageSignature) {
            this.customTemplate.sections.footer.data.imageSignature.label = '';
        }
        this.templateService.setCustomTemplate(this.customTemplate);
    }

    /**
     * Permanently removes the signature file from the server.
     *
     * @memberof TemplateEditFilterComponent
     */
    public removeFileFromServer(): void {
        this.invoiceService.removeSignature(this.templateService.unusedImageSignature).subscribe(() => { });
    }

    /**
     * Chooses the signature type (slogan or image signature) for the template.
     *
     * @param {string} val The selected signature type
     * @memberof TemplateEditFilterComponent
    */
    public chooseSigntureType(val: string): void {
        let template = cloneDeep(this.customTemplate);
        if (val === 'slogan') {
            if (template?.sections?.footer?.data?.slogan) template.sections.footer.data.slogan.display = true;
            if (template?.sections?.footer?.data?.imageSignature) template.sections.footer.data.imageSignature.display = false;
        } else {
            if (template?.sections?.footer?.data?.imageSignature) template.sections.footer.data.imageSignature.display = true;
            if (template?.sections?.footer?.data?.slogan) template.sections.footer.data.slogan.display = false;
        }
        this.templateService.setCustomTemplate(template);

    }

    /**
     * Initializes the selected signature type based on current template state
     *
     * @memberof TemplateEditFilterComponent
     */
    private initializeSelectedSignatureType(): void {
        if (this.customTemplate?.sections?.footer?.data?.imageSignature?.display) {
            this.selectedSignatureType = 'image';
        } else if (this.customTemplate?.sections?.footer?.data?.slogan?.display) {
            this.selectedSignatureType = 'slogan';
        } else {
            this.selectedSignatureType = '';
        }
    }

    /**
     * Handles radio button selection for signature type
     *
     * @param {string} signatureType The selected signature type ('image' or 'slogan')
     * @memberof TemplateEditFilterComponent
     */
    public onSignatureTypeChange(signatureType: string): void {
        this.selectedSignatureType = signatureType;
        this.chooseSigntureType(signatureType);
        this.onFieldChange();
    }

    /**
     * Toggles the display state of the quantity and total quantity fields in the template.
     *
     * @memberof TemplateEditFilterComponent
     */
    public changeDisableQuantity(): void {
        let template = cloneDeep(this.customTemplate);
        if (template?.sections?.table?.data?.totalQuantity) {
            if (!template?.sections?.table?.data?.quantity?.display) {
                template.sections.table.data.totalQuantity.display = false;
            } else {
                template.sections.table.data.totalQuantity.display = true;
            }
        }
        this.templateService.setCustomTemplate(template);
    }

    /**
     * Changes the tax bifurcation label for the specified section.
     *
     * @param {string} label The label to set
     * @param {string} sectionType The section type ('footer' or 'table')
     * @memberof TemplateEditFilterComponent
    */
    public checkedTaxBifurcation(label: string, sectionType: string): void {
        let template = cloneDeep(this.customTemplate);
        if (sectionType === 'table' && template && template.sections && template.sections.table && template.sections.table.data && template.sections.table.data.taxBifurcation) {
            if (template.sections.table.data.taxBifurcation?.display) {
                template.sections.table.data.taxBifurcation.label = label;
            } else {
                template.sections.table.data.taxBifurcation.label = '';
            }
        } else {
            if (template && template.sections && template.sections.footer && template.sections.footer.data && template.sections.footer.data.taxBifurcation) {
                if (template.sections.footer.data.taxBifurcation?.display) {
                    template.sections.footer.data.taxBifurcation.label = label;
                } else {
                    template.sections.footer.data.taxBifurcation.label = '';
                }
            }
        }

        this.templateService.setCustomTemplate(template);
    }

    /**
     * Toggles the display of the document title header.
     *
     * @param {boolean} event True if the header should be displayed
     * @memberof TemplateEditFilterComponent
     */
    public handleHeader(event: boolean): void {
        if (this.customTemplate?.sections?.['header']?.data?.['formNameInvoice']) {
            this.customTemplate.sections['header'].data['formNameInvoice'].display = event;
        }
    }

    /**
     * Assigns the image signature for CREATE and UPDATE flows.
     *
     * @memberof TemplateEditFilterComponent
     */
    public assignImageSignature(): void {
        if (this.customTemplate?.sections?.footer?.data?.imageSignature?.label) {
            this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + this.customTemplate.sections.footer.data.imageSignature.label;
            this.signatureImgAttached = true;
        } else {
            this.signatureSrc = '';
            this.signatureImgAttached = false;
        }
    }

    /**
     * Change voucher number or date based on Invoice number or date
     *
     * @param {boolean} [isDate=true] True, if date is changed
     * @memberof TemplateEditFilterComponent
     */
    public handleInvoiceDateNumberChange(isDate: boolean = true): void {
        if (isDate) {
            if (this.customTemplate?.sections?.['header']?.data?.['voucherDate'] && this.customTemplate?.sections?.['header']?.data?.['invoiceDate']) {
                this.customTemplate.sections['header'].data['voucherDate'].label = this.customTemplate?.sections['header']?.data['invoiceDate']?.label;
                this.customTemplate.sections['header'].data['voucherDate'].display = this.customTemplate?.sections['header']?.data['invoiceDate']?.display;
            }
        } else {
            if (this.customTemplate?.sections?.['header']?.data?.['voucherNumber'] && this.customTemplate?.sections?.['header']?.data?.['invoiceNumber']) {
                this.customTemplate.sections['header'].data['voucherNumber'].label = this.customTemplate?.sections['header']?.data['invoiceNumber']?.label;
                this.customTemplate.sections['header'].data['voucherNumber'].display = this.customTemplate?.sections['header']?.data['invoiceNumber']?.display;
            }
        }
    }

    /**
     * Handles tab change
     *
     * @param {*} event
     * @memberof TemplateEditFilterComponent
     */
    public tabChanged(event: any): void {
        this.selectedTabIndex = event.index;
        this.templateService.setIsPreviewMode(event?.index === 1 ? true : false);
    }

    /**
     * Initializes template with company details and processes it
     *
     * @param {string} companyUniqueName Unique name of the company
     * @param {any[]} companies List of companies
     * @param {CustomTemplateResponse} defaultTemplate Default template object
     * @memberof TemplateEditFilterComponent
     */
    private initializeTemplate(companyUniqueName: string, companies: any[], defaultTemplate: CustomTemplateResponse): void {
        this.templateService.setLogoVisibility(true);
        const currentCompany = companies?.find(company => company?.uniqueName === companyUniqueName);
        let companyName = '';
        let companyAddress = '';

        if (currentCompany) {
            companyName = currentCompany?.name || '';
            companyAddress = currentCompany?.address || '';
            const firstAddress = currentCompany?.addresses?.[0];
            if (firstAddress?.taxNumber) {
                this.templateService.companyGSTIN.next(firstAddress.taxNumber);
            }
            if (currentCompany.panNumber) {
                this.templateService.companyPAN.next(currentCompany.panNumber);
            }
        }

        this.templateService.setCompanyNameVisibility(true);

        if (defaultTemplate) {
            const processedTemplate = cloneDeep(defaultTemplate);
            if (companyName) {
                processedTemplate.sections.header.data.companyName.label = companyName;
                processedTemplate.sections.footer.data.companyName.label = companyName;
                processedTemplate.sections.footer.data.companyAddress.label = companyAddress;
            }
            this.templateService.initCustomTemplate(processedTemplate);
        }
    }

    /**
     * Toggles the display of the document title header.
     *
     * @param {boolean} event True if the header should be displayed
     * @memberof TemplateEditFilterComponent
     */
    public changeInvoiceHeader(event: boolean): void {
        this.customTemplate.sections['header'].data['formNameInvoice'].display = event;
    }

    /**
     * Get custom fields API call
     * 
     * @private
     * @memberof TemplateEditFilterComponent
     */
    private getCustomFields(): void {
        this.customFieldsService.list({
                page: 1,
                count: API_BULK_FETCH_LIMIT,
                moduleUniqueName: 'account'
            }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    const customFields = response.body?.results?.map(customField => {
                        return {
                            label: customField.fieldName,
                            value: customField.uniqueName
                        };
                    }) || [];
                    this.accountCustomFields = customFields;
                } else if (response.message) {
                    this.toasty.errorToast(response.message);
                }
            }
        });
    }
}