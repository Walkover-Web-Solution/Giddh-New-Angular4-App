import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import {
    ProfitLossData,
    ProfitLossRequest,
    GetRevenueResponse,
    GetTotalExpenseResponse,
    GetIncomeBeforeTaxes
} from "../../../models/api-models/tb-pl-bs";
import { TBPlBsActions } from "../../../actions/tl-pl.actions";
import { GiddhCurrencyPipe } from '../../../shared/helpers/pipes/currencyPipe/currencyType.pipe';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../../../services/general.service';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { TlPlService } from '../../../services/tl-pl.service';

@Component({
    selector: 'profit-loss',
    templateUrl: 'profit-loss.component.html',
    styleUrls: ['../../home.component.scss', './profit-loss.component.scss'],
})

export class ProfitLossComponent implements OnInit, OnDestroy {
    @Input() public refresh: boolean = false;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate', {static: true}) public datepickerTemplate: ElementRef;
    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    public imgPath: string = '';
    public requestInFlight: boolean = true;
    public profitLossChart: typeof Highcharts = Highcharts;
    public chartOptions: Highcharts.Options;
    public totalIncome: number = 0;
    public totalIncomeType: string = '';
    public totalExpense: number = 0;
    public totalExpenseType: string = '';
    public netProfitLoss: number = 0;
    public netProfitLossType: string = '';
    public plRequest: ProfitLossRequest = { from: '', to: '', refresh: false };
    public amountSettings: any = { baseCurrencySymbol: '' };
    public universalDate$: Observable<any>;
    public dataFound: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private store: Store<AppState>, public tlPlActions: TBPlBsActions, public currencyPipe: GiddhCurrencyPipe, private cdRef: ChangeDetectorRef, private modalService: BsModalService, private generalService: GeneralService, private tlPlService: TlPlService) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        // img path
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if(activeCompany) {
                this.amountSettings.baseCurrencySymbol = activeCompany.baseCurrencySymbol;
            }
        });

        // listen for universal date
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let dates = [];
                dates = [moment(dateObj[0]).format(GIDDH_DATE_FORMAT), moment(dateObj[1]).format(GIDDH_DATE_FORMAT), false];

                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

                this.getFilterDate(dates);
            }
        });
    }

    public resetChartData() {
        this.dataFound = false;
        this.totalIncome = 0;
        this.totalIncomeType = '';
        this.totalExpense = 0;
        this.totalExpenseType = '';
        this.netProfitLossType = '';
        this.netProfitLoss = 0;
        this.requestInFlight = false;
        this.cdRef.detectChanges();
    }

    public generateCharts() {
        let baseCurrencySymbol = this.amountSettings.baseCurrencySymbol;
        let cPipe = this.currencyPipe;

        this.chartOptions = {
            colors: ['#FED46A', '#4693F1'],
            chart: {
                type: 'pie',
                polar: false,
                className: 'profit-loss-chart',
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
                name: 'Profit & Loss',
                type: 'pie',
                data: [['Total Income', this.totalIncome], ['Total Expenses', this.totalExpense]],
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
            this.plRequest.from = dates[0];
            this.plRequest.to = dates[1];
            this.plRequest.refresh = false;
            this.getProfitLossData();
        }
    }

    /**
     * API call to get refresh chart
     *
     * @memberof ProfitLossComponent
     */
    public refreshChart() {
        this.requestInFlight = true;
        this.plRequest.refresh = true;
        this.getProfitLossData();
    }

    /**
     * This will show the datepicker
     *
     * @param {*} element input element reference
     * @memberof ProfitLossComponent
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
        if(value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
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
            this.requestInFlight = true;
            this.plRequest.from = this.fromDate;
            this.plRequest.to = this.toDate;
            this.plRequest.refresh = false;
            this.getProfitLossData();
        }
    }

    /**
     * This will get Profit/loss data
     *
     * @memberof ProfitLossComponent
     */
    public getProfitLossData(): void {
        this.tlPlService.GetProfitLoss(_.cloneDeep(this.plRequest)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if(response?.status === "success" && response?.body) {
                this.dataFound = true;
                let data = _.cloneDeep(response.body) as ProfitLossData;
                let revenue;
                let expense;
                let npl;

                if (data && data.incomeStatment && data.incomeStatment.revenue) {
                    revenue = _.cloneDeep(data.incomeStatment.revenue) as GetRevenueResponse;
                    this.totalIncome = revenue.amount;
                    this.totalIncomeType = (revenue.type === "CREDIT") ? "Cr." : "Dr.";
                } else {
                    this.totalIncome = 0;
                    this.totalIncomeType = '';
                }

                if (data && data.incomeStatment && data.incomeStatment.totalExpenses) {
                    expense = _.cloneDeep(data.incomeStatment.totalExpenses) as GetTotalExpenseResponse;
                    this.totalExpense = expense.amount;
                    this.totalExpenseType = (expense.type === "CREDIT") ? "Cr." : "Dr.";
                } else {
                    this.totalExpense = 0;
                    this.totalExpenseType = '';
                }

                if (data && data.incomeStatment && data.incomeStatment.incomeBeforeTaxes) {
                    npl = _.cloneDeep(data.incomeStatment.incomeBeforeTaxes) as GetIncomeBeforeTaxes;
                    this.netProfitLossType = (npl.type === "CREDIT") ? "+" : "-";
                    this.netProfitLoss = npl.amount;
                } else {
                    this.netProfitLossType = '';
                    this.netProfitLoss = 0;
                }

                if (this.totalIncome === 0 && this.totalExpense === 0) {
                    this.resetChartData();
                } else {
                    this.generateCharts();
                }
            }
            this.requestInFlight = false;
        });
    }
}
