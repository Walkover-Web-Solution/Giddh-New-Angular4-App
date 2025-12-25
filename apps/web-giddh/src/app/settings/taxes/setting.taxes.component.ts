import { combineLatest, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { select, Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { Angular21ChangeDetectionService } from '../../services/angular21-change-detection.service';
import { AppState } from '../../store';
import * as dayjs from 'dayjs';
import { CompanyActions } from '../../actions/company.actions';
import { TaxResponse } from '../../models/api-models/Company';
import { SettingsTaxesActions } from '../../actions/settings/taxes/settings.taxes.action';
import { IOption } from '../../app.constant';
import { IForceClear } from '../../models/api-models/Sales';
import { cloneDeep, each, map } from '../../lodash-optimized';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { ASIDE_PANE_CONFIG } from '../../app.constant';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: 'setting-taxes',
    templateUrl: './setting.taxes.component.html',
    styleUrls: ['./setting.taxes.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Default
})
export class SettingTaxesComponent implements OnInit, OnDestroy {
    /** Holds template reference for create/update tax dialog */
    @ViewChild("createUpdateDialog") public createUpdateDialog: TemplateRef<any>;
    /** Holds template reference for tax confirmation dialog */
    @ViewChild("taxConfirmationDialog") public taxConfirmationDialog: TemplateRef<any>;
    public availableTaxes: TaxResponse[] = [];
    public newTaxObj: TaxResponse = new TaxResponse();
    public dayjs = dayjs;
    public days: IOption[] = [];
    public records = []; // This array is just for generating dynamic ngModel
    public taxToEdit = []; // It is for edit toogle
    public showFromDatePicker: boolean = false;
    public showDatePickerInTable: boolean = false;
    public selectedTax: TaxResponse = null;
    public confirmationMessage: string;
    public confirmationFor: string;
    public accounts$: IOption[];
    public taxList: IOption[] = [];
    public duration: IOption[] = [];
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds table data */
    public dataSource: MatTableDataSource<any> = new MatTableDataSource();
    /** Reference to MatTable for manual refresh */
    @ViewChild(MatTable) table: MatTable<any>;
    /** Holds table display columns */
    public displayedColumns: string[] = ['index', 'taxNumber', 'name', 'taxAuthority', 'linkedAccount', 'appliedFrom', 'taxPercentage', 'fileDate', 'duration', 'taxType', 'actions'];
    /** Holds create update dialog reference */
    public createUpdateDialogRef: MatDialogRef<any>;
    /** Holds tax delete confirmation dialog reference */
    public taxConfirmationDialogRef: MatDialogRef<any>;
    /** Voucher API Version */
    public voucherApiVersion: number;

    constructor(
        private store: Store<AppState>,
        private _companyActions: CompanyActions,
        private _settingsTaxesActions: SettingsTaxesActions,
        public dialog: MatDialog,
        private generalService: GeneralService,
        private cdRef: ChangeDetectorRef,
        private ngZone: NgZone,
        private changeDetectionService: Angular21ChangeDetectionService
    ) { }

    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        for (let i = 1; i <= 31; i++) {
            let day = i?.toString();
            this.days.push({ label: day, value: day });
        }
        this.store.dispatch(this._companyActions.getTax());
        this.store.pipe(select(p => p.company), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o.taxes) {
                this.forceClear$ = observableOf({ status: true });
                map(o.taxes, (tax) => {
                    each(tax.taxDetail, (t) => {
                        t.date = dayjs(t.date, GIDDH_DATE_FORMAT);
                    });
                });
                this.availableTaxes = cloneDeep(o.taxes);
                this.toggleTaxAuthority();
                this.changeDetectionService.updateDataSourceWithChangeDetection(
                    this.dataSource, this.availableTaxes,
                    this.cdRef, this.ngZone, this.table
                );
                this.onCancel();
            }

            this.isLoading = o.isTaxesLoading;
        });

        combineLatest([
            this.store.pipe(select(state => state.company && state.company.isTaxCreatedSuccessfully)),
            this.store.pipe(select(state => state.company && state.company.isTaxUpdatedSuccessfully))
        ])
            .pipe(takeUntil(this.destroyed$)).subscribe(
                ([isTaxCreatedSuccessfully, isTaxUpdatedSuccessfully]) => {
                    if (isTaxCreatedSuccessfully || isTaxUpdatedSuccessfully) {
                        this.createUpdateDialogRef?.close();
                    }
                });
    }
    /**
     * Delete the tax and open the confirmation dialog
     *
     * @param taxToDelete
     * @returns
     */
    public deleteTax(taxToDelete: any): void {
        this.selectedTax = this.availableTaxes.find((tax) => tax?.uniqueName === taxToDelete?.uniqueName);
        if (!this.selectedTax) {
            return;
        }
        this.newTaxObj = taxToDelete;
        this.confirmationMessage = this.localeData?.tax_delete_message?.replace("[TAX_NAME]", this.selectedTax.name);
        this.confirmationFor = 'delete';
        this.openTaxDeleteUpdateConfirmationDialog();
    }

    /**
     * Open Tax Delete/Update Confirmation Dialog
     *
     * @private
     * @param {*} request
     * @memberof CompanyListDialogComponent
     */
    private openTaxDeleteUpdateConfirmationDialog(): void {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '540px',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.confirmationMessage,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(response => {
            this.userConfirmation(response);
        });
    }

    public onCancel() {
        this.newTaxObj = new TaxResponse();
    }

    public userConfirmation(userResponse: boolean) {
        if (userResponse) {
            if (this.confirmationFor === 'delete' && this.newTaxObj.taxType === 'others') {
                if (this.newTaxObj && this.newTaxObj.accounts && this.newTaxObj.accounts.length) {
                    let linkedAccountUniqueName = this.newTaxObj.accounts[0]?.uniqueName;
                    this.store.dispatch(this._settingsTaxesActions.DeleteTax(this.newTaxObj.uniqueName, linkedAccountUniqueName));
                }
            } else if (this.confirmationFor === 'delete') {
                this.store.dispatch(this._settingsTaxesActions.DeleteTax(this.newTaxObj?.uniqueName));
            } else if (this.confirmationFor === 'edit') {
                each(this.newTaxObj.taxDetail, (tax) => {
                    tax.date = dayjs(tax.date).format(GIDDH_DATE_FORMAT);
                });
                this.store.dispatch(this._settingsTaxesActions.UpdateTax(this.newTaxObj));
            }
        }
    }

    public addMoreDateAndPercentage(taxIndex: number) {
        let taxes = cloneDeep(this.availableTaxes);
        taxes[taxIndex].taxDetail.push({ date: null, taxValue: null });
        this.availableTaxes = taxes;
    }

    public removeDateAndPercentage(parentIndex: number, childIndex: number) {
        let taxes = cloneDeep(this.availableTaxes);
        taxes[parentIndex].taxDetail.splice(childIndex, 1);
        this.availableTaxes = taxes;
        this.toggleTaxAuthority();
    }

    public reloadTaxList() {
        this.store.pipe(select(p => p.company), take(1)).subscribe((o) => {
            if (o.taxes) {
                this.onCancel();
                this.availableTaxes = cloneDeep(o.taxes);
                this.toggleTaxAuthority();
            }
        });
    }

    public customAccountFilter(term: string, item: IOption) {
        return (item.label.toLocaleLowerCase()?.indexOf(term) > -1 || item?.value.toLocaleLowerCase()?.indexOf(term) > -1);
    }

    public customDateSorting(a: IOption, b: IOption) {
        return (parseInt(a.label) - parseInt(b.label));
    }

    /**
     * Open create/update tax aside-pane
     *
     * @param {*} [tax]
     * @memberof SettingTaxesComponent
     */
    public openCreateUpdateDialog(tax?: TaxResponse): void {
        this.selectedTax = tax ?? null;
        this.createUpdateDialogRef = this.dialog.open(this.createUpdateDialog, {
            ...ASIDE_PANE_CONFIG,
            autoFocus: false
        });
    }

    /**
     * Releases memory
     *
     * @memberof SettingTaxesComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof SettingTaxesComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.taxList = [
                { label: this.commonLocaleData?.app_tax_types?.gst, value: 'GST' },
                { label: this.commonLocaleData?.app_tax_types?.input_gst, value: 'InputGST' },
                { label: this.commonLocaleData?.app_tax_types?.others, value: 'others' }
            ];

            this.duration = [
                { label: this.commonLocaleData?.app_duration?.monthly, value: 'MONTHLY' },
                { label: this.commonLocaleData?.app_duration?.quarterly, value: 'QUARTERLY' },
                { label: this.commonLocaleData?.app_duration?.half_yearly, value: 'HALFYEARLY' },
                { label: this.commonLocaleData?.app_duration?.yearly, value: 'YEARLY' }
            ];
        }
    }

    /**
     * TrackBy function for table performance optimization
     */
    public trackByFn = this.changeDetectionService.trackByFn;

    /**
     * Toggle Tax Authority columns
     *
     * @private
     * @memberof SettingTaxesComponent
     */
    private toggleTaxAuthority(): void {
        const hasTaxAuthority = this.availableTaxes?.length && this.availableTaxes[0]?.taxAuthority;
        const taxAuthorityIndex = this.displayedColumns.indexOf('taxAuthority');

        if (!hasTaxAuthority && taxAuthorityIndex !== -1) {
            this.displayedColumns = this.displayedColumns?.filter(column => column !== 'taxAuthority');
        } else if (hasTaxAuthority && taxAuthorityIndex === -1) {
            this.displayedColumns.splice(3, 0, 'taxAuthority');
        }
    }
}
