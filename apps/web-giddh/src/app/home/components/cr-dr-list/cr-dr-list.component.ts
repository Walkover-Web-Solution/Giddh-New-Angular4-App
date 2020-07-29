import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input, ElementRef, ViewChild } from '@angular/core';
import { Observable, ReplaySubject, of } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { ContactService } from "../../../services/contact.service";
import { take, takeUntil } from "rxjs/operators";
import { createSelector } from "reselect";
import * as moment from 'moment/moment';
import { CompanyResponse } from "../../../models/api-models/Company";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GeneralService } from '../../../services/general.service';

@Component({
    selector: 'cr-dr-list',
    templateUrl: 'cr-dr-list.component.html',
    styleUrls: ['./cr-dr-list.component.scss', '../../home.component.scss'],
})

export class CrDrComponent implements OnInit, OnDestroy {
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* Selected range label */
    public selectedRangeLabel: any = "";
    public universalDate$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public datePickerOptions: any;
    public moment = moment;
    public toDate: string;
    public fromDate: string;
    public crAccounts: any[] = [];
    public drAccounts: any[] = [];
    public showRecords: number = 5;
    public dueDate: any;
    public companies$: Observable<CompanyResponse[]>;
    public activeCompanyUniqueName$: Observable<string>;
    public activeCompany: any = {};
    /* This will store the dates returned by api */
    public apiFromDate: string;
    public apiToDate: string;
    /* This will store the dates returned by api */

    /** True, if universal date should only be used once for initializing */
    @Input() initializeDateWithUniversalDate: boolean;
    /** True, if date picker initialization with universal date is successful */
    public isDatePickerInitialized: boolean;

    constructor(private store: Store<AppState>, private _contactService: ContactService, private cdRef: ChangeDetectorRef, private modalService: BsModalService,
        private generalService: GeneralService) {
        this.activeCompanyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
        this.companies$ = this.store.pipe(select(p => p.session.companies), takeUntil(this.destroyed$));
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil((this.initializeDateWithUniversalDate) ? of(this.isDatePickerInitialized) : this.destroyed$));
    }

    public ngOnInit() {

        /* This will get the date range picker configurations */
        this.store.pipe(select(state => state.company.dateRangePickerConfig), takeUntil(this.destroyed$)).subscribe(config => {
            if (config) {
                this.datePickerOptions = config;
            }
        });
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                // this.datePickerOptions = {
                //     ...this.datePickerOptions, startDate: moment(universalDate[0], GIDDH_DATE_FORMAT).toDate(),
                //     endDate: moment(universalDate[1], GIDDH_DATE_FORMAT).toDate(),
                //     chosenLabel: universalDate[2]
                // };
                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);

                this.dueDate = new Date(moment(universalDate[1]).format('YYYY-MM-DD'));
                this.isDatePickerInitialized = true;
                this.getAccountsReport();
            }
        });

        this.companies$.subscribe(c => {
            if (c) {
                let activeCompany: CompanyResponse;
                this.activeCompanyUniqueName$.pipe(take(1)).subscribe(a => {
                    activeCompany = c.find(p => p.uniqueName === a);
                    if (activeCompany) {
                        this.activeCompany = activeCompany;
                    }
                });
            }
        });
    }

    private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20, query?: string, sortBy: string = '', order: string = 'asc') {
        this.drAccounts = [];
        this.crAccounts = [];
        pageNumber = pageNumber ? pageNumber : 1;
        refresh = refresh ? refresh : 'false';

        this._contactService.GetContactsDashboard(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order).subscribe((res) => {
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

                    // this.datePickerOptions = {
                    //     ...this.datePickerOptions, startDate: moment(this.apiFromDate, GIDDH_DATE_FORMAT).toDate(),
                    //     endDate: moment(this.apiToDate, GIDDH_DATE_FORMAT).toDate(),
                    //     chosenLabel: "Custom range"
                    // };

                    this.selectedDateRange = { startDate: moment(this.apiFromDate), endDate: moment(this.apiToDate) };
                    this.selectedDateRangeUi = moment(this.apiFromDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(this.apiToDate).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.fromDate = moment(this.apiFromDate).format(GIDDH_DATE_FORMAT);
                    this.toDate = moment(this.apiToDate).format(GIDDH_DATE_FORMAT);
                }

                this.cdRef.detectChanges();
            }
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
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
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
    public dateSelectedCallback(value: any): void {
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.dueDate = new Date(this.toDate.split("-").reverse().join("-"));
            this.getAccountsReport();
        }
    }
}
