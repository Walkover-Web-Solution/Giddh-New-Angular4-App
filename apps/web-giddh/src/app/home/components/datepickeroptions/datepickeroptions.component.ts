import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment/moment';
import * as _ from 'lodash';
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { Observable, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";

@Component({
    selector: 'datepickeroptions',
    templateUrl: 'datepickeroptions.component.html',
    styleUrls: ['../../home.component.scss']
})

export class DatepickeroptionsComponent implements OnInit, OnDestroy, OnChanges {
    @Input() public fromDate: string;
    @Input() public toDate: string;

    @Output() public filterDates: EventEmitter<any> = new EventEmitter(null);
    public moment = moment;
    public universalDate$: Observable<any>;
    public datePickerOptions: any = {
        hideOnEsc: true,
        opens: 'left',
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        ranges: {
            'This Month to Date': [
                moment().startOf('month'),
                moment()
            ],
            'This Quarter to Date': [
                moment().quarter(moment().quarter()).startOf('quarter'),
                moment()
            ],
            'This Financial Year to Date': [
                (moment().quarter() === 1) ? moment().startOf('year').subtract(1, 'year').month('April').startOf('month') : moment().startOf('year').month('April').startOf('month'),
                moment()
            ],
            'This Year to Date': [
                moment().startOf('year'),
                moment()
            ],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'Last Quarter': [
                moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
                moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
            ],
            'Last Financial Year': [
                (moment().quarter() === 1) ? moment().startOf('year').subtract(2, 'year').month('April').startOf('month') : moment().startOf('year').subtract(1, 'year').month('April').startOf('month'),
                (moment().quarter() === 1) ? moment().startOf('year').subtract(1, 'year').month('March').endOf('month') : moment().month('March').endOf('month')
            ],
            'Last Year': [
                moment().subtract(1, 'year').startOf('year'),
                moment().subtract(1, 'year').endOf('year')
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        // listen for universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                this.datePickerOptions = {
                    ...this.datePickerOptions, startDate: moment(dateObj[0], GIDDH_DATE_FORMAT).toDate(),
                    endDate: moment(dateObj[1], GIDDH_DATE_FORMAT).toDate(), chosenLabel: dateObj[2]
                };
            }
        });
    }

    public setFilterDate(ev) {
        let data = ev ? _.cloneDeep(ev) : null;
        if (data && data.picker) {
            this.filterDates.emit([moment(data.picker.startDate._d).format(GIDDH_DATE_FORMAT), moment(data.picker.endDate._d).format(GIDDH_DATE_FORMAT)]);
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will update the date in calendar returned by the api
     *
     * @param {SimpleChanges} changes
     * @memberof DatepickeroptionsComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.fromDate.currentValue && changes.toDate.currentValue) {
            this.datePickerOptions = {
                ...this.datePickerOptions, startDate: moment(changes.fromDate.currentValue).toDate(),
                endDate: moment(changes.toDate.currentValue).toDate(), chosenLabel: "Custom range"
            };
        }
    }
}
