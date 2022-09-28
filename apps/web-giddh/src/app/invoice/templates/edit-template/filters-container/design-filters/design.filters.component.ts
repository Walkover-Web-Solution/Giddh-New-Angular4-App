import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput } from 'ngx-uploader';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../store/roots';
import { InvoiceUiDataService } from '../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../models/api-models/Invoice';
import { Observable, ReplaySubject } from 'rxjs';
import { ToasterService } from '../../../../../services/toaster.service';
import { INVOICE_API } from '../../../../../services/apiurls/invoice';
import { Configuration } from './../../../../../app.constant';
import { InvoiceTemplatesService } from '../../../../../services/invoice.templates.service';
import { InvoiceActions } from '../../../../../actions/invoice/invoice.actions';
import { IOption } from '../../../../../theme/ng-virtual-select/sh-options.interface';
import { ActivatedRoute } from '@angular/router';
import { Font } from "ngx-font-picker";
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';

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

    public font: Font = new Font({
        family: 'Roboto',
        size: '14px',
        style: 'regular',
        styles: ['regular']
    });
    // 'Sans-Serif', 'Open Sans', 'Lato'

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
    public files: UploadFile[] = [];
    public uploadInput: EventEmitter<UploadInput>;
    public fileUploadOptions: UploaderOptions = { concurrency: 1, allowedContentTypes: ['image/png', 'image/jpeg'] };
    public humanizeBytes: any;
    public dragOver: boolean;
    public imagePreview: any;
    public isFileUploaded: boolean = false;
    public isFileUploadInProgress: boolean = false;
    public sessionId$: Observable<string>;
    public companyUniqueName$: Observable<string>;
    public sampleTemplates: CustomTemplateResponse[];
    public companyUniqueName: string = '';
    public templateType: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public showUploadButton: boolean = false;
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
        private invoiceActions: InvoiceActions) {
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
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        // this.fileUploadOptions = { concurrency: 1, allowedContentTypes: ['image/png', 'image/jpeg'] };
        this.humanizeBytes = humanizeBytes;
        this.sessionId$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
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
                        this.showUploadButton = false;
                        let preview: any = document.getElementById('logoImage');
                        preview.setAttribute('src', ApiUrl + 'company/' + this.companyUniqueName + '/image/' + template.logoUniqueName);
                    }
                }
            }
        });

        this._invoiceUiDataService.logoPath.pipe(takeUntil(this.destroyed$)).subscribe((path: string) => {
            if (!path) {
                this.showDeleteButton = false;
                this.showUploadButton = true;
                this.logoAttached = false;
                this.isFileUploaded = false;
                this.defaultImageSize = 'S';
                const preview: any = document.getElementById('logoImage');
                preview.setAttribute('src', '');
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
        this.onValueChange('font', font.value);
    }

    /**
     * onFontSizeSelect
     */
    public onFontSizeSelect(fontSize: IOption) {
        if (!fontSize.value) {
            let template = cloneDeep(this.customTemplate);
            this.onValueChange('fontSize', template.fontSize);
        } else {
            this.onValueChange('fontSize', fontSize.value);
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

    public onUploadMyFileOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') {
            this.showUploadButton = true;
            this.showDeleteButton = false;
            this.logoAttached = true;
            this.previewFile(output.file);
            this.toogleLogoVisibility(true);
            this.isFileUploaded = false;
            this._invoiceUiDataService.isLogoUpdateInProgress = true;
        } else if (output.type === 'start') {
            this.isFileUploadInProgress = true;
            this.showUploadButton = false;
            this.showDeleteButton = false;
            this.removeAllFiles();
            this.isFileUploaded = false;
            this._invoiceUiDataService.isLogoUpdateInProgress = true;
        } else if (output.type === 'done') {
            this.isFileUploadInProgress = false;
            if (output.file.response?.status === 'success') {
                this.showUploadButton = false;
                this.showDeleteButton = true;
                this.startUpload();
                //this.updateTemplate(output.file.response.body.uniqueName); //unused call to save template after logo upload
                this.onValueChange('logoUniqueName', output.file.response.body?.uniqueName);
                this.isFileUploaded = true;
                this._invoiceUiDataService.isLogoUpdateInProgress = false;
                this._toasty.successToast('file uploaded successfully.');
            } else {
                this._toasty.errorToast(output.file.response?.message, output.file.response?.code);
            }
        }
    }

    public updateTemplate(logoUniqueName: string) {
        let data = cloneDeep(this._invoiceUiDataService.customTemplate.getValue());
        if (data.name) {
            data.logoUniqueName = logoUniqueName;
            data.updatedAt = null;
            data.updatedBy = null;
            // data.copyFrom = 'gst_template_a';
            data.sections['header'].data['pan'].label = '';
            data.sections['header'].data['companyName'].label = '';
            // data.sections['table'].data['taxes'].field = 'taxes';
            // data.sections['footer'].data['grandTotal'].field = 'grandTotal';
            // if (data.sections['table'].data['taxes'].field === 'taxes' && data.sections[1].data[7].field !== 'taxableValue') {
            //   data.sections[1].data[8].field = 'taxableValue';
            // }

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

        // template.sections[2].content[9].label = template.sections[2].content[9].label.replace(/(?:\r\n|\r|\n)/g, '<br />');
        return template;
    }

    public startUpload(): void {
        let sessionId = null;
        let companyUniqueName = null;
        this.sessionId$.pipe(take(1)).subscribe(a => sessionId = a);
        this.companyUniqueName$.pipe(take(1)).subscribe(a => companyUniqueName = a);
        const event: UploadInput = {
            type: 'uploadAll',
            url: Configuration.ApiUrl + INVOICE_API.UPLOAD_LOGO?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)),
            method: 'POST',
            headers: { 'Session-Id': sessionId },
        };

        this.uploadInput.emit(event);
    }

    public previewFile(files: any) {
        let preview: any = document.getElementById('logoImage');
        let a: any = document.querySelector('input[type=file]');
        let file = a.files[0];
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

    public cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id });
    }

    public removeFile(id: string): void {
        this.uploadInput.emit({ type: 'remove', id });
    }

    public removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
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
        this.removeAllFiles();
        this.onValueChange('logoUniqueName', null);
        this._invoiceUiDataService.setLogoPath('');
        this.files = []; // local uploading files array
        // this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
        this.logoAttached = false;
        this.isFileUploaded = false;
        this.isFileUploadInProgress = false;
        this.showDeleteButton = false;
        this.showUploadButton = false;
        if (this.logoFile) {
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
                    if (font.value === this.customTemplate.font) {
                        this.selectedFont = font.label;
                    }
                });
            }

            if (this.customTemplate.fontSize) {
                this.presetFontsSize.map(fontSize => {
                    if (fontSize.value === this.customTemplate.fontSize) {
                        this.selectedFontSize = fontSize.label;
                    }
                });
            }
        }
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
