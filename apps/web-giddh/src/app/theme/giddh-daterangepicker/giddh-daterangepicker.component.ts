import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnDestroy, ViewChild } from '@angular/core';
import * as _moment from 'moment';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material/datepicker';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { SettingsFinancialYearActions } from '../../actions/settings/financial-year/financial-year.action';

const moment = _moment;

@Component({
    selector: 'giddh-daterangepicker',
    styleUrls: ['./giddh-daterangepicker.component.scss'],
    templateUrl: './giddh-daterangepicker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GiddhDaterangepickerComponent implements OnInit, OnChanges, OnDestroy {
    /** Emitting selected date object as output */
    @Output() public dateSelected: EventEmitter<any> = new EventEmitter<any>();
    /** Taking start date */
    @Input() public inputStartDate: any = '';
    /** Taking end date */
    @Input() public inputEndDate: any = '';
    /* Instance of date picker */
    @ViewChild('picker', { static: true }) picker: MatDatepicker<Date>;
    /* This will hold start date */
    public startDate: any = '';
    /* This will hold end date */
    public endDate: any = '';
    /* This will hold min date */
    public minDate: any;
    /* This will hold max date */
    public maxDate: any;

    /** Subject to unsubscribe from all listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private settingsFinancialYearActions: SettingsFinancialYearActions) {

    }

    /**
     * Initializes the component
     *
     * @memberof GiddhDaterangepickerComponent
     */
    public ngOnInit(): void {
        this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());

        if (this.inputStartDate) {
            this.startDate = moment(this.inputStartDate, GIDDH_DATE_FORMAT).toDate();
        }
        if (this.inputEndDate) {
            this.endDate = moment(this.inputEndDate, GIDDH_DATE_FORMAT).toDate();
        }

        this.store.pipe(select(state => state.settings.financialYears), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const financialYears = response.financialYears;
                if (financialYears && financialYears.length) {
                    if (financialYears[0].financialYearStarts) {
                        const minDate = new Date(financialYears[0].financialYearStarts.split("-").reverse().join("-"));
                        this.minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                    }

                    if (financialYears[financialYears.length - 1].financialYearEnds) {
                        const maxDate = new Date(financialYears[financialYears.length - 1].financialYearEnds.split("-").reverse().join("-"));
                        this.maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
                    }
                }
            }
        });
    }

    /**
     * Updates the value on value change event
     *
     * @param {SimpleChanges} changes
     * @memberof GiddhDaterangepickerComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.inputStartDate && changes.inputStartDate.currentValue) {
            this.startDate = changes.inputStartDate.currentValue.toDate();
        }
        if (changes.inputEndDate && changes.inputEndDate.currentValue) {
            this.endDate = changes.inputEndDate.currentValue.toDate();
            this.dateSelected.emit({ startDate: this.startDate, endDate: this.endDate });
        }
    }

    /**
     * This will unsubscribe from all the observers
     *
     * @memberof GiddhDaterangepickerComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     * Callback for date range change
     *
     * @param {MatDatepickerInputEvent<Date>} event
     * @memberof GiddhDaterangepickerComponent
     */
    public dateChange(type: string, event: MatDatepickerInputEvent<Date>): void {
        if (type === "start") {
            this.startDate = moment(event.value, GIDDH_DATE_FORMAT).toDate();
        }
        if (type === "end") {
            this.endDate = moment(event.value, GIDDH_DATE_FORMAT).toDate();
        }
    }

    /**
     * This will open the datepicker
     *
     * @memberof GiddhDaterangepickerComponent
     */
    public openDatepicker(): void {
        if (this.picker) {
            this.picker.open();
        }
    }
}
