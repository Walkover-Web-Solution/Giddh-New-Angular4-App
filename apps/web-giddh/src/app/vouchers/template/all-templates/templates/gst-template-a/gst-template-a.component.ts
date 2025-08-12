import { Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SettingsProfileActions } from 'apps/web-giddh/src/app/actions/settings/profile/settings.profile.action';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { CountryNames } from 'apps/web-giddh/src/app/shared/Enums/common.enum';
import { CustomTemplateResponse } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from 'apps/web-giddh/src/app/services/invoice.ui.data.service';

@Component({
    selector: 'gst-template-a',
    templateUrl: './gst-template-a.component.html',
    styleUrls: ['./gst-template-a.component.scss']
})

export class GstTemplateAComponent implements OnInit, OnDestroy, OnChanges {
    /** Holds fields and visibility object */
    public fieldsAndVisibility: any = null;
    /** Holds true if preview mode */
    public isPreviewMode: boolean;
    /** Holds true to show company logo */
    public showLogo: boolean = true;
    /** Holds true if show company name */
    public showCompanyName: boolean;
    /** Holds company GSTIN  number as string */
    public companyGSTIN: string;
    /** Holds true if company PAN number as string */
    public companyPAN: string;
    /** Holds template input data */
    public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    /** Holds uploaded company logo source */
    public logoSrc: string;
    /** Holds uploaded image signature source */
    public imageSignatureSrc: string;
    /** Holds true show image signature */
    public showImageSignature: boolean;
    /* This will hold active company*/
    public activeCompany: any;
    /** Holds template UI Section Visibility  status and label name */
    public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
    /* This will hold the value if Gst Composition will show/hide */
    public showGstComposition: boolean = false;
    /** Holds voucher type */
    public voucherType: string;
    /** Holds company setting */
    public companySetting$: Observable<any> = observableOf(null);
    /** Holds company address */
    public companyAddress: string = '';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds dollar symbol */
    public dollarSymbol = '$';
    /** Holds true if company Base Currency is Rupee */
    public isBaseCurrencyRupee = true;
    /** Holds rupee symbol */
    public rupeeSymbol = '&#8377';
    /** Holds images folder path */
    public imgPath: string = "";
    /** Holds company unique name */
    public companyUniqueName: string;
    /* Company unique name observable */
    public companyUniqueName$: Observable<string>;
    /** Holds the value if company is Indian */
    public isIndianCompany: boolean = false;
    /** Holds columns visibility */
    public columnsVisibled: number;

    constructor(
        @Inject(ServiceConfig) private serviceConfig,
        private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions,
        private invoiceUiDataService: InvoiceUiDataService) {
        this.companySetting$ = this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$));
    }

    /**
     * Angular lifecycle hook that is called after data-bound properties are initialized.
     * Initializes company, template, and UI data for the template editor.
     *
     * @memberof GstTemplateAComponent
     */
    public ngOnInit(): void {
        this.isIndianCompany = this.activeCompany?.countryV2?.countryName === CountryNames.INDIA;
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';

        this.invoiceUiDataService.fieldsAndVisibility.pipe(takeUntil(this.destroyed$)).subscribe((obj) => {
            this.fieldsAndVisibility = cloneDeep(obj);
        });

        this.invoiceUiDataService.isPreviewMode.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.templateUISectionVisibility = new TemplateContentUISectionVisibility();
            this.isPreviewMode = res;
            if (!res) {
                this.templateUISectionVisibility.header = true;
                this.templateUISectionVisibility.table = true;
                this.templateUISectionVisibility.footer = true;
            } else {
                this.invoiceUiDataService.selectedSection.pipe(takeUntil(this.destroyed$)).subscribe((info: TemplateContentUISectionVisibility) => {
                    this.templateUISectionVisibility = cloneDeep(info);
                });
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany?.countryV2?.countryName) {
                this.activeCompany = cloneDeep(activeCompany);
                this.showGstComposition = activeCompany.countryV2.countryName === 'India';
            } else {
                this.showGstComposition = false;
            }
        });

        this.invoiceUiDataService.templateVoucherType.pipe(takeUntil(this.destroyed$)).subscribe((voucherType: string) => {
            this.voucherType = cloneDeep(voucherType);
        });

        this.companySetting$.subscribe(response => {
            if (response && response.address) {
                this.companyAddress = cloneDeep(response.address);
            } else if (!response) {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            }
        });

        this.store.pipe(select(s => s.session), take(1)).subscribe(ss => {
            this.companyUniqueName = ss.companyUniqueName;
        });

        this.companyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));
        this.companyGSTIN = this.invoiceUiDataService.companyGSTIN.getValue();
        this.companyPAN = this.invoiceUiDataService.companyPAN.getValue();

        this.invoiceUiDataService.isLogoVisible.pipe(takeUntil(this.destroyed$)).subscribe((yesOrNo: boolean) => {
            this.showLogo = cloneDeep(yesOrNo);
        });

        this.invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
            if (template && template.logoUniqueName) {
                this.showLogo = true;
                if (!this.invoiceUiDataService.isLogoUpdateInProgress) {
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

        this.invoiceUiDataService.logoPath.pipe(takeUntil(this.destroyed$)).subscribe((path: string) => {
            this.logoSrc = cloneDeep(path);
        });
    }

    /**
     * Handles click events on template sections. Sets the selected section if not in preview mode.
     *
     * @param sectionName Name of the section clicked
     * @memberof GstTemplateAComponent
     */
    public onClickSection(sectionName: string): void {
        if (this.isPreviewMode) {
            this.invoiceUiDataService.setSelectedSection(sectionName);
        }
    }

    /**
     * Angular lifecycle hook that is called when the component is destroyed.
     * Cleans up subscriptions and resources.
     *
     * @memberof GstTemplateAComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Angular lifecycle hook that is called when any data-bound property of a directive changes.
     * Updates section visibility and column visibility based on changes.
     *
     * @param changes The changed properties
     * @memberof GstTemplateAComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.columnsVisibled = 0;
        if (changes.fieldsAndVisibility.currentValue.table) {
            if (changes.fieldsAndVisibility.currentValue.table.sNo && changes.fieldsAndVisibility.currentValue.table.sNo?.display) {
                this.columnsVisibled++;
            }
            if ((changes.fieldsAndVisibility.currentValue.table.item && changes.fieldsAndVisibility.currentValue.table.item?.display) || (changes.fieldsAndVisibility.currentValue.table.date && changes.fieldsAndVisibility.currentValue.table.date?.display)) {
                this.columnsVisibled++;
            }
            if (changes.fieldsAndVisibility.currentValue.table.hsnSac && changes.fieldsAndVisibility.currentValue.table.hsnSac?.display) {
                this.columnsVisibled++;
            }
            if (changes.fieldsAndVisibility.currentValue.table.quantity && changes.fieldsAndVisibility.currentValue.table.quantity?.display) {
                this.columnsVisibled++;
            }
            if (changes.fieldsAndVisibility.currentValue.table.rate && changes.fieldsAndVisibility.currentValue.table.rate?.display) {
                this.columnsVisibled++;
            }
            if (changes.fieldsAndVisibility.currentValue.table.discount && changes.fieldsAndVisibility.currentValue.table.discount?.display) {
                this.columnsVisibled++;
            }
            if (changes.fieldsAndVisibility.currentValue.table.taxableValue && changes.fieldsAndVisibility.currentValue.table.taxableValue?.display) {
                this.columnsVisibled++;
            }
            if (changes.fieldsAndVisibility.currentValue.table.taxes && changes.fieldsAndVisibility.currentValue.table.taxes?.display) {
                this.columnsVisibled++;
            }
            if (changes?.fieldsAndVisibility?.currentValue?.table?.displayBaseCurrency && changes.fieldsAndVisibility.currentValue.table.displayBaseCurrency?.display) {
                this.columnsVisibled++;
            }
            if (this.columnsVisibled) {
                this.columnsVisibled++;
                this.columnsVisibled++;
                this.columnsVisibled++;
                this.columnsVisibled++;
            }
        }
    }
}
