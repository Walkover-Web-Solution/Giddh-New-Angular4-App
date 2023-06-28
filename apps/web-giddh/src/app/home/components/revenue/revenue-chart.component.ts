import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { HomeActions } from '../../../actions/home/home.actions';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as dayjs from 'dayjs';
import { RevenueGraphDataRequest } from "../../../models/api-models/Dashboard";
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { GiddhCurrencyPipe } from '../../../shared/helpers/pipes/currencyPipe/currencyType.pipe';
import { GeneralService } from "../../../services/general.service";
import { DashboardService } from '../../../services/dashboard.service';
import { ToasterService } from '../../../services/toaster.service';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { Chart, registerables } from 'chart.js';
import { TitleCasePipe } from '@angular/common';
Chart.register(...registerables);

@Component({
    selector: 'revenue-chart',
    templateUrl: 'revenue-chart.component.html',
    styleUrls: ['revenue-chart.component.scss', '../../home.component.scss'],
    providers: [TitleCasePipe],
    encapsulation: ViewEncapsulation.None
})
export class RevenueChartComponent implements OnInit, OnDestroy {
    @Input() public refresh: boolean = false;
    public requestInFlight: boolean = false;
    public revenueGraphTypes: any[] = [];
    public activeGraphType: any;
    public graphParams: any = {
        currentFrom: '',
        currentTo: '',
        previousFrom: '',
        previousTo: '',
        interval: 'daily',
        type: '',
        uniqueName: '',
        refresh: false
    };
    public dayjs = dayjs;
    public currentData: any[] = [];
    public previousData: any[] = [];
    public summaryData: any = { totalCurrent: 0, totalLast: 0, highest: 0, lowest: 0, highestLabel: '', lowestLabel: '' };
    public activeCompany: any = {};
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public getCurrentWeekStartEndDate: any = '';
    public getPreviousWeekStartEndDate: any = '';
    public chartType: 'bar' | 'line' = 'bar';
    public graphExpanded: boolean = false;
    public currentDateRangePickerValue: Date[] = [];
    public previousDateRangePickerValue: Date[] = [];
    /** True if chart changed */
    public chartChanged: boolean = false;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** Hold Chart and used when destroy required */
    public chart: any;
    /* Holds lenght of data comming from api */
    public chartLabelsize = [];


    constructor(private store: Store<AppState>, private homeActions: HomeActions, public currencyPipe: GiddhCurrencyPipe, private generalService: GeneralService, private dashboardService: DashboardService, private toasterService: ToasterService, private titlecasePipe: TitleCasePipe) {
        this.getCurrentWeekStartEndDate = this.getWeekStartEndDate(new Date());
        this.getPreviousWeekStartEndDate = this.getWeekStartEndDate(dayjs(this.getCurrentWeekStartEndDate[0]).subtract(1, 'day'));

        this.currentDateRangePickerValue = [this.getCurrentWeekStartEndDate[0], this.getCurrentWeekStartEndDate[1]];
        this.previousDateRangePickerValue = [this.getPreviousWeekStartEndDate[0], this.getPreviousWeekStartEndDate[1]];

        this.graphParams.currentFrom = dayjs(this.getCurrentWeekStartEndDate[0]).format(GIDDH_DATE_FORMAT);
        this.graphParams.currentTo = dayjs(this.getCurrentWeekStartEndDate[1]).format(GIDDH_DATE_FORMAT);
        this.graphParams.previousFrom = dayjs(this.getPreviousWeekStartEndDate[0]).format(GIDDH_DATE_FORMAT);
        this.graphParams.previousTo = dayjs(this.getPreviousWeekStartEndDate[1]).format(GIDDH_DATE_FORMAT);

        this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });
    }

    public ngOnInit() {
        this.getRevenueGraphTypes();

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getRevenueGraphTypes() {
        this.store.pipe(select(s => s.home.revenueGraphTypes), takeUntil(this.destroyed$)).subscribe(res => {
            this.revenueGraphTypes = [];

            if (res && res.length > 0) {
                Object.keys(res).forEach(key => {
                    if (key === "0") {
                        this.activeGraphType = res[key];
                        this.graphParams.uniqueName = this.activeGraphType['uniqueName'];
                        this.graphParams.type = this.activeGraphType['type'];
                    }
                    this.revenueGraphTypes.push({ uniqueName: res[key]?.uniqueName, type: res[key].type, displayName: res[key].displayName });
                });

                this.getRevenueGraphData();
            } else {
                this.store.dispatch(this.homeActions.getRevenueGraphTypes());
            }
        });
    }

    public getRevenueGraphData(): void {
        this.requestInFlight = true;
        let revenueGraphDataRequest = new RevenueGraphDataRequest();
        revenueGraphDataRequest = this.graphParams;

        this.dashboardService.GetRevenueGraphData(revenueGraphDataRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.currentData = [];
            this.previousData = [];
            this.chartLabelsize = [];
            this.summaryData.totalCurrent = 0;
            this.summaryData.totalLast = 0;
            this.summaryData.highest = 0;
            this.summaryData.lowest = 0;
            let res = response?.body;

            if (response?.status === "success" && res?.balances) {
                if (res.balances !== null) {
                    let x = 0;
                    Object.keys(res.balances).forEach(key => {

                        if (res.balances[key].current) {
                            this.chartLabelsize.push(x);
                            this.currentData.push({
                                x: x,
                                y: giddhRoundOff(res.balances[key].current.closingBalance.amount, this.giddhBalanceDecimalPlaces),
                                tooltipLabel: res.balances[key].current.dateLabel,
                                tooltipAfterLabel: this.titlecasePipe.transform(this.graphParams?.uniqueName) + ": " + this.activeCompany.baseCurrencySymbol + " " + this.currencyPipe.transform(res.balances[key].current.closingBalance.amount)
                            });
                        }

                        if (res.balances[key].previous) {
                            this.previousData.push({
                                x: x,
                                y: giddhRoundOff(res.balances[key].previous.closingBalance.amount, this.giddhBalanceDecimalPlaces),
                                tooltipLabel: res.balances[key].previous.dateLabel,
                                tooltipAfterLabel: this.titlecasePipe.transform(this.graphParams?.uniqueName) + ": " + this.activeCompany.baseCurrencySymbol + " " + this.currencyPipe.transform(res.balances[key].previous.closingBalance.amount)
                            });
                        }

                        x++;
                    });
                }

                let currentHighest = 0;
                let currentLowest = 0;
                let previousHighest = 0;
                let previousLowest = 0;

                if (res.currentClosingBalance !== null && res.currentClosingBalance.amount !== null) {
                    this.summaryData.totalCurrent = giddhRoundOff(res.currentClosingBalance.amount, this.giddhBalanceDecimalPlaces);
                }

                if (res.previousClosingBalance !== null && res.previousClosingBalance.amount !== null) {
                    this.summaryData.totalLast = giddhRoundOff(res.previousClosingBalance.amount, this.giddhBalanceDecimalPlaces);
                }

                if (res.previousHighestClosingBalance !== null && res.previousHighestClosingBalance.amount !== null) {
                    previousHighest = giddhRoundOff(Number(res.previousHighestClosingBalance.amount), this.giddhBalanceDecimalPlaces);
                }

                if (res.currentHighestClosingBalance !== null && res.currentHighestClosingBalance.amount !== null) {
                    currentHighest = giddhRoundOff(Number(res.currentHighestClosingBalance.amount), this.giddhBalanceDecimalPlaces);
                }

                if (res.previousLowestClosingBalance !== null && res.previousLowestClosingBalance.amount !== null) {
                    previousLowest = giddhRoundOff(Number(res.previousLowestClosingBalance.amount), this.giddhBalanceDecimalPlaces);
                }

                if (res.currentLowestClosingBalance !== null && res.currentLowestClosingBalance.amount !== null) {
                    currentLowest = giddhRoundOff(Number(res.currentLowestClosingBalance.amount), this.giddhBalanceDecimalPlaces);
                }

                if (currentHighest > previousHighest) {
                    this.summaryData.highest = giddhRoundOff(res.currentHighestClosingBalance.amount, this.giddhBalanceDecimalPlaces);
                    this.summaryData.highestLabel = res.currentHighestClosingBalance.dateLabel;
                } else {
                    this.summaryData.highest = giddhRoundOff(res.previousHighestClosingBalance.amount, this.giddhBalanceDecimalPlaces);
                    this.summaryData.highestLabel = res.previousHighestClosingBalance.dateLabel;
                }

                if (currentLowest < previousLowest) {
                    this.summaryData.lowest = giddhRoundOff(res.currentLowestClosingBalance.amount, this.giddhBalanceDecimalPlaces);
                    this.summaryData.lowestLabel = res.currentLowestClosingBalance.dateLabel;
                } else {
                    this.summaryData.lowest = giddhRoundOff(res.previousLowestClosingBalance.amount, this.giddhBalanceDecimalPlaces);
                    this.summaryData.lowestLabel = res.previousLowestClosingBalance.dateLabel;
                }

                if (this.chart) {
                    this.chart.destroy();
                }
                this.createChart();
            } else {
                if (response?.status === "error" && response?.message) {
                    this.toasterService.errorToast(response.message);
                }
            }

            this.requestInFlight = false;
        });
    }

    public refreshChart() {
        this.getRevenueGraphData();
    }

    public getWeekStartEndDate(date) {
        // If no date object supplied, use current date
        let now = date ? new Date(date) : new Date();

        // set time to some convenient value
        now.setHours(0, 0, 0, 0);

        // Get the previous Sunday
        let sunday = new Date(now);
        sunday.setDate(sunday.getDate() - sunday.getDay() + 0);

        // Get next Saturday
        let saturday = new Date(now);
        saturday.setDate(saturday.getDate() - saturday.getDay() + 6);

        // Return array of date objects
        return [sunday, saturday];
    }


    public changeGraphType(gtype) {
        this.activeGraphType = gtype;
        this.graphParams.uniqueName = this.activeGraphType['uniqueName'];
        this.graphParams.type = this.activeGraphType['type'];

        this.refreshChart();
    }

    public showLineChart() {
        this.chartChanged = true;
        this.generalService.invokeEvent.next("hideallcharts");
        this.chartLabelsize = [];
        this.summaryData.totalCurrent = 0;
        this.summaryData.totalLast = 0;
        this.summaryData.highest = 0;
        this.summaryData.lowest = 0;
        this.graphParams.interval = "daily";
        this.chartType = "line";
        this.graphExpanded = true;
        this.setPreviousDate();
        this.setCurrentDate();
        if (this.chart) {
            this.chart.destroy();
        }
        setTimeout(() => {
            this.createChart();
        }, 200);
    }

    public updateChartFrequency(interval) {
        this.graphParams.interval = interval;

        this.summaryData.totalCurrent = 0;
        this.summaryData.totalLast = 0;
        this.summaryData.highest = 0;
        this.summaryData.lowest = 0;

        this.createChart();

        setTimeout(() => {
            this.getRevenueGraphData();
        }, 200);
    }

    public setPreviousDate() {
        if ((this.previousDateRangePickerValue[0] !== null) && (this.previousDateRangePickerValue[1] !== null)) {
            this.graphParams.previousFrom = dayjs(this.previousDateRangePickerValue[0]).format(GIDDH_DATE_FORMAT);
            this.graphParams.previousTo = dayjs(this.previousDateRangePickerValue[1]).format(GIDDH_DATE_FORMAT);
            this.getPreviousWeekStartEndDate = [this.previousDateRangePickerValue[0], this.previousDateRangePickerValue[1]];
            this.getRevenueGraphData();
        }
    }


    public setCurrentDate() {
        if ((this.currentDateRangePickerValue[0] !== null) && (this.currentDateRangePickerValue[1] !== null)) {
            this.graphParams.currentFrom = dayjs(this.currentDateRangePickerValue[0]).format(GIDDH_DATE_FORMAT);
            this.graphParams.currentTo = dayjs(this.currentDateRangePickerValue[1]).format(GIDDH_DATE_FORMAT);
            this.getCurrentWeekStartEndDate = [this.currentDateRangePickerValue[0], this.currentDateRangePickerValue[1]];
            this.getRevenueGraphData();
            this.chartChanged = false;
        }
    }

    public showColumnChart() {
        this.generalService.invokeEvent.next("showallcharts");
        this.graphParams.interval = "daily";
        this.chartType = "bar";
        this.graphExpanded = false;

        this.getCurrentWeekStartEndDate = this.getWeekStartEndDate(new Date());
        this.getPreviousWeekStartEndDate = this.getWeekStartEndDate(dayjs(this.getCurrentWeekStartEndDate[0]).subtract(1, 'day'));

        this.currentDateRangePickerValue = [this.getCurrentWeekStartEndDate[0], this.getCurrentWeekStartEndDate[1]];
        this.previousDateRangePickerValue = [this.getPreviousWeekStartEndDate[0], this.getPreviousWeekStartEndDate[1]];

        this.graphParams.currentFrom = dayjs(this.getCurrentWeekStartEndDate[0]).format(GIDDH_DATE_FORMAT);
        this.graphParams.currentTo = dayjs(this.getCurrentWeekStartEndDate[1]).format(GIDDH_DATE_FORMAT);
        this.graphParams.previousFrom = dayjs(this.getPreviousWeekStartEndDate[0]).format(GIDDH_DATE_FORMAT);
        this.graphParams.previousTo = dayjs(this.getPreviousWeekStartEndDate[1]).format(GIDDH_DATE_FORMAT);

        this.getRevenueGraphData();
    }

    public createChart(): void {

        const chartType = this.chartType;
        let currentData = this.currentData;
        let previousData = this.previousData;
        let label = this.chartLabelsize;

        /* For Chart Type Line  */
        if (this.chartType === 'line') {
            this.chart = new Chart("revenueChartLargeCanvas", {
                type: chartType,
                data: {
                    labels: label,
                    datasets: [
                        {
                            label: 'Current',
                            type: chartType,
                            data: currentData,
                            fill: false,
                            borderColor: 'rgb(12, 177, 175)',
                        },
                        {
                            label: 'Previous',
                            type: chartType,
                            data: previousData,
                            fill: false,
                            borderColor: 'rgb(8, 126, 125)',
                        }
                    ],

                },

                options: {
                    interaction: {
                        intersect: true,
                        mode: "nearest",
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                title: function () { return '' },
                                afterLabel: function (context) {
                                    let label = ''
                                    let dataIndex = context.dataIndex;
                                    let datasetIndex = context.datasetIndex;
                                    let data = datasetIndex === 0 ? currentData : previousData;
                                    let tooltipIndex = dataIndex;

                                    for (let i = 0; i < data.length; i++) {
                                        label = data[tooltipIndex].tooltipAfterLabel
                                    }
                                    return label;
                                },
                                label: function (context) {
                                    let label = ''
                                    let dataIndex = context.dataIndex;
                                    let datasetIndex = context.datasetIndex;
                                    let data = datasetIndex === 0 ? currentData : previousData;
                                    let tooltipIndex = dataIndex;

                                    for (let i = 0; i < data.length; i++) {
                                        label = data[tooltipIndex].tooltipLabel
                                    }
                                    return label;
                                }
                            },
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            borderColor: 'rgb(12, 177, 175)',
                            bodyColor: 'rgb(0, 0, 0)',
                            titleColor: 'rgb(0, 0, 0)',
                            borderWidth: 0.5,
                            titleFont: {
                                weight: 'normal'
                            },
                            displayColors: false,
                        },
                    },
                    scales: {
                        x: {
                            border: {
                                display: true
                            },
                            display: false,
                        },
                        y: {
                            border: {
                                display: true
                            },
                            type: 'linear',
                            ticks: {
                                callback: function (value) {
                                    var ranges = [
                                        { divider: 1e6, suffix: 'M' },
                                        { divider: 1e3, suffix: 'k' }
                                    ];
                                    function formatNumber(n) {
                                        for (let i = 0; i < ranges.length; i++) {
                                            if (n >= ranges[i].divider) {
                                                return (n / ranges[i].divider).toString() + ranges[i].suffix;
                                            }
                                        }
                                        if (Math.floor(n) === n) {
                                            return value;
                                        }

                                    }
                                    return formatNumber(value);
                                },
                            },
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
        }

        /* For Chart Type Bar  */
        if (this.chartType === 'bar') {
            this.chart = new Chart("revenueChartCanvas", {
                type: chartType,
                data: {
                    labels: label,
                    datasets: [
                        {
                            data: currentData,
                            backgroundColor: "rgb(12, 177, 175)",
                            borderColor: 'rgb(12, 177, 175)',
                            barThickness: 20
                        },
                        {
                            data: previousData,
                            backgroundColor: "rgb(8, 126, 125)",
                            borderColor: 'rgb(8, 126, 125)',
                            barThickness: 20
                        }
                    ],

                },

                options: {
                    interaction: {
                        intersect: true,
                        mode: 'point',
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                title: function () { return '' },
                                afterLabel: function (context) {
                                    let label = ''
                                    let dataIndex = context.dataIndex;
                                    let datasetIndex = context.datasetIndex;
                                    let data = datasetIndex === 0 ? currentData : previousData;
                                    let tooltipIndex = dataIndex;

                                    for (let i = 0; i < data.length; i++) {
                                        label = data[tooltipIndex].tooltipAfterLabel
                                    }
                                    return label;
                                },
                                label: function (context) {
                                    let label = ''
                                    let dataIndex = context.dataIndex;
                                    let datasetIndex = context.datasetIndex;
                                    let data = datasetIndex === 0 ? currentData : previousData;
                                    let tooltipIndex = dataIndex;

                                    for (let i = 0; i < data.length; i++) {
                                        label = data[tooltipIndex].tooltipLabel
                                    }
                                    return label;
                                }
                            },
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            borderColor: 'rgb(12, 177, 175)',
                            bodyColor: 'rgb(0, 0, 0)',
                            borderWidth: 0.5,
                            displayColors: false
                        }
                    },
                    scales: {
                        x: {
                            border: {
                                display: false
                            },
                            display: false,
                        },
                        y: {
                            border: {
                                display: true,
                            },
                            type: 'linear',
                            ticks: {
                                callback: function (value) {
                                    var ranges = [
                                        { divider: 1e6, suffix: 'M' },
                                        { divider: 1e3, suffix: 'k' }
                                    ];
                                    function formatNumber(n) {
                                        for (let i = 0; i < ranges.length; i++) {
                                            if (n >= ranges[i].divider) {
                                                return (n / ranges[i].divider).toString() + ranges[i].suffix;
                                            }
                                        }
                                        if (Math.floor(n) === n) {
                                            return value;
                                        }

                                    }
                                    return formatNumber(value);
                                },
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,

                }
            });
        }
        
        this.requestInFlight = false;
    }
}
