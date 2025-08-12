import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
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
    public fieldsAndVisibility: any = null;
    /** This will use preview mode */
    public isPreviewMode: boolean;
    /** This will use for field visibility */
    public showCompanyName: boolean;
    /** This will use for company GSTIN */
    public companyGSTIN: string;
    /** This will use input teplate response */
    public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    /** This will use for template UI section visibility */
    public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
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
            this.fieldsAndVisibility = cloneDeep(obj);
        });

        this.store.pipe(select(s => s.session), take(1)).subscribe(ss => {
            this.companyUniqueName = ss.companyUniqueName;
        });

        this.companyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));

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
            this.inputTemplate = cloneDeep(template);
            if (this.inputTemplate.fontSize) {
                this.inputTemplate.fontSmall = this.inputTemplate.fontSize - 4;
                this.inputTemplate.fontDefault = this.inputTemplate.fontSize;
                this.inputTemplate.fontMedium = this.inputTemplate.fontSize - 2;
                this.inputTemplate.fontLarge = this.inputTemplate.fontSize - 1 + 4;
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
        if ((changes.fieldsAndVisibility && changes.fieldsAndVisibility.previousValue && changes.fieldsAndVisibility.currentValue !== changes.fieldsAndVisibility.previousValue) || changes.fieldsAndVisibility && changes.fieldsAndVisibility.firstChange) {
            this.columnsVisibled = 0;
            if (changes.fieldsAndVisibility.currentValue.table) {
                if (changes.fieldsAndVisibility.currentValue.table.sNo && changes.fieldsAndVisibility.currentValue.table.sNo?.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.item && changes.fieldsAndVisibility.currentValue.table.item?.display) {
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
                if (changes.fieldsAndVisibility.currentValue.table.total && changes.fieldsAndVisibility.currentValue.table.total?.display) {
                    this.columnsVisibled++;
                }
                if (this.columnsVisibled && this.voucherType === 'sales') {
                    this.columnsVisibled++;
                }
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
        if (this.isPreviewMode) {
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
