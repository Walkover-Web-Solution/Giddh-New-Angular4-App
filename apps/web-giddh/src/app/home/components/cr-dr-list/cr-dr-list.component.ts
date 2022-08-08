import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input, ElementRef, ViewChild } from '@angular/core';
import { Observable, ReplaySubject, of } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { ContactService } from "../../../services/contact.service";
import { takeUntil } from "rxjs/operators";
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../../../services/general.service';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';

@Component({
    selector: 'cr-dr-list',
    templateUrl: 'cr-dr-list.component.html',
    styleUrls: ['./cr-dr-list.component.scss', '../../home.component.scss'],
})
export class CrDrComponent implements OnInit, OnDestroy {
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate', { static: true }) public datepickerTemplate: ElementRef;
    /** This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /** This will store modal reference */
    public modalRef: BsModalRef;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Selected range label */
    public selectedRangeLabel: any = "";
    public universalDate$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    public dayjs = dayjs;
    public toDate: string;
    public fromDate: string;
    public crAccounts: any[] = [];
    public drAccounts: any[] = [];
    public showRecords: number = 5;
    public dueDate: any;
    public activeCompany: any = {};
    /** This will store the dates returned by api */
    public apiFromDate: string;
    public apiToDate: string;
    /** True, if universal date should only be used once for initializing */
    @Input() initializeDateWithUniversalDate: boolean;
    /** True, if date picker initialization with universal date is successful */
    public isDatePickerInitialized: boolean;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private store: Store<AppState>, private contactService: ContactService, private cdRef: ChangeDetectorRef, private modalService: BsModalService, private generalService: GeneralService) {
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil((this.initializeDateWithUniversalDate) ? of(this.isDatePickerInitialized) : this.destroyed$));
    }

    public ngOnInit() {
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);

                this.dueDate = new Date(dayjs(universalDate[1]).format('YYYY-MM-DD'));
                this.isDatePickerInitialized = true;
                this.getAccountsReport();
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20, query?: string, sortBy: string = '', order: string = 'asc') {
        this.isLoading = true;
        this.drAccounts = [];
        this.crAccounts = [];
        pageNumber = pageNumber ? pageNumber : 1;
        refresh = refresh ? refresh : 'false';

        this.contactService.GetContactsDashboard(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res.status === 'success') {
                if (groupUniqueName === "sundrydebtors") {
                    this.drAccounts = res.body.results;
                }
                if (groupUniqueName === "sundrycreditors") {
                    this.crAccounts = res.body.results;
                }

                if (!(this.fromDate && this.toDate) && res.body && res.body.results && res.body.results.fromDate && res.body.results.toDate) {
                    this.apiFromDate = res.body.results.fromDate;
                    this.apiToDate = res.body.results.toDate;

                    this.apiFromDate = this.apiFromDate.split("-").reverse().join("-");
                    this.apiToDate = this.apiToDate.split("-").reverse().join("-");

                    this.selectedDateRange = { startDate: dayjs(this.apiFromDate), endDate: dayjs(this.apiToDate) };
                    this.selectedDateRangeUi = dayjs(this.apiFromDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.apiToDate).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.fromDate = dayjs(this.apiFromDate).format(GIDDH_DATE_FORMAT);
                    this.toDate = dayjs(this.apiToDate).format(GIDDH_DATE_FORMAT);
                }

                this.cdRef.detectChanges();
            }
            this.isLoading = false;
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getAccountsReport() {
        if (!this.fromDate || !this.toDate) {
            this.fromDate = "";
            this.toDate = "";
        }

        this.getAccounts(this.fromDate, this.toDate, 'sundrydebtors', null, null, 'true', this.showRecords, '', 'closingBalance', 'desc');
        this.getAccounts(this.fromDate, this.toDate, 'sundrycreditors', null, null, 'true', this.showRecords, '', 'closingBalance', 'desc');
    }

    public changeShowRecords(showRecords) {
        this.showRecords = showRecords;
        this.getAccountsReport();
    }

    public getFilterDate(dates: any) {
        if (dates !== null) {
            this.dueDate = new Date(dates[1].split("-").reverse().join("-"));
            this.fromDate = dates[0];
            this.toDate = dates[1];
            this.getAccountsReport();
        }
    }

    /**
     * This will show the datepicker
     *
     * @param {*} element input element
     * @memberof CrDrComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target, element);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-xl giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
        );
    }
    
    /**
    * This will hide the datepicker
    *
    * @memberof ProfitLossComponent
    */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
    * Call back function for date/range selection in datepicker
    *
    * @param {*} value
    * @memberof ProfitLossComponent
    */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.dueDate = new Date(this.toDate.split("-").reverse().join("-"));
            this.getAccountsReport();
        }
    }
}
