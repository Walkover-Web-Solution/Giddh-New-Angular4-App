import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { ReplaySubject, Observable } from 'rxjs';
import { CustomTemplateResponse } from '../../../../models/api-models/Invoice';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from '../../../../services/invoice.ui.data.service';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';

@Component({
    selector: 'invoice-template',
    templateUrl: 'out.template.component.html',
    styleUrls: ['out.template.component.css']
})

export class OutTemplateComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public isPreviewMode: boolean = true;
    public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
    public logoSrc: string;
    public imageSignatureSrc: string;
    public showLogo: boolean = true;
    public showImageSignature: boolean = false;
    public showCompanyName: boolean;
    public companyGSTIN: string;
    public companyPAN: string;
    public fieldsAndVisibility: any;
    public companyUniqueName: string;
    public voucherType = 'default';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* Company unique name observable */
    public companyUniqueName$: Observable<string>;
    /* This will hold the value if Gst Composition will show/hide */
    public showGstComposition: boolean = false;

    constructor(
        private store: Store<AppState>,
        private _invoiceUiDataService: InvoiceUiDataService,
        private _activatedRoute: ActivatedRoute) {
        let companyUniqueName = null;
        let companies = null;
        let defaultTemplate = null;

        this.store.pipe(select(s => s.session), take(1)).subscribe(ss => {
            companyUniqueName = ss.companyUniqueName;
            companies = ss.companies;
            this.companyUniqueName = ss.companyUniqueName;
        });

        this.companyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));

        this.store.pipe(select(s => s.invoiceTemplate), take(1)).subscribe(ss => {
            defaultTemplate = ss.defaultTemplate;
        });
        this._invoiceUiDataService.initCustomTemplate(companyUniqueName, companies, defaultTemplate);
    }

    public ngOnInit() {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany?.countryV2?.countryName) {
                this.showGstComposition = activeCompany.countryV2.countryName === 'India';
            } else {
                this.showGstComposition = false;
            }
        });
        this._activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (!a) {
                return;
            }
            this.voucherType = a?.voucherType;
        });
        this._invoiceUiDataService.templateVoucherType.pipe(takeUntil(this.destroyed$)).subscribe((voucherType: string) => {
            this.voucherType = cloneDeep(voucherType);
        });

        this._invoiceUiDataService.fieldsAndVisibility.pipe(takeUntil(this.destroyed$)).subscribe((obj) => {
            this.fieldsAndVisibility = cloneDeep(obj);
        });

        this._invoiceUiDataService.logoPath.pipe(takeUntil(this.destroyed$)).subscribe((path: string) => {
            this.logoSrc = cloneDeep(path);
        });

        this._invoiceUiDataService.isLogoVisible.pipe(takeUntil(this.destroyed$)).subscribe((yesOrNo: boolean) => {
            this.showLogo = cloneDeep(yesOrNo);
        });

        this._invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
            if (template && template.logoUniqueName) {
                this.showLogo = true;
                if (!this._invoiceUiDataService.isLogoUpdateInProgress) {
                    this.logoSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + template.logoUniqueName;
                }
            }
            if (template && template.sections) {
                if (template.sections.footer.data.imageSignature?.display) {
                    this.showImageSignature = true;
                    if (template.sections.footer.data.imageSignature.label) {
                        this.imageSignatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + template.sections.footer.data.imageSignature.label;
                    } else {
                        this.imageSignatureSrc = '';
                    }
                } else {
                    this.showImageSignature = false;
                    this.imageSignatureSrc = '';
                }
            } else if (template && template.sections && template.sections.footer.data.slogan?.display) {
                this.showImageSignature = false;
                this.imageSignatureSrc = '';
            }
            this.inputTemplate = cloneDeep(template);
            if (this.inputTemplate.fontSize) {
                this.inputTemplate.fontSmall = this.inputTemplate.fontSize - 4;
                this.inputTemplate.fontDefault = this.inputTemplate.fontSize;
                this.inputTemplate.fontMedium = this.inputTemplate.fontSize - 2;
                this.inputTemplate.fontLarge = this.inputTemplate.fontSize - 1 + 4;
            }
        });

        this._invoiceUiDataService.isCompanyNameVisible.pipe(takeUntil(this.destroyed$)).subscribe((yesOrNo: boolean) => {
            this.showCompanyName = cloneDeep(yesOrNo);
        });

        this.companyGSTIN = this._invoiceUiDataService.companyGSTIN.getValue();
        this.companyPAN = this._invoiceUiDataService.companyPAN.getValue();

        if (this.isPreviewMode) {
            this.templateUISectionVisibility = {
                header: true,
                table: true,
                footer: true
            };
        } else {
            this._invoiceUiDataService.selectedSection.pipe(takeUntil(this.destroyed$)).subscribe((info: TemplateContentUISectionVisibility) => {
                this.templateUISectionVisibility = cloneDeep(info);
            });
        }

        this._invoiceUiDataService.selectedSection.pipe(takeUntil(this.destroyed$)).subscribe((info: TemplateContentUISectionVisibility) => {
            if (this.isPreviewMode) {
                this.templateUISectionVisibility = {
                    header: true,
                    table: true,
                    footer: true
                };
            } else {
                this.templateUISectionVisibility = cloneDeep(info);
            }
        });
    }

    public onClickSection(sectionName: string) {
        if (!this.isPreviewMode) {
            this._invoiceUiDataService.setSelectedSection(sectionName);
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * ngOnChanges
     */
    public ngOnChanges(s: SimpleChanges) {
        if (s && s.isPreviewMode.currentValue) {
            this.templateUISectionVisibility = {
                header: true,
                table: true,
                footer: true
            };
        } else if (s && s.isPreviewMode && !s.isPreviewMode.currentValue && s.isPreviewMode.currentValue !== s.isPreviewMode.previousValue) {
            this.templateUISectionVisibility = {
                header: true,
                table: false,
                footer: false
            };
        }
    }
}
