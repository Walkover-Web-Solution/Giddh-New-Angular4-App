import { ToasterService } from '../../../../../services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { Component, DoCheck, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from '../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../models/api-models/Invoice';
import { Observable, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../store';
import { Configuration } from '../../../../../app.constant';
import { humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput } from 'ngx-uploader';
import { INVOICE_API } from 'apps/web-giddh/src/app/services/apiurls/invoice';
import { CurrentCompanyState } from 'apps/web-giddh/src/app/store/Company/company.reducer';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { NgForm } from '@angular/forms';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';

@Component({
    selector: 'content-selector',
    templateUrl: 'content.filters.component.html',
    styleUrls: ['content.filters.component.scss']
})

export class ContentFilterComponent implements DoCheck, OnInit, OnChanges, OnDestroy {

    @Input() public content: boolean;
    public customTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
    public showTransportField: boolean = true;
    public showCustomField: boolean = true;
    public showCompanyName: boolean;
    public fieldsAndVisibility: any;
    public voucherType = '';
    public formData: FormData;
    public signatureSrc: string = '';
    public fileUploadOptions: UploaderOptions;
    public signatureImgAttached: boolean = false;
    public isSignatureUploadInProgress: boolean = false;
    public uploadInput: EventEmitter<UploadInput>;
    public files: UploadFile[] = [];
    public humanizeBytes: any;
    public dragOver: boolean;
    public imagePreview: any;
    public isFileUploaded: boolean = false;
    public isFileUploadInProgress: boolean = false;
    public companyUniqueName = null;
    public sessionId$: Observable<string>;
    public companyUniqueName$: Observable<string>;
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold the value if Gst Composition will show/hide */
    public showGstComposition: boolean = false;
    /** Stores the image signature ID */
    public imageSignatureId: string;
    /** Stores the active company name */
    public activeCompanyName: string;
    /** Ng form instance of content filter component */
    @ViewChild(NgForm) contentForm: NgForm;

    constructor(
        private store: Store<AppState>,
        private _invoiceUiDataService: InvoiceUiDataService,
        private _activatedRoute: ActivatedRoute,
        private _toasty: ToasterService,
        private invoiceService: InvoiceService
    ) {
        let companies = null;
        let defaultTemplate = null;

        this.store.pipe(select(s => s.session), take(1)).subscribe(ss => {
            this.companyUniqueName = ss.companyUniqueName;
            companies = ss.companies;
        });

        this.store.pipe(select(s => s.invoiceTemplate), take(1)).subscribe(ss => {
            defaultTemplate = ss.defaultTemplate;
        });
        this._invoiceUiDataService.initCustomTemplate(this.companyUniqueName, companies, defaultTemplate);

        this.sessionId$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
    }

    /**
     * Initializes and subscribes to observables
     *
     * @memberof ContentFilterComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany?.countryV2?.countryName) {
                this.showGstComposition = activeCompany.countryV2.countryName === 'India';
            } else {
                this.showGstComposition = false;
            }
            this.activeCompanyName = activeCompany?.name;
        });
        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            if (companyData) {
                this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
            }
        });
        this._activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (!a) {
                return;
            }
            this.voucherType = a.voucherType;
            // this.getVoucher(false);
        });
        this._invoiceUiDataService.templateVoucherType.pipe(takeUntil(this.destroyed$)).subscribe((voucherType: string) => {
            this.voucherType = cloneDeep(voucherType);
        });
        this._invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
            if (this.contentForm) {
                this._invoiceUiDataService.setContentForm(this.contentForm);
            }
            this.customTemplate = cloneDeep(template);
            this.assignImageSignature();
        });

        this._invoiceUiDataService.selectedSection.pipe(takeUntil(this.destroyed$)).subscribe((info: TemplateContentUISectionVisibility) => {
            this.templateUISectionVisibility = cloneDeep(info);
        });

        this._invoiceUiDataService.isCompanyNameVisible.pipe(takeUntil(this.destroyed$)).subscribe((yesOrNo: boolean) => {
            this.showCompanyName = cloneDeep(yesOrNo);
        });

        this._invoiceUiDataService.fieldsAndVisibility.pipe(takeUntil(this.destroyed$)).subscribe((obj) => {
            this.fieldsAndVisibility = cloneDeep(obj);
        });

        this.fileUploadOptions = { concurrency: 1, allowedContentTypes: ['image/png', 'image/jpeg'] };
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['content'] && changes['content'].currentValue !== changes['content'].previousValue) {
            this.signatureImgAttached = false;
            this.signatureSrc = '';
            this.assignImageSignature();
            this._invoiceUiDataService.setContentForm(this.contentForm);
        }
    }

    /**
     * Stores the form instance for validation
     *
     * @memberof ContentFilterComponent
     */
    public ngDoCheck(): void {
        this._invoiceUiDataService.setContentForm(this.contentForm);
    }

    /**
     * onFieldChange
     */
    public onFieldChange(sectionName: string, fieldName: string, value: string) {
        let template = cloneDeep(this.customTemplate);
        this._invoiceUiDataService.setContentForm(this.contentForm);
        this._invoiceUiDataService.setCustomTemplate(template);
    }

    public changeDisableShipping() {
        let template = cloneDeep(this.customTemplate);
        // if (!template.sections.header.data.billingAddress.display) {
        //   template.sections.header.data.billingGstin.display = false;
        //   template.sections.header.data.billingState.display = false;
        // } else {
        //   template.sections.header.data.billingGstin.display = true;
        //   template.sections.header.data.billingState.display = true;
        // }
        if (!template.sections.header.data.shippingAddress.display) {
            template.sections.header.data.shippingGstin.display = false;
            template.sections.header.data.shippingState.display = false;

        } else {
            template.sections.header.data.shippingGstin.display = true;
            template.sections.header.data.shippingState.display = true;
        }

        this._invoiceUiDataService.setCustomTemplate(template);
    }
    public changeDisableBilling() {
        let template = cloneDeep(this.customTemplate);
        if (!template.sections.header.data.billingAddress.display) {
            template.sections.header.data.billingGstin.display = false;
            template.sections.header.data.billingState.display = false;
        } else {
            template.sections.header.data.billingGstin.display = true;
            template.sections.header.data.billingState.display = true;
        }

        this._invoiceUiDataService.setCustomTemplate(template);
    }
    /**
     * onChangeFieldVisibility
     */
    public onChangeFieldVisibility(sectionName: string, fieldName: string, value: boolean) {
        let template = cloneDeep(this.customTemplate);
        this._invoiceUiDataService.setContentForm(this.contentForm);
        this._invoiceUiDataService.setCustomTemplate(template);
    }

    /**
     * onChangeCompanyNameVisibility
     */
    public onChangeCompanyNameVisibility() {
        this._invoiceUiDataService.setCompanyNameVisibility(this.showCompanyName);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public onUploadFileOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue' || output.type === 'addedToQueue') {
            if (output.file) {
                this.signatureImgAttached = true;
                this.previewFile();
            }
        } else if (output.type === 'start') {
            this.isSignatureUploadInProgress = true;
        } else if (output.type === 'done') {
            if (output.file.response?.status === 'success') {
                if (this._invoiceUiDataService.unusedImageSignature) {
                    this.removeFileFromServer();
                }
                this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + output.file.response.body?.uniqueName;
                this.customTemplate.sections.footer.data.imageSignature.label = output.file.response.body?.uniqueName;
                this._invoiceUiDataService.unusedImageSignature = output.file.response.body?.uniqueName;
                this.onChangeFieldVisibility(null, null, null);
                this._toasty.successToast('file uploaded successfully.');
                this.startUpload();
            } else {
                this._toasty.errorToast(output.file.response?.message, output.file.response?.code);
            }
            this.isSignatureUploadInProgress = false;
            this.signatureImgAttached = true;
        }
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

    public previewFile() {
        let preview: any = document.getElementById('signatureImage');
        let a: any = document.getElementById('signatureImg-edit');
        let file = a.files[0];
        let reader = new FileReader();

        reader.onloadend = () => {
            preview.src = reader.result;
            this.startUpload();
            //this._invoiceUiDataService.setLogoPath(preview.src);
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            //this._invoiceUiDataService.setLogoPath('');
        }
    }

    public cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id });
    }

    public removeFile(): void {
        this.signatureImgAttached = false;
        this.customTemplate.sections.footer.data.imageSignature.label = '';
        this._invoiceUiDataService.setCustomTemplate(this.customTemplate);
    }

    /**
     * Permanently removes the file from the server
     *
     * @memberof ContentFilterComponent
     */
    public removeFileFromServer(): void {
        this.invoiceService.removeSignature(this._invoiceUiDataService.unusedImageSignature).subscribe(() => { });
    }

    public removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
    }

    /**
     * chooseSigntureType
     */
    public chooseSigntureType(val) {
        let template = cloneDeep(this.customTemplate);
        if (val === 'slogan') {
            template.sections.footer.data.slogan.display = true;
            template.sections.footer.data.imageSignature.display = false;
        } else {
            template.sections.footer.data.imageSignature.display = true;
            template.sections.footer.data.slogan.display = false;
        }
        this._invoiceUiDataService.setCustomTemplate(template);

    }

    /**
     * Change quanity then total quantity will get change
     *
     * @memberof ContentFilterComponent
     */
    public changeDisableQuantity(): void {
        let template = cloneDeep(this.customTemplate);
        if (template && template.sections && template.sections.table && template.sections.table.data && template.sections.table.data.totalQuantity) {
            if (!template.sections.table.data.quantity.display) {
                template.sections.table.data.totalQuantity.display = false;
            } else {
                template.sections.table.data.totalQuantity.display = true;
            }
        }
        this._invoiceUiDataService.setCustomTemplate(template);
    }

    /**
     * Change Tax Bifurcation then total HSN/SAC or Tax table level will get change
     *
     * @param {string} label: String that allow tabel section either HSN/SAC(hsnSac) or Tax (taxRateBifurcation)
     * @param {string} sectionType:  Define section for template A will be 'footer' and for template E will be 'table'
     * @memberof ContentFilterComponent
     */
    public checkedTaxBifurcation(label: string, sectionType: string) {
        let template = cloneDeep(this.customTemplate);
        if (sectionType === 'table' && template && template.sections && template.sections.table && template.sections.table.data && template.sections.table.data.taxBifurcation) {
            if (template.sections.table.data.taxBifurcation.display) {
                template.sections.table.data.taxBifurcation.label = label;
            } else {
                template.sections.table.data.taxBifurcation.label = '';
            }
        } else {
            if (template && template.sections && template.sections.footer && template.sections.footer.data && template.sections.footer.data.taxBifurcation) {
                if (template.sections.footer.data.taxBifurcation.display) {
                    template.sections.footer.data.taxBifurcation.label = label;
                } else {
                    template.sections.footer.data.taxBifurcation.label = '';
                }
            }
        }

        this._invoiceUiDataService.setCustomTemplate(template);
    }

    /**
     * To check document title header is toggle
     *
     * @param {boolean} event
     * @memberof ContentFilterComponent
     */
    public changeInvoiceHeader(event: boolean): void {
        this.customTemplate.sections['header'].data['formNameInvoice'].display = event;
    }

    /**
     * Assigns image signature for CREATE and UPDATE flow
     *
     * @memberof ContentFilterComponent
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
}
