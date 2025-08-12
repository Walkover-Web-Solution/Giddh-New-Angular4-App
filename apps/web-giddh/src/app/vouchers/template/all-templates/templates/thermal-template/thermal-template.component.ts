import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from 'apps/web-giddh/src/app/services/invoice.ui.data.service';
import { CustomTemplateResponse } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { AppState } from 'apps/web-giddh/src/app/store';
import { SettingsProfileActions } from 'apps/web-giddh/src/app/actions/settings/profile/settings.profile.action';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
@Component({
    selector: 'thermal-template',
    templateUrl: './thermal-template.component.html',
    styleUrls: ['./thermal-template.component.scss']
})
export class ThermalTemplateComponent implements OnInit, OnDestroy, OnChanges {
    /** This will use for field visibility */
    public sectionSettings: any = null;
    /** This will use preview mode */
    public isContentMode: boolean;
    /** This will use for field visibility */
    public showCompanyName: boolean;
    /** This will use for company GSTIN */
    public companyGSTIN: string;
    /** This will use input teplate response */
    public contentTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    /** This will use for template UI section visibility */
    public templateSectionsVisible: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
    /* This will hold the value if Gst Composition will show/hide */
    public showGstComposition: boolean = false;
    /** This will use for voucher type */
    public voucherType = '';
    /** This will use for image signature */
    public imageSignatureSrc: string;
    /** This will hold input for company address */
    public companyAddress: string = '';
    /** This will use for company settings */
    public companySetting$: Observable<any> = observableOf(null);
    /** This will use for column visibililty */
    public columnsVisibled: number;
    /** This will use for on destroy component */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds company unique name */
    public companyUniqueName: string;
    /* Company unique name observable */
    public companyUniqueName$: Observable<string>;

    constructor(private store: Store<AppState>,
        private invoiceUiDataService: InvoiceUiDataService,
        private settingsProfileActions: SettingsProfileActions) {
        this.companySetting$ = this.store.pipe(select(response => response.settings.profile), takeUntil(this.destroyed$));
    }

    /**
     * Lifecycle hook use for initialization
     *
     * @memberof ThermalTemplateComponent
     */
    public ngOnInit(): void {
        this.invoiceUiDataService.fieldsAndVisibility.pipe(takeUntil(this.destroyed$)).subscribe((obj) => {
            this.sectionSettings = cloneDeep(obj);
        });

        this.store.pipe(select(state => state.session), take(1)).subscribe(response => {
            this.companyUniqueName = response.companyUniqueName;
        });

        this.companyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));

        this.invoiceUiDataService.isPreviewMode.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.templateSectionsVisible = new TemplateContentUISectionVisibility();
            this.isContentMode = res;
            if (!res) {
                this.templateSectionsVisible.header = true;
                this.templateSectionsVisible.table = true;
                this.templateSectionsVisible.footer = true;
            } else {
                this.invoiceUiDataService.selectedSection.pipe(takeUntil(this.destroyed$)).subscribe((info: TemplateContentUISectionVisibility) => {
                    this.templateSectionsVisible = cloneDeep(info);
                });
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany?.countryV2?.countryName) {
                this.showGstComposition = activeCompany.countryV2.countryName === 'India';
            } else {
                this.showGstComposition = false;
            }
        });

        this.invoiceUiDataService.templateVoucherType.pipe(takeUntil(this.destroyed$)).subscribe((voucherType: string) => {
            this.voucherType = cloneDeep(voucherType);
        });

        this.companySetting$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.address) {
                this.companyAddress = cloneDeep(response.address);
            } else if (!response) {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            }
        });

        this.companyGSTIN = this.invoiceUiDataService.companyGSTIN.getValue();

        this.invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
            if (template && template.sections) {
                if (template.sections.footer.data.imageSignature?.display) {
                    if (template.sections.footer.data.imageSignature.label) {
                        this.imageSignatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + template.sections.footer.data.imageSignature.label;
                    } else {
                        this.imageSignatureSrc = '';
                    }
                } else {
                    this.imageSignatureSrc = '';
                }
            } else if (template && template.sections && template.sections.footer.data.slogan?.display) {
                this.imageSignatureSrc = '';
            }
            this.contentTemplate = cloneDeep(template);
            if (this.contentTemplate.fontSize) {
                this.contentTemplate.fontSmall = this.contentTemplate.fontSize - 4;
                this.contentTemplate.fontDefault = this.contentTemplate.fontSize;
                this.contentTemplate.fontMedium = this.contentTemplate.fontSize - 2;
                this.contentTemplate.fontLarge = this.contentTemplate.fontSize - 1 + 4;
            }
        });
    }
    /**
     * Lifecycle hook use for on changes
     *
     * @param {SimpleChanges} changes
     * @memberof ThermalTemplateComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (
            (changes.sectionSettings && changes.sectionSettings.previousValue && changes.sectionSettings.currentValue !== changes.sectionSettings.previousValue) ||
            (changes.sectionSettings && changes.sectionSettings.firstChange)
        ) {
            this.columnsVisibled = 0;
            const table = changes.sectionSettings.currentValue?.table;
            if (!table) return;

            const fields = [
                'sNo', 'item', 'hsnSac', 'quantity', 'rate', 'discount', 'taxableValue', 'taxes', 'total'
            ];
            for (const field of fields) {
                if (table[field]?.display) {
                    this.columnsVisibled++;
                }
            }
            if (this.columnsVisibled && this.voucherType === 'sales') {
                this.columnsVisibled++;
            }
        }
    }

    /**
     * This will use for section click preview
     *
     * @param {string} sectionName
     * @memberof ThermalTemplateComponent
     */
    public onClickSection(sectionName: string): void {
        if (this.isContentMode) {
            this.invoiceUiDataService.setSelectedSection(sectionName);
        }
    }

    /**
     * Lifecycle hook use for on destroy component
     *
     * @memberof ThermalTemplateComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
