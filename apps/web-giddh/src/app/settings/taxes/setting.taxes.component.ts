import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { select, Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppState } from '../../store';
import * as dayjs from 'dayjs';
import { CompanyActions } from '../../actions/company.actions';
import { TaxResponse } from '../../models/api-models/Company';
import { SettingsTaxesActions } from '../../actions/settings/taxes/settings.taxes.action';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IOption } from '../../theme/ng-select/ng-select';
import { IForceClear } from '../../models/api-models/Sales';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { cloneDeep, each, map } from '../../lodash-optimized';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'setting-taxes',
    templateUrl: './setting.taxes.component.html',
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ],
    styleUrls: ['./setting.taxes.component.scss'],
})
export class SettingTaxesComponent implements OnInit, OnDestroy {

    // @ViewChild('taxConfirmationModel', { static: true }) public taxConfirmationModel: ModalDirective;
    @ViewChild("newTaxDialogAside") newTaxDialog: TemplateRef<any>;
    @ViewChild("taxConfirmationModel") taxConfirmationModel: TemplateRef<any>;
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
    public taxAsideMenuState: string = 'out';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public dataSource: MatTableDataSource<any> = new MatTableDataSource();
    public displayedColumns: string[] = ['index', 'taxNumber', 'name', 'appliedFrom', 'taxPercentage', 'fileDate', 'duration', 'taxType', 'actions'];


    constructor(
        private store: Store<AppState>,
        private _companyActions: CompanyActions,
        private _settingsTaxesActions: SettingsTaxesActions,
        public dialog: MatDialog
    ) {

    }

    public ngOnInit() {
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
                this.dataSource.data = this.availableTaxes;
                this.onCancel();
            }

            this.isLoading = o.isTaxesLoading;
        });

        this.store
            .pipe(select(p => p.company && p.company.isTaxCreatedSuccessfully), takeUntil(this.destroyed$))
            .subscribe(result => {
                if (result && this.taxAsideMenuState === 'in') {
                    this.toggleTaxAsidePane();
                }
            });

        this.store
            .pipe(select(state => state.company && state.company.isTaxUpdatedSuccessfully), takeUntil(this.destroyed$))
            .subscribe(result => {
                if (result && this.taxAsideMenuState === 'in') {
                    this.toggleTaxAsidePane();
                }
            });
    }

    public deleteTax(taxToDelete): void {
        // this.newTaxObj = taxToDelete;
        // this.selectedTax = this.availableTaxes.find((tax) => tax?.uniqueName === taxToDelete?.uniqueName);
        // let message = this.localeData?.tax_delete_message;
        // message = message?.replace("[TAX_NAME]", this.selectedTax.name);
        // this.confirmationMessage = message;
        // this.confirmationFor = 'delete';
        // this.taxConfirmationModel?.show();

        this.dialog.open(this.taxConfirmationModel, {
            width: '580px'
        });
    }



    public updateTax(taxIndex: number) {
        let selectedTax = cloneDeep(this.availableTaxes[taxIndex]);
        this.newTaxObj = selectedTax;
        let message = this.localeData?.tax_update_message;
        message = message?.replace("[TAX_NAME]", this.selectedTax.name);
        this.confirmationMessage = message;
        this.confirmationFor = 'edit';
        // this.taxConfirmationModel?.show();
    }

    public onCancel() {
        this.newTaxObj = new TaxResponse();
    }

    public userConfirmation(userResponse: boolean) {
        // this.taxConfirmationModel.hide();
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
    }

    public reloadTaxList() {
        this.store.pipe(select(p => p.company), take(1)).subscribe((o) => {
            if (o.taxes) {
                this.onCancel();
                this.availableTaxes = cloneDeep(o.taxes);
            }
        });
    }

    public customAccountFilter(term: string, item: IOption) {
        return (item.label.toLocaleLowerCase()?.indexOf(term) > -1 || item?.value.toLocaleLowerCase()?.indexOf(term) > -1);
    }

    public customDateSorting(a: IOption, b: IOption) {
        return (parseInt(a.label) - parseInt(b.label));
    }

    public toggleTaxAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.taxAsideMenuState = this.taxAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public addTaxDialogOpen(): void {
        this.dialog.open(this.newTaxDialog, {
            position: {
                right: '0',
                top: '0'
            },
            width: '760px',
            height: '100vh !important'
        });
    }

    public toggleBodyClass() {
        if (this.taxAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
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
}
