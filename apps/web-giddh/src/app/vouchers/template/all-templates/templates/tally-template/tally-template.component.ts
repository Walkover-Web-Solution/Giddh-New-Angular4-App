import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SettingsProfileActions } from 'apps/web-giddh/src/app/actions/settings/profile/settings.profile.action';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_DD_MM_YYYY } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { CustomTemplateResponse } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from 'apps/web-giddh/src/app/services/invoice.ui.data.service';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';

@Component({
    selector: 'tally-template',
    templateUrl: './tally-template.component.html',
    styleUrls: ['./tally-template.component.scss']
})

export class TallyTemplateComponent implements OnInit, OnDestroy {
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

    constructor(
        @Inject(ServiceConfig) private serviceConfig,
        private store: Store<AppState>,
        private invoiceUiDataService: InvoiceUiDataService,
        private settingsProfileActions: SettingsProfileActions
    ) {
        this.companySetting$ = this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof TallyTemplateAComponent
     */
    public ngOnInit(): void {

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
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
        this.companySetting$.subscribe(a => {
            if (a && a.address) {
                this.companyAddress = cloneDeep(a.address);
            } else if (!a) {
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
     * Current date in different format
     *
     * @param {boolean} [isDefaultGiddhDate=true]
     * @param {boolean} [dateInNumber=false]
     * @return {*}  {string}
     * @memberof TallyTemplateAComponent
     */
    public getTodayDate(isDefaultGiddhDate: boolean = true, dateInNumber: boolean = false): string {
        return dayjs().format(dateInNumber ? "DDMMYYYY" : (isDefaultGiddhDate ? GIDDH_DATE_FORMAT : GIDDH_DATE_FORMAT_DD_MM_YYYY));
    }

    /**
     * Handle template edit section click
     *
     * @param {string} sectionName
     * @memberof TallyTemplateAComponent
     */
    public onClickSection(sectionName: string): void {
        if (this.isPreviewMode) {
            this.invoiceUiDataService.setSelectedSection(sectionName);
        }
    }

    /**
     * Life cycle hook runs when the component is destroyed
     *
     * @memberof TallyTemplateAComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
