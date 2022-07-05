import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TemplateContentUISectionVisibility } from '../../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../../models/api-models/Invoice';
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
    @Input() public fieldsAndVisibility: any = null;
    /** This will use preview mode */
    @Input() public isPreviewMode: boolean = false;
    /** This will use for field visibility */
    @Input() public showCompanyName: boolean;
    /** This will use for company GSTIN */
    @Input() public companyGSTIN: string;
    /** This will use input teplate response */
    @Input() public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    /** This will use for template UI section visibility */
    @Input() public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
    /* This will hold the value if Gst Composition will show/hide */
    @Input() public showGstComposition: boolean = false;
    /** This will use for voucher type */
    @Input() public voucherType = '';
    /** This will use for image signature */
    @Input() public imageSignatureSrc: string;
    /** This will use for section name */
    @Output() public sectionName: EventEmitter<string> = new EventEmitter();
    /** This will hold input for company address */
    public companyAddress: string = '';
    /** This will use for company settings */
    public companySetting$: Observable<any> = observableOf(null);
    /** This will use for column visibililty */
    public columnsVisibled: number;
    /** This will use for on destroy component */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions) {
        this.companySetting$ = this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$));
    }

    /**
     * Lifecycle hook use for initialization
     *
     * @memberof ThermalTemplateComponent
     */
    public ngOnInit() : void {
        this.companySetting$.subscribe(a => {
            if (a && a.address) {
                this.companyAddress = cloneDeep(a.address);
            } else if (!a) {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            }
        });
    }
    /**
     * Lifecycle hook use for on changes
     *
     * @param {SimpleChanges} changes
     * @memberof ThermalTemplateComponent
     */
    public ngOnChanges(changes: SimpleChanges) : void {
        if ((changes.fieldsAndVisibility && changes.fieldsAndVisibility.previousValue && changes.fieldsAndVisibility.currentValue !== changes.fieldsAndVisibility.previousValue) || changes.fieldsAndVisibility && changes.fieldsAndVisibility.firstChange) {
            this.columnsVisibled = 0;
            if (changes.fieldsAndVisibility.currentValue.table) {
                if (changes.fieldsAndVisibility.currentValue.table.sNo && changes.fieldsAndVisibility.currentValue.table.sNo.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.item && changes.fieldsAndVisibility.currentValue.table.item.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.hsnSac && changes.fieldsAndVisibility.currentValue.table.hsnSac.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.quantity && changes.fieldsAndVisibility.currentValue.table.quantity.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.rate && changes.fieldsAndVisibility.currentValue.table.rate.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.discount && changes.fieldsAndVisibility.currentValue.table.discount.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.taxableValue && changes.fieldsAndVisibility.currentValue.table.taxableValue.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.taxes && changes.fieldsAndVisibility.currentValue.table.taxes.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.total && changes.fieldsAndVisibility.currentValue.table.total.display) {
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
    public onClickSection(sectionName: string) : void {
        if (!this.isPreviewMode) {
            this.sectionName.emit(sectionName);
        }
    }

    /**
     * Lifecycle hook use for on destroy component
     *
     * @memberof ThermalTemplateComponent
     */
    public ngOnDestroy() : void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
