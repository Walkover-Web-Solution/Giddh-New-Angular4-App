import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { SettingsFinancialYearActions } from '../../actions/settings/financial-year/financial-year.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ReplaySubject, Observable, of as observableOf } from 'rxjs';
import { IForceClear } from '../../models/api-models/Sales';
import * as moment from 'moment/moment';
@Component({
    selector: 'financial-year-aside',
    templateUrl: './financial-year-aside.component.html',
    styleUrls: [`./financial-year-aside.component.scss`],
})

export class FinancialYearAsideComponent implements OnInit {
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
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });

    //Event emitter to close the Aside panel
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);


    constructor(
        private store: Store<AppState>,
        private settingsFinancialYearActions: SettingsFinancialYearActions
         
    ) {
    }

    public ngOnInit() {
    }
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit(event);
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