import { takeUntil } from 'rxjs/operators';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
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

export class FinancialYearComponent implements OnInit {
    public financialYearObj: IFinancialYearResponse;
    public currentCompanyUniqueName: string;
    public currentCompanyFinancialYearUN: string;
    public currentCompanyName: string;
    public financialOptions = [];
    public yearOptions = [];
    public FYPeriodOptions: IOption[] = [
        { label: 'JAN-DEC', value: 'JAN-DEC' },
        { label: 'APR-MAR', value: 'APR-MAR' },
        { label: 'JULY-JULY', value: 'JULY-JULY' }
    ];
    public selectedFYPeriod: string;
    public selectedFinancialYearOption: string;
    public selectedFinancialYearUN: string;
    public selectedYear: number;
    public options: Select2Options = {
        multiple: false,
        width: '300px',
        placeholder: 'Select Option',
        allowClear: true
    };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });

    constructor(
        private store: Store<AppState>,
        private settingsFinancialYearActions: SettingsFinancialYearActions,
        private _companyActions: CompanyActions
    ) {
    }

    public ngOnInit() {
        this.store.select(createSelector([(state: AppState) => state.settings.refreshCompany], (o) => {
            if (o) {
                this.store.dispatch(this._companyActions.RefreshCompanies());
            }
        })).pipe(takeUntil(this.destroyed$)).subscribe();

        this.store.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            if (s.session) {
                this.currentCompanyUniqueName = _.cloneDeep(s.session.companyUniqueName);
            }
            if (this.currentCompanyUniqueName && s.session.companies) {
                let companies = _.cloneDeep(s.session.companies);
                let comp = companies.find((c) => c.uniqueName === this.currentCompanyUniqueName);
                if (comp) {
                    this.currentCompanyName = comp.name;
                    this.currentCompanyFinancialYearUN = comp.activeFinancialYear.uniqueName;
                    this.financialOptions = comp.financialYears.map(q => {
                        return { label: q.uniqueName, value: q.uniqueName };
                    });
                }
            }
        });
    }

    public setYearRange() {
        let endYear = moment().year(); // moment().subtract(1, 'year').year();
        let startYear = moment().subtract(7, 'year').year(); // moment().subtract(7, 'year').year();
        let yearArray = _.range(startYear, endYear);
        this.yearOptions = yearArray.map(q => {
            return { label: String(q), value: q };
        });
    }

    public getInitialFinancialYearData() {
        this.setYearRange();
        this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());
        this.store.select(createSelector([(state: AppState) => state.settings.financialYears], (o) => {
            this.setYearRange();
            if (o) {
                this.financialYearObj = _.cloneDeep(o);
                let yearOptions = _.cloneDeep(this.yearOptions);
                o.financialYears.forEach((fYear) => {
                    let year = moment(fYear.financialYearStarts, GIDDH_DATE_FORMAT).year();
                    let yearIndx = yearOptions.findIndex((y: any) => y.value === year);
                    if (yearIndx !== -1) {
                        yearOptions.splice(yearIndx, 1);
                    }
                });
                this.yearOptions = _.cloneDeep(yearOptions);
                this.forceClear$ = observableOf({ status: true });
            } else if (_.isNull(o)) {
                // this.store.dispatch(this._companyActions.RefreshCompanies()); // for card G0-1477
                this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());
            }
        })).pipe(takeUntil(this.destroyed$)).subscribe();
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

}
