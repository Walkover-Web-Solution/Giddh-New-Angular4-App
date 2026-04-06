import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs';
import * as dayjs from 'dayjs';
import { SettingsFinancialYearActions } from '../../actions/settings/financial-year/financial-year.action';
import { IFinancialYearResponse } from '../../services/settings.financial-year.service';
import { ActiveFinancialYear } from '../../models/api-models/Company';
import { createSelector } from 'reselect';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { cloneDeep, isNull, range } from '../../lodash-optimized';
import { IOption } from '../../app.constant';

export interface IGstObj {
    newGstNumber: string;
    newstateCode: number;
    newstateName: string;
    newaddress: string;
    isDefault: boolean;
}

@Component({
    selector: 'financial-year',
    templateUrl: './financial-year.component.html',
    styleUrls: ['./financial-year.component.scss'],
    standalone: false
})

export class FinancialYearComponent implements OnInit, OnDestroy {
    public financialYearObj: IFinancialYearResponse;
    public currentCompanyName: string;
    public financialOptions = [];
    public yearOptions = [];
    public FYPeriodOptions: IOption[] = [];
    public selectedFYPeriod: string;
    public selectedFinancialYearOption: string;
    public selectedYear: number;
    public options: Select2Options = {
        multiple: false,
        width: '300px',
        placeholder: '',
        allowClear: true
    };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds Table Display Columns */
    public displayedColumns: string[] = ['number', 'from', 'to', 'status'];
    /** Holds Table Data to display */
    public dataSource: any[];
    /** Holds true to show add new financial year dropdown */
    public fyAddNewDropdownIsOpen: boolean = false;
    /** Holds true to show change financial year period dropdown */
    public fyPeriodDropdownIsOpen: boolean = false;

    constructor(
        private store: Store<AppState>,
        private settingsFinancialYearActions: SettingsFinancialYearActions
    ) {
    }

    public ngOnInit() {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.currentCompanyName = activeCompany.name;
                this.financialOptions = activeCompany.financialYears?.map(element => {
                    return { label: element?.uniqueName, value: element?.uniqueName };
                });
            }
        });

        this.store.pipe(select(state => state.settings.refreshCompany), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());
            }
        });
    }

    public setYearRange() {
        let endYear = dayjs().year();
        let startYear = dayjs().subtract(7, 'year').year();
        const currentMonth = dayjs().month() + 1;
        const financialYearStartMonth = this.FYPeriodOptions.find(option => option.value === this.selectedFYPeriod)?.additional?.startMonth;
        let yearArray = range(startYear, endYear + (currentMonth >= financialYearStartMonth ? 1 : 0));
        this.yearOptions = yearArray?.map((year: number) => {
            return { label: String(year), value: year };
        });
    }

    public getInitialFinancialYearData() {
        this.setYearRange();
        this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());
        this.store.pipe(select(createSelector([(state: AppState) => state.settings.financialYears], (o) => {
            this.setYearRange();
            if (o) {
                this.financialYearObj = cloneDeep(o);
                if (this.FYPeriodOptions?.length) {
                    this.setLabelSelectedFYPeriod();
                }
                this.fyAddNewDropdownIsOpen = false;
                this.fyPeriodDropdownIsOpen = false;
                let yearOptions = cloneDeep(this.yearOptions);
                (Array.isArray(o.financialYears) ? o.financialYears : []).forEach((fyear) => {
                    let year = dayjs(fyear.financialYearStarts, GIDDH_DATE_FORMAT).year();
                    let yearIndx = yearOptions?.findIndex((y: any) => y?.value === year);
                    if (yearIndx !== -1) {
                        yearOptions.splice(yearIndx, 1);
                    }
                });
                this.yearOptions = cloneDeep(this.formatDateInFinancialYear(yearOptions));
            } else if (isNull(o)) {
                this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());
            }
        })), takeUntil(this.destroyed$)).subscribe();
    }

    /**
     * Formats the given yearOptions to display the financial year period.
     *
     * @param yearOptions The year options to be formatted.
     * @returns The formatted year options.
     * @memberof FinancialYearComponent
     */
    private formatDateInFinancialYear(yearOptions: IOption[]): IOption[] {
        if (yearOptions.length === 0 || !this.selectedFYPeriod) {
            return [];
        }

        const financialYearPeriods: string[] = this.selectedFYPeriod.split('-');
        return yearOptions.map(option => {
            const year = option.value;
            option.label = `${financialYearPeriods[0]} ${year} - ${financialYearPeriods[1]} ${year + 1}`;
            return option;
        });
    }
    
    /**
     * Lock Unlock Financial Year
     *
     * @memberof FinancialYearComponent
     */
    public lockUnlockFinancialYear(financialYear: ActiveFinancialYear) {
        if (financialYear) {
            let year = cloneDeep(financialYear);
            let dataToSend = {
                lockAll: true,
                uniqueName: year?.uniqueName
            };
            financialYear.isLocked = !financialYear.isLocked;
            if (financialYear.isLocked) {
                this.store.dispatch(this.settingsFinancialYearActions.LockFinancialYear(dataToSend));
            } else {
                this.store.dispatch(this.settingsFinancialYearActions.UnlockFinancialYear(dataToSend));
            }
        }
    }

    public selectYear(data) {
        this.selectedYear = data?.value;
    }

    public selectFYPeriod(ev) {
        this.selectedFYPeriod = ev ? ev?.value : null;
    }

    public updateFYPeriod() {
        if (this.selectedFYPeriod) {
            this.store.dispatch(this.settingsFinancialYearActions.UpdateFinancialYearPeriod(this.selectedFYPeriod));
        }
    }

    public addFY() {
        if (this.selectedYear) {
            if (this.selectedYear < dayjs().year()) {
                this.store.dispatch(this.settingsFinancialYearActions.addFinancialYear(this.selectedYear));
            } else {
                this.store.dispatch(this.settingsFinancialYearActions.addFutureFinancialYear(this.selectedYear));
            }
        }
    }

    /**
     * Releases memory
     *
     * @memberof FinancialYearComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof FinancialYearComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.options.placeholder = this.commonLocaleData?.app_select_option;

            this.FYPeriodOptions = [
                { label: this.localeData?.financial_year_period_options?.jan_dec, value: 'JAN-DEC', additional: { startMonth: 1, endMonth: 12 } },
                { label: this.localeData?.financial_year_period_options?.apr_mar, value: 'APR-MAR', additional: { startMonth: 4, endMonth: 3 } },
                { label: this.localeData?.financial_year_period_options?.july_july, value: 'JULY-JULY', additional: { startMonth: 7, endMonth: 6 } }
            ];

            if (this.financialYearObj?.financialYearPeriod) {
                this.setLabelSelectedFYPeriod();
            }
        }
    }

    /**
     * Sets the label of the selected FY period
     *
     * @private
     * @memberof FinancialYearComponent
     */
    private setLabelSelectedFYPeriod(): void {
        this.selectedFYPeriod = this.FYPeriodOptions.find(item => item.value === this.financialYearObj?.financialYearPeriod)?.label;
    }
}
