import { ToasterService } from '../../../../../services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from '../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../models/api-models/Invoice';
import { ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../store';
import { CurrentCompanyState } from 'apps/web-giddh/src/app/store/company/company.reducer';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { NgForm } from '@angular/forms';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { CommonService } from 'apps/web-giddh/src/app/services/common.service';

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
    public signatureImgAttached: boolean = false;
    public isSignatureUploadInProgress: boolean = false;
    public files: any[] = [];
    public dragOver: boolean;
    public imagePreview: any;
    public isFileUploaded: boolean = false;
    public isFileUploadInProgress: boolean = false;
    public companyUniqueName = null;
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold the value if Gst Composition will show/hide */
    public showGstComposition: boolean = false;
    /** Stores the active company name */
    public activeCompanyName: string;
    /** Ng form instance of content filter component */
    @ViewChild(NgForm) contentForm: NgForm;
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;

    constructor(
        private store: Store<AppState>,
        private invoiceUiDataService: InvoiceUiDataService,
        private activatedRoute: ActivatedRoute,
        private toaster: ToasterService,
        private invoiceService: InvoiceService,
        private generalService: GeneralService,
        private commonService: CommonService
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
        this.invoiceUiDataService.initCustomTemplate(this.companyUniqueName, companies, defaultTemplate);
    }

    /**
     * Initializes and subscribes to observables
     *
     * @memberof ContentFilterComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
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
        this.activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (!a) {
                return;
            }
            this.voucherType = a?.voucherType;
        });
        this.invoiceUiDataService.templateVoucherType.pipe(takeUntil(this.destroyed$)).subscribe((voucherType: string) => {
            this.voucherType = cloneDeep(voucherType);
        });
        this.invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
            if (this.contentForm) {
                this.invoiceUiDataService.setContentForm(this.contentForm);
            }
            this.customTemplate = cloneDeep(template);
            this.assignImageSignature();
        });

        this.invoiceUiDataService.selectedSection.pipe(takeUntil(this.destroyed$)).subscribe((info: TemplateContentUISectionVisibility) => {
            this.templateUISectionVisibility = cloneDeep(info);
        });

        this.invoiceUiDataService.isCompanyNameVisible.pipe(takeUntil(this.destroyed$)).subscribe((yesOrNo: boolean) => {
            this.showCompanyName = cloneDeep(yesOrNo);
        });

        this.invoiceUiDataService.fieldsAndVisibility.pipe(takeUntil(this.destroyed$)).subscribe((obj) => {
            this.fieldsAndVisibility = cloneDeep(obj);
        });

        this.files = []; // local uploading files array
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['content'] && changes['content'].currentValue !== changes['content'].previousValue) {
            this.signatureImgAttached = false;
            this.signatureSrc = '';
            this.assignImageSignature();
            this.invoiceUiDataService.setContentForm(this.contentForm);
        }
    }

    /**
     * Stores the form instance for validation
     *
     * @memberof ContentFilterComponent
     */
    public ngDoCheck(): void {
        this.invoiceUiDataService.setContentForm(this.contentForm);
    }

    /**
     * onFieldChange
     */
    public onFieldChange(sectionName: string, fieldName: string, value: string) {
        let template = cloneDeep(this.customTemplate);
        this.invoiceUiDataService.setContentForm(this.contentForm);
        this.invoiceUiDataService.setCustomTemplate(template);
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
        if (!template.sections.header.data.shippingAddress?.display) {
            template.sections.header.data.shippingGstin.display = false;
            template.sections.header.data.shippingState.display = false;

        } else {
            template.sections.header.data.shippingGstin.display = true;
            template.sections.header.data.shippingState.display = true;
        }

        this.invoiceUiDataService.setCustomTemplate(template);
    }

    public changeDisableBilling() {
        let template = cloneDeep(this.customTemplate);
        if (!template.sections.header.data.billingAddress?.display) {
            template.sections.header.data.billingGstin.display = false;
            template.sections.header.data.billingState.display = false;
        } else {
            template.sections.header.data.billingGstin.display = true;
            template.sections.header.data.billingState.display = true;
        }

        this.invoiceUiDataService.setCustomTemplate(template);
    }
    /**
     * onChangeFieldVisibility
     */
    public onChangeFieldVisibility(sectionName: string, fieldName: string, value: boolean) {
        let template = cloneDeep(this.customTemplate);
        this.invoiceUiDataService.setContentForm(this.contentForm);
        this.invoiceUiDataService.setCustomTemplate(template);
    }

    /**
     * onChangeCompanyNameVisibility
     */
    public onChangeCompanyNameVisibility() {
        this.invoiceUiDataService.setCompanyNameVisibility(this.showCompanyName);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Uploads signature
     *
     * @memberof ContentFilterComponent
     */
    public uploadImage(): void {
        const selectedFile: any = document.getElementById("signatureImg-edit");
        if (selectedFile?.files?.length) {
            const file = selectedFile?.files[0];

            this.generalService.getSelectedFileBase64(file, (base64) => {
                this.isSignatureUploadInProgress = true;

                this.commonService.uploadImageBase64({ base64: base64, format: file.type, fileName: file.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isSignatureUploadInProgress = false;

                    if (response?.status === 'success') {
                        if (this.invoiceUiDataService.unusedImageSignature) {
                            this.removeFileFromServer();
                        }
                        this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + response.body?.uniqueName;
                        this.customTemplate.sections.footer.data.imageSignature.label = response.body?.uniqueName;
                        this.invoiceUiDataService.unusedImageSignature = response.body?.uniqueName;
                        this.onChangeFieldVisibility(null, null, null);
                        this.toaster.showSnackBar("success", 'File uploaded successfully.');
                    } else {
                        this.signatureImgAttached = false;
                        this.toaster.showSnackBar("error", response.message);
                    }
                });
            });
        }
    }

    public removeFile(): void {
        this.signatureImgAttached = false;
        this.customTemplate.sections.footer.data.imageSignature.label = '';
        this.invoiceUiDataService.setCustomTemplate(this.customTemplate);
    }

    /**
     * Permanently removes the file from the server
     *
     * @memberof ContentFilterComponent
     */
    public removeFileFromServer(): void {
        this.invoiceService.removeSignature(this.invoiceUiDataService.unusedImageSignature).subscribe(() => { });
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
        this.invoiceUiDataService.setCustomTemplate(template);

    }

    /**
     * Change quanity then total quantity will get change
     *
     * @memberof ContentFilterComponent
     */
    public changeDisableQuantity(): void {
        let template = cloneDeep(this.customTemplate);
        if (template && template.sections && template.sections.table && template.sections.table.data && template.sections.table.data.totalQuantity) {
            if (!template.sections.table.data.quantity?.display) {
                template.sections.table.data.totalQuantity.display = false;
            } else {
                template.sections.table.data.totalQuantity.display = true;
            }
        }
        this.invoiceUiDataService.setCustomTemplate(template);
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

        this.invoiceUiDataService.setCustomTemplate(template);
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
