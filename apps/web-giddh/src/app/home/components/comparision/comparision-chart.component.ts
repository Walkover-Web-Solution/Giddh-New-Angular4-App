import { skipWhile, take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import { ActiveFinancialYear, CompanyResponse } from '../../../models/api-models/Company';
import { Observable, ReplaySubject } from 'rxjs';
import { HomeActions } from '../../../actions/home/home.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { IComparisionChartResponse } from '../../../models/interfaces/dashboard.interface';
import { isNullOrUndefined } from 'util';
import { IndividualSeriesOptionsExtension } from '../history/IndividualSeriesOptionsExtention';
import { API_TO_CALL, CHART_CALLED_FROM } from '../../../actions/home/home.const';

@Component({
    selector: 'compare-chart',
    templateUrl: 'comparision-chart.component.html',
    styleUrls: ['../../home.component.scss']
})

export class ComparisionChartComponent implements OnInit {
    @Input() public refresh: boolean = false;
    @Input() public showLastYear: boolean = false;
    @Input() public showExpense: boolean = false;
    @Input() public showRevenue: boolean = false;
    @Input() public showProfitLoss: boolean = true;
    public ApiToCALL: API_TO_CALL[] = [API_TO_CALL.PL];
    public options: Options;
    public activeFinancialYear: ActiveFinancialYear;
    public lastFinancialYear: ActiveFinancialYear;
    public companies$: Observable<CompanyResponse[]>;
    public activeCompanyUniqueName$: Observable<string>;
    @Input() public comparisionChartData: Observable<IComparisionChartResponse>;
    public requestInFlight = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private monthArray = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    private expenseData = [];
    private expenseDataLY = [];
    private revenueData = [];
    private revenueDataLY = [];
    private profitLossData = [];
    private profitLossDataLY = [];
    private AllSeries: IndividualSeriesOptionsExtension[];

    constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
        this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
        this.AllSeries = [{
            name: 'Expense',
            data: this.expenseData,
            visible: this.showExpense
        }, {
            name: 'Revenue',
            data: [],
            visible: this.showRevenue
        }, {
            name: 'Profit/Loss',
            data: [],
            visible: this.showProfitLoss
        }, {
            name: 'LY Expense',
            data: [],
            visible: (this.showExpense && this.showLastYear)
        }, {
            name: 'LY Revenue',
            data: [],
            visible: (this.showRevenue && this.showLastYear)
        }, {
            name: 'LY Profit/Loss',
            data: [],
            visible: (this.showProfitLoss && this.showLastYear)
        }];
    }

    public ngOnInit() {
        // get activeFinancialYear and lastFinancialYear
        this.companies$.subscribe(c => {
            if (c) {
                let activeCompany: CompanyResponse;
                let activeCmpUniqueName = '';
                let financialYears = [];
                this.activeCompanyUniqueName$.pipe(take(1)).subscribe(a => {
                    activeCmpUniqueName = a;
                    activeCompany = c.find(p => p.uniqueName === a);
                    if (activeCompany) {
                        this.activeFinancialYear = activeCompany.activeFinancialYear;
                    }
                });
                if (this.activeFinancialYear) {
                    for (let cmp of c) {
                        if (cmp.uniqueName === activeCmpUniqueName) {
                            if (cmp.financialYears.length > 1) {
                                financialYears = cmp.financialYears.filter(cm => cm.uniqueName !== this.activeFinancialYear.uniqueName);
                                financialYears = _.filter(financialYears, (it: ActiveFinancialYear) => {
                                    let a = moment(this.activeFinancialYear.financialYearStarts, 'DD-MM-YYYY');
                                    let b = moment(it.financialYearEnds, 'DD-MM-YYYY');

                                    return b.diff(a, 'days') < 0;
                                });
                                financialYears = _.orderBy(financialYears, (p: ActiveFinancialYear) => {
                                    let a = moment(this.activeFinancialYear.financialYearStarts, 'DD-MM-YYYY');
                                    let b = moment(p.financialYearEnds, 'DD-MM-YYYY');
                                    return b.diff(a, 'days');
                                }, 'desc');
                                this.lastFinancialYear = financialYears[0];
                            }
                        }
                    }
                }
                // if (activeCmpUniqueName) { this.fetchChartData(); }
            }
        });

        this.comparisionChartData.pipe(
            skipWhile(p => (isNullOrUndefined(p))))
            .subscribe(p => {
                this.expenseData = (p.ExpensesActiveYearMonthly);
                this.expenseDataLY = (p.ExpensesLastYearMonthly);
                this.revenueData = (p.revenueActiveYearMonthly);
                this.revenueDataLY = (p.revenueLastYearMonthly);
                // this.profitLossData = p.ProfitLossActiveYearMonthly;
                // this.profitLossDataLY = p.ProfitLossLastYearMonthly;
                this.profitLossData = p.ProfitLossActiveYearYearly;
                this.profitLossDataLY = p.ProfitLossLastYearYearly;
                this.generateCharts();
                this.requestInFlight = false;
            });
    }

    public hardRefresh() {
        this.refresh = true;
        this.fetchChartData();
    }

    public fetchChartData() {
        this.requestInFlight = true;
        this.ApiToCALL = [];
        if (this.showExpense && (!(this.expenseData && this.expenseData.length > 0) || this.refresh)) {
            this.ApiToCALL.push(API_TO_CALL.EXPENCE);
        }
        if (this.showRevenue && (!(this.revenueData && this.revenueData.length > 0) || this.refresh)) {
            this.ApiToCALL.push(API_TO_CALL.REVENUE);
        }
        if (this.showProfitLoss && (!(this.profitLossData && this.profitLossData.length > 0) || this.refresh)) {
            this.ApiToCALL.push(API_TO_CALL.PL);
        }

        if (this.activeFinancialYear) {
            this.store.dispatch(this._homeActions.getComparisionChartDataOfActiveYear(
                this.activeFinancialYear.financialYearStarts,
                this.activeFinancialYear.financialYearEnds, this.refresh, CHART_CALLED_FROM.COMPARISION, this.ApiToCALL));
        }

        this.ApiToCALL = [];
        if (this.showExpense && this.showLastYear && (!(this.expenseDataLY && this.expenseDataLY.length > 0) || this.refresh)) {
            this.ApiToCALL.push(API_TO_CALL.EXPENCE);
        }
        if (this.showRevenue && this.showLastYear && (!(this.revenueDataLY && this.revenueDataLY.length > 0) || this.refresh)) {
            this.ApiToCALL.push(API_TO_CALL.REVENUE);
        }
        if (this.showProfitLoss && this.showLastYear && (!(this.profitLossDataLY && this.profitLossDataLY.length > 0) || this.refresh)) {
            this.ApiToCALL.push(API_TO_CALL.PL);
        }

        if (this.lastFinancialYear && this.showLastYear) {
            this.store.dispatch(this._homeActions.getComparisionChartDataOfLastYear(
                this.lastFinancialYear.financialYearStarts,
                this.lastFinancialYear.financialYearEnds, this.refresh, CHART_CALLED_FROM.COMPARISION, this.ApiToCALL));
        }
        this.refresh = false;
    }

    public toggle(str: string) {
        let ApiToCALL: API_TO_CALL[] = [];
        if (str === 'Profit/Loss') {
            this.showProfitLoss = !this.showProfitLoss;
        } else if (str === 'Expense') {
            this.showExpense = !this.showExpense;
        } else if (str === 'Revenue') {
            this.showRevenue = !this.showRevenue;
        }
        this.ShowLastYear();
        this.fetchChartData();
    }

    public LyToggle() {
        this.showLastYear = !this.showLastYear;
        this.ShowLastYear();
        this.fetchChartData();
    }

    public ShowLastYear() {
        this.AllSeries = [{
            name: 'Expense',
            data: this.expenseData,
            visible: this.showExpense
        }, {
            name: 'Revenue',
            data: [],
            visible: this.showRevenue
        }, {
            name: 'Profit/Loss',
            data: [],
            visible: this.showProfitLoss
        }, {
            name: 'LY Expense',
            data: [],
            visible: (this.showExpense && this.showLastYear)
        }, {
            name: 'LY Revenue',
            data: [],
            visible: (this.showRevenue && this.showLastYear)
        }, {
            name: 'LY Profit/Loss',
            data: [],
            visible: (this.showProfitLoss && this.showLastYear)
        }];
    }

    public generateCharts() {
        _.each(this.AllSeries, (p) => {
            if (p.name === 'Expense') {
                p.data = this.expenseData;
                p.color = '#005b77';
            }
            if (p.name === 'Revenue') {
                p.data = this.revenueData;
                p.color = '#c45022';
            }
            if (p.name === 'Profit/Loss') {
                p.data = this.profitLossData;
                p.color = '#28283c';
            }
            if (p.name === 'LY Expense') {
                p.data = this.expenseDataLY;
                p.color = '#77a1b8';
            }
            if (p.name === 'LY Revenue') {
                p.data = this.revenueDataLY;
                p.color = '#d37c59';
            }
            if (p.name === 'LY Profit/Loss') {
                p.data = this.profitLossDataLY;
                p.color = '#aeaec4';
            }
        });
        this.options = {
            chart: {
                height: '273px',
                width: 900,
                zoomType: 'x'
            },
            title: {
                text: ''
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
            },
            xAxis: {
                categories: this.monthArray
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: { color: '#333333', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' },
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: this.AllSeries.filter(p => p.visible),
        };
    }
}
