import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
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

@Component({
    selector: 'revenue-chart',
    templateUrl: 'revenue-chart.component.html',
    styleUrls: ['revenue-chart.component.scss', '../../home.component.scss']
})
export class RevenueChartComponent implements OnInit, OnDestroy {
    @Input() public refresh: boolean = false;
    public requestInFlight: boolean = false;
    public revenueChart: typeof Highcharts = Highcharts;
    public chartOptions: Highcharts.Options;
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
    public chartType: string = 'column';
    public graphExpanded: boolean = false;
    public currentDateRangePickerValue: Date[] = [];
    public previousDateRangePickerValue: Date[] = [];
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if chart changed */
    public chartChanged: boolean = false;

    constructor(private store: Store<AppState>, private homeActions: HomeActions, public currencyPipe: GiddhCurrencyPipe, private generalService: GeneralService, private dashboardService: DashboardService, private toasterService: ToasterService) {
        this.getCurrentWeekStartEndDate = this.getWeekStartEndDate(new Date());
        this.getPreviousWeekStartEndDate = this.getWeekStartEndDate(dayjs(this.getCurrentWeekStartEndDate[0]).subtract(1, 'day'));

        this.currentDateRangePickerValue = [this.getCurrentWeekStartEndDate[0], this.getCurrentWeekStartEndDate[1]];
        this.previousDateRangePickerValue = [this.getPreviousWeekStartEndDate[0], this.getPreviousWeekStartEndDate[1]];

        this.graphParams.currentFrom = dayjs(this.getCurrentWeekStartEndDate[0]).format(GIDDH_DATE_FORMAT);
        this.graphParams.currentTo = dayjs(this.getCurrentWeekStartEndDate[1]).format(GIDDH_DATE_FORMAT);
        this.graphParams.previousFrom = dayjs(this.getPreviousWeekStartEndDate[0]).format(GIDDH_DATE_FORMAT);
        this.graphParams.previousTo = dayjs(this.getPreviousWeekStartEndDate[1]).format(GIDDH_DATE_FORMAT);
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
                    this.revenueGraphTypes.push({ uniqueName: res[key]?.uniqueName, type: res[key].type });
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
                            this.currentData.push({
                                x: x,
                                y: res.balances[key].current.closingBalance.amount,
                                tooltip: res.balances[key].current.dateLabel + "<br />" + this.graphParams?.uniqueName + ": " + this.activeCompany.baseCurrencySymbol + " " + this.currencyPipe.transform(res.balances[key].current.closingBalance.amount)
                            });
                        }

                        if (res.balances[key].previous) {
                            this.previousData.push({
                                x: x,
                                y: res.balances[key].previous.closingBalance.amount,
                                tooltip: res.balances[key].previous.dateLabel + "<br />" + this.graphParams?.uniqueName + ": " + this.activeCompany.baseCurrencySymbol + " " + this.currencyPipe.transform(res.balances[key].previous.closingBalance.amount)
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
                    this.summaryData.totalCurrent = res.currentClosingBalance.amount;
                }

                if (res.previousClosingBalance !== null && res.previousClosingBalance.amount !== null) {
                    this.summaryData.totalLast = res.previousClosingBalance.amount;
                }

                if (res.previousHighestClosingBalance !== null && res.previousHighestClosingBalance.amount !== null) {
                    previousHighest = Number(res.previousHighestClosingBalance.amount);
                }

                if (res.currentHighestClosingBalance !== null && res.currentHighestClosingBalance.amount !== null) {
                    currentHighest = Number(res.currentHighestClosingBalance.amount);
                }

                if (res.previousLowestClosingBalance !== null && res.previousLowestClosingBalance.amount !== null) {
                    previousLowest = Number(res.previousLowestClosingBalance.amount);
                }

                if (res.currentLowestClosingBalance !== null && res.currentLowestClosingBalance.amount !== null) {
                    currentLowest = Number(res.currentLowestClosingBalance.amount);
                }

                if (currentHighest > previousHighest) {
                    this.summaryData.highest = res.currentHighestClosingBalance.amount;
                    this.summaryData.highestLabel = res.currentHighestClosingBalance.dateLabel;
                } else {
                    this.summaryData.highest = res.previousHighestClosingBalance.amount;
                    this.summaryData.highestLabel = res.previousHighestClosingBalance.dateLabel;
                }

                if (currentLowest < previousLowest) {
                    this.summaryData.lowest = res.currentLowestClosingBalance.amount;
                    this.summaryData.lowestLabel = res.currentLowestClosingBalance.dateLabel;
                } else {
                    this.summaryData.lowest = res.previousLowestClosingBalance.amount;
                    this.summaryData.lowestLabel = res.previousLowestClosingBalance.dateLabel;
                }

                this.generateChart();
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

    public generateChart() {
        let chartType: any = this.chartType;

        this.chartOptions = {
            chart: {
                type: chartType,
                height: '300px'
            },
            colors: ['#0CB1AF', '#087E7D'],
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            series: [{
                name: '',
                data: this.currentData,
                type: chartType
            }, {
                name: '',
                data: this.previousData,
                type: chartType
            }
            ],
            legend: {
                enabled: false
            },
            tooltip: {
                useHTML: true,
                formatter: function () {
                    return (this.point as any).tooltip;
                }
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: ''
                }
            },
            yAxis: {
                title: {
                    text: ''
                }
            }
        };

        this.requestInFlight = false;
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
        this.currentData = [];
        this.previousData = [];
        this.summaryData.totalCurrent = 0;
        this.summaryData.totalLast = 0;
        this.summaryData.highest = 0;
        this.summaryData.lowest = 0;
        this.graphParams.interval = "daily";
        this.chartType = "line";
        this.graphExpanded = true;
        this.generateChart();
    }

    public updateChartFrequency(interval) {
        this.graphParams.interval = interval;

        this.currentData = [];
        this.previousData = [];
        this.summaryData.totalCurrent = 0;
        this.summaryData.totalLast = 0;
        this.summaryData.highest = 0;
        this.summaryData.lowest = 0;

        this.generateChart();

        setTimeout(() => {
            this.getRevenueGraphData();
        }, 200);
    }

    public setPreviousDate(data) {
        if (data && !this.chartChanged) {
            this.graphParams.previousFrom = dayjs(data[0]).format(GIDDH_DATE_FORMAT);
            this.graphParams.previousTo = dayjs(data[1]).format(GIDDH_DATE_FORMAT);
            this.getPreviousWeekStartEndDate = [data[0], data[1]];
            this.getRevenueGraphData();
        }
    }

    public setCurrentDate(data) {
        if (data) {
            this.graphParams.currentFrom = dayjs(data[0]).format(GIDDH_DATE_FORMAT);
            this.graphParams.currentTo = dayjs(data[1]).format(GIDDH_DATE_FORMAT);
            this.getCurrentWeekStartEndDate = [data[0], data[1]];
            this.getRevenueGraphData();
            this.chartChanged = false;
        }
    }

    public showColumnChart() {
        this.generalService.invokeEvent.next("showallcharts");
        this.graphParams.interval = "daily";
        this.chartType = "column";
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
}
