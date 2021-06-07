import { takeUntil } from 'rxjs/operators';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../store/roots';
import { ReplaySubject, Observable, of as observableOf } from 'rxjs';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { SettingsFinancialYearActions } from '../../actions/settings/financial-year/financial-year.action';
import { IFinancialYearResponse } from '../../services/settings.financial-year.service';
import { ActiveFinancialYear } from '../../models/api-models/Company';
import { CompanyActions } from '../../actions/company.actions';
import { createSelector } from 'reselect';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { IForceClear } from '../../models/api-models/Sales';

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
    styleUrls: ['./financial-year.component.scss']
})

export class FinancialYearComponent implements OnInit, OnDestroy {
    public financialYearObj: IFinancialYearResponse;
    public currentCompanyFinancialYearUN: string;
    public currentCompanyName: string;
    public financialOptions = [];
    public yearOptions = [];
    public FYPeriodOptions: IOption[] = [];
    public selectedFYPeriod: string;
    public selectedFinancialYearOption: string;
    public selectedFinancialYearUN: string;
    public selectedYear: number;
    public options: Select2Options = {
        multiple: false,
        width: '300px',
        placeholder: '',
        allowClear: true
    };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        private settingsFinancialYearActions: SettingsFinancialYearActions,
        private _companyActions: CompanyActions
    ) {
    }

    public ngOnInit() {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.currentCompanyName = activeCompany.name;
                this.currentCompanyFinancialYearUN = activeCompany.activeFinancialYear.uniqueName;
                this.financialOptions = activeCompany.financialYears.map(element => {
                    return { label: element.uniqueName, value: element.uniqueName };
                });
            }
        });
    }

    public setYearRange() {
        let endYear = moment().year();
        let startYear = moment().subtract(7, 'year').year();
        let yearArray = _.range(startYear, endYear);
        this.yearOptions = yearArray.map(year => {
            return { label: String(year), value: year };
        });
    }

    public getInitialFinancialYearData() {
        this.setYearRange();
        this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());
        this.store.pipe(select(createSelector([(state: AppState) => state.settings.financialYears], (o) => {
            this.setYearRange();
            if (o) {
                this.financialYearObj = _.cloneDeep(o);
                let yearOptions = _.cloneDeep(this.yearOptions);
                o.financialYears.forEach((fyear) => {
                    let year = moment(fyear.financialYearStarts, GIDDH_DATE_FORMAT).year();
                    let yearIndx = yearOptions.findIndex((y: any) => y.value === year);
                    if (yearIndx !== -1) {
                        yearOptions.splice(yearIndx, 1);
                    }
                });
                this.yearOptions = _.cloneDeep(yearOptions);
                this.forceClear$ = observableOf({ status: true });
            } else if (_.isNull(o)) {
                this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());
            }
        })), takeUntil(this.destroyed$)).subscribe();
    }

    public lockUnlockFinancialYear(financialYear: ActiveFinancialYear) {
        let year = _.cloneDeep(financialYear);
        let dataToSend = {
            lockAll: true,
            uniqueName: year.uniqueName
        };
        financialYear.isLocked = !financialYear.isLocked;
        if (financialYear.isLocked) {
            this.store.dispatch(this.settingsFinancialYearActions.LockFinancialYear(dataToSend));
        } else {
            this.store.dispatch(this.settingsFinancialYearActions.UnlockFinancialYear(dataToSend));
        }
    }

    public selectFinancialYearOption(data) {
        this.selectedFinancialYearUN = data.value;
    }

    public selectYear(data) {
        this.selectedYear = data.value;
    }

    public selectFYPeriod(ev) {
        this.selectedFYPeriod = ev ? ev.value : null;
    }

    public updateFYPeriod() {
        if (this.selectedFYPeriod) {
            this.store.dispatch(this.settingsFinancialYearActions.UpdateFinancialYearPeriod(this.selectedFYPeriod));
        }
    }

    public switchFY() {
        if (this.selectedFinancialYearUN) {
            this.store.dispatch(this.settingsFinancialYearActions.SwitchFinancialYear(this.selectedFinancialYearUN));
            this.store.dispatch(this._companyActions.RefreshCompanies());
        }
    }

    public addFY() {
        if (this.selectedYear) {
            if (this.selectedYear < moment().year()) {
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
                { label: this.localeData?.financial_year_period_options?.jan_dec, value: 'JAN-DEC' },
                { label: this.localeData?.financial_year_period_options?.apr_mar, value: 'APR-MAR' },
                { label: this.localeData?.financial_year_period_options?.july_july, value: 'JULY-JULY' }
            ];
        }
    }
}
