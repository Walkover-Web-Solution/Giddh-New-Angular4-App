import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Observable, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { DashboardService } from '../../../services/dashboard.service';
import { GiddhCurrencyPipe } from '../../../shared/helpers/pipes/currencyPipe/currencyType.pipe';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../../../services/general.service';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { cloneDeep } from '../../../lodash-optimized';

@Component({
    selector: 'total-overdues-chart',
    templateUrl: 'total-overdues-chart.component.html',
    styleUrls: ['../../home.component.scss', './total-overdues-chart.component.scss'],
})
export class TotalOverduesChartComponent implements OnInit, OnDestroy {
    @ViewChild('datepickerTemplate', { static: true }) public datepickerTemplate: ElementRef;
    /** This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /** This will store modal reference */
    public modalRef: BsModalRef;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** Selected from date */
    public fromDate: string;
    /** Selected to date */
    public toDate: string;
    @Input() public refresh: boolean = false;
    public imgPath: string = '';
    public requestInFlight: boolean = true;
    public totaloverDueChart: typeof Highcharts = Highcharts;
    public chartOptions: Highcharts.Options;
    public sundryDebtorResponse: any = {};
    public sundryCreditorResponse: any = {};
    public totalRecievable: number = 0;
    public totalPayable: number = 0;
    public overDueObj: any = {};
    public ReceivableDurationAmt: number = 0;
    public PaybaleDurationAmt: number = 0;
    public dayjs = dayjs;
    public amountSettings: any = { baseCurrencySymbol: '', balanceDecimalPlaces: '' };
    public universalDate$: Observable<any>;
    public dataFound: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public toRequest: any = { from: '', to: '', refresh: false };
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** this will store active company data */
    public activeCompany: any = {};

    constructor(private store: Store<AppState>, private dashboardService: DashboardService, public currencyPipe: GiddhCurrencyPipe, private cdRef: ChangeDetectorRef, private modalService: BsModalService, private generalService: GeneralService) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        // img path
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.amountSettings.baseCurrencySymbol = activeCompany.baseCurrencySymbol;
                this.amountSettings.balanceDecimalPlaces = activeCompany.balanceDecimalPlaces;
                this.activeCompany = activeCompany;
            }
        });

        // listen for universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                let dates = [];
                dates = [dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT), dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT), false];
                this.getFilterDate(dates);
            }
        });

        /* Observer to store universal from/to date */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);

                this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
    }

    public resetChartData() {
        this.dataFound = false;
        this.overDueObj = {};
        this.totalRecievable = 0;
        this.ReceivableDurationAmt = 0;
        this.totalPayable = 0;
        this.PaybaleDurationAmt = 0;
        this.requestInFlight = false;
        this.cdRef.detectChanges();
    }

    public generateCharts() {
        let baseCurrencySymbol = this.amountSettings.baseCurrencySymbol;
        let cPipe = this.currencyPipe;

        this.chartOptions = {
            colors: ['#F85C88', '#0CB1AF'],
            chart: {
                type: 'pie',
                polar: false,
                className: 'overdue-chart',
                width: 260,
                height: '180px'
            },
            title: {
                text: '',
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
            },
            xAxis: {
                categories: []
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    showInLegend: true,
                    innerSize: '70%',
                    allowPointSelect: true,
                    dataLabels: {
                        enabled: false,
                        crop: true,
                        defer: true
                    },
                    shadow: false
                },
                series: {
                    animation: false,
                    dataLabels: {}
                }
            },
            tooltip: {
                shared: true,
                useHTML: true,
                formatter: function () {
                    return (this.point) ? baseCurrencySymbol + " " + cPipe.transform(this.point.y) + '/-' : '';
                }
            },
            series: [{
                name: 'Total Overdues',
                type: 'pie',
                data: [['Customer Due', this.totalRecievable], ['Vendor Due', this.totalPayable]],
            }],
        };

        this.requestInFlight = false;
        this.cdRef.detectChanges();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getFilterDate(dates: any) {
        if (dates !== null) {
            this.requestInFlight = true;
            this.toRequest.from = dates[0];
            this.toRequest.to = dates[1];
            this.toRequest.refresh = false;
            this.getTotalOverdues();
        }
    }

    public refreshChart() {
        this.requestInFlight = true;
        this.toRequest.refresh = true;
        this.getTotalOverdues();
    }

    /**
     * This will get total overdues for both sundry debtors and creditors
     *
     * @memberof TotalOverduesChartComponent
     */
    public getTotalOverdues(): void {
        this.dataFound = false;
        this.totalRecievable = 0;
        this.totalPayable = 0;
        this.PaybaleDurationAmt = 0
        this.sundryDebtorResponse = [];
        this.sundryCreditorResponse = [];

        this.getTotalOverduesData('sundrydebtors');
        this.getTotalOverduesData('sundrycreditors');
    }

    /**
     * This will draw the chart if data available or will reset the chart
     *
     * @memberof TotalOverduesChartComponent
     */
    public checkPayableAndReceivable(): void {
        if (this.totalRecievable === 0 && this.totalPayable === 0) {
            this.resetChartData();
        } else {
            this.generateCharts();
        }
    }

    /**
     * This will call the api to get the data
     *
     * @param {string} group uniqueName (sundrydebtors or sundrycreditors)
     * @memberof TotalOverduesChartComponent
     */
    public getTotalOverduesData(group: string): void {
        this.dashboardService.getClosingBalance(group, this.toRequest.from, this.toRequest.to, this.toRequest.refresh).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === 'success' && response.body && response.body[0]) {
                this.dataFound = true;

                if (group === "sundrycreditors") {
                    this.sundryCreditorResponse = response.body[0];
                    this.totalPayable = this.sundryCreditorResponse.closingBalance.amount;
                    this.PaybaleDurationAmt = this.sundryCreditorResponse.creditTotal - this.sundryCreditorResponse.debitTotal;
                } else {
                    this.sundryDebtorResponse = response.body[0];
                    this.totalRecievable = this.sundryDebtorResponse.closingBalance.amount;
                    this.ReceivableDurationAmt = this.sundryDebtorResponse.debitTotal - this.sundryDebtorResponse.creditTotal;
                }
            }

            this.checkPayableAndReceivable();
        });
    }

    /**
    * This will show the datepicker
    *
    * @memberof TotalOverduesChartComponent
    */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-xl giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof TotalOverduesChartComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof TotalOverduesChartComponent
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
            this.requestInFlight = true;
            this.toRequest.from = this.fromDate;
            this.toRequest.to = this.toDate;
            this.toRequest.refresh = false;
            this.getTotalOverdues();
        }
    }
}
