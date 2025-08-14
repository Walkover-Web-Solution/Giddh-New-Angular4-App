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
    public sectionSettings: any = null;
    /** Holds true if preview mode */
    public isContentMode: boolean;
    /** Holds true to show company logo */
    public showLogo: boolean = true;
    /** Holds true if show company name */
    public showCompanyName: boolean;
    /** Holds company GSTIN  number as string */
    public companyGSTIN: string;
    /** Holds true if company PAN number as string */
    public companyPAN: string;
    /** Holds template input data */
    public contentTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    /** Holds uploaded company logo source */
    public logoSrc: string;
    /** Holds uploaded image signature source */
    public imageSignatureSrc: string;
    /** Holds true show image signature */
    public showImageSignature: boolean;
    /* This will hold active company*/
    public activeCompany: any;
    /** Holds template UI Section Visibility  status and label name */
    public templateSectionsVisible: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
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
        private templateService: InvoiceUiDataService,
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
        // 1. Fields and Visibility
        this.templateService.fieldsAndVisibility.pipe(takeUntil(this.destroyed$)).subscribe(obj => {
            this.sectionSettings = obj ? cloneDeep(obj) : null;
        });

        // 2. Preview Mode and Section Visibility
        this.templateService.isPreviewMode.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            this.isContentMode = res;
            if (!res) {
                this.templateSectionsVisible = { header: true, table: true, footer: true } as TemplateContentUISectionVisibility;
            } else {
                this.templateService.selectedSection.pipe(takeUntil(this.destroyed$)).subscribe((info: TemplateContentUISectionVisibility) => {
                    this.templateSectionsVisible = info ? cloneDeep(info) : new TemplateContentUISectionVisibility();
                });
            }
        });

        // 3. Active Company and GST Composition
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            this.activeCompany = activeCompany ? cloneDeep(activeCompany) : null;
            this.showGstComposition = !!activeCompany?.countryV2?.countryName && activeCompany.countryV2.countryName === 'India';
        });

        // 4. Voucher Type
        this.templateService.templateVoucherType.pipe(takeUntil(this.destroyed$)).subscribe((voucherType: string) => {
            this.voucherType = voucherType || '';
        });

        // 5. Image Path
        this.imgPath = typeof isElectron !== 'undefined' && isElectron
            ? 'assets/images/'
            : ((this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/');

        // 6. Company Setting and Address
        this.companySetting$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.address) {
                this.companyAddress = response.address;
            } else if (!response) {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            }
        });

        // 7. Company Unique Name
        this.store.pipe(select(state => state.session), take(1)).subscribe(res => {
            this.companyUniqueName = res.companyUniqueName;
        });
        this.companyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));

        // 8. Company GSTIN and PAN
        this.companyGSTIN = this.templateService.companyGSTIN.getValue();
        this.companyPAN = this.templateService.companyPAN.getValue();

        // 9. Logo Visibility
        this.templateService.isLogoVisible.pipe(takeUntil(this.destroyed$)).subscribe((yesOrNo: boolean) => {
            this.showLogo = yesOrNo;
        });

        // 10. Custom Template and Logo/Image Signature
        this.templateService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
            this.handleCustomTemplate(template);
        });

        // 11. Logo Path
        this.templateService.logoPath.pipe(takeUntil(this.destroyed$)).subscribe((path: string) => {
            this.logoSrc = path;
        });
    }

    /**
     * Handles custom template logic for logo, image signature, and font sizes
     *
     * @private
     * @param {CustomTemplateResponse} template
     * @memberof TallyTemplateComponent
     */
    private handleCustomTemplate(template: CustomTemplateResponse): void {
        if (template) {
            // Logo
            if (template.logoUniqueName) {
                this.showLogo = true;
                if (!this.templateService.isLogoUpdateInProgress) {
                    this.logoSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + template.logoUniqueName;
                }
            }

            // Image Signature
            if (template.sections?.footer?.data?.imageSignature?.display) {
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

            // Slogan disables image signature
            if (template.sections?.footer?.data?.slogan?.display) {
                this.showImageSignature = false;
                this.imageSignatureSrc = '';
            }

            // Font sizes
            this.contentTemplate = cloneDeep(template);
            if (this.contentTemplate.fontSize) {
                this.contentTemplate.fontSmall = this.contentTemplate.fontSize - 4;
                this.contentTemplate.fontDefault = this.contentTemplate.fontSize;
                this.contentTemplate.fontMedium = this.contentTemplate.fontSize - 2;
                this.contentTemplate.fontLarge = this.contentTemplate.fontSize - 1 + 4;
            }
        } else {
            this.contentTemplate = new CustomTemplateResponse();
            this.showImageSignature = false;
            this.imageSignatureSrc = '';
        }
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
        if (this.isContentMode) {
            this.templateService.setSelectedSection(sectionName);
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
