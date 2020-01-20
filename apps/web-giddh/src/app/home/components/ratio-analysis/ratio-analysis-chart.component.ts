import { skipWhile, take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';

@Component({
    selector: 'ratio-analysis-chart',
    templateUrl: 'ratio-analysis-chart.component.html',
    styleUrls: ['ratio-analysis-chart.component.scss', '../../home.component.scss']
})

export class RatioAnalysisChartComponent implements OnInit, OnDestroy {
    @Input() public refresh: boolean = false;

    // public ApiToCALL: API_TO_CALL[] = [API_TO_CALL.PL];
    public options: Options;
    public activeFinancialYear: ActiveFinancialYear;
    public lastFinancialYear: ActiveFinancialYear;
    public companies$: Observable<CompanyResponse[]>;
    public activeCompanyUniqueName$: Observable<string>;
    @Input() public comparisionChartData: Observable<IComparisionChartResponse>;
    public requestInFlight = true;
    public currentRatioOption: Options;
    public debtOptions: Options;
    public proprietaryOption: Options;
    public fixedAssetOption: Options;
    public rationResponse$: Observable<any>;
    public ratioObj: any = {};

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
        this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
        this.rationResponse$ = this.store.select(p => p.home.RatioAnalysis).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.dispatch(this._homeActions.getRatioAnalysis(moment().format(GIDDH_DATE_FORMAT), this.refresh));
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

        this.rationResponse$.pipe(
            skipWhile(p => (isNullOrUndefined(p))))
            .subscribe(p => {
                this.ratioObj = p;
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
        this.store.dispatch(this._homeActions.getRatioAnalysis(moment().format(GIDDH_DATE_FORMAT), this.refresh));
        // this.ApiToCALL = [];
        this.refresh = false;
    }

    public generateCharts() {
        this.currentRatioOption = {
            colors: ['#2C6EBD', '#4693F1'],
            chart: {
                type: 'pie',
                polar: false,
                width: 170,
                height: '180px'
            },
            title: {
                verticalAlign: 'middle',
                align: 'center',
                text: '<span class="pie-text_center">' + this.ratioObj.currentRatio + '</span>',
                style: { color: '#005b77', fontSize: '26px' },
                useHTML: true,
                y: 8
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
                    shadow: false,
                    center: [
                        '50%',
                        '50%'
                    ],
                },
                series: {
                    animation: false,
                    dataLabels: {}
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:14px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{point.key} </td>' +
                    '<td style="color:{series.color};padding:0">{point.percentage:.1f} %</td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            series: [{
                name: 'Current Ratio',
                // showInLegend: false,
                data: [['Current Assets', this.ratioObj.currentRatio * 100], ['Current Liabilities', 100]],
            }],
        };

        this.debtOptions = {
            colors: ['#EFBB35', '#FED46A'],
            chart: {
                type: 'pie',
                polar: false,
                width: 170,
                height: '180px'
                //   height: '250px'
            },
            title: {
                verticalAlign: 'middle',
                align: 'center',
                text: '<span class="pie-text_center">' + this.ratioObj.debtEquityRatio + '</span>',
                style: { color: '#005b77', fontSize: '26px' },
                useHTML: true,
                y: 8
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
                    shadow: false,
                    center: [
                        '50%',
                        '50%'
                    ],
                },
                series: {
                    animation: false,
                    dataLabels: {}
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:14px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{point.key} </td>' +
                    '<td style="color:{series.color};padding:0">{point.percentage:.1f} %</td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            series: [{
                // name: 'Debt Equity Ratio',
                data: [['Current Liab + NonCurrent Liab', this.ratioObj.debtEquityRatio * 100], ['Shareholders fund', 100]],

            }]
        };

        this.proprietaryOption = {
            colors: ['#D93664', '#F85C88'],
            chart: {
                type: 'pie',
                polar: false,
                width: 170,
                height: '180px'
                //   height: '250px'
            },
            title: {
                verticalAlign: 'middle',
                align: 'center',
                text: '<span class="pie-text_center">' + this.ratioObj.proprietaryRatio + '</span>',
                style: { color: '#005b77', fontSize: '26px' },
                useHTML: true,
                y: 8
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
                    shadow: false,
                    center: [
                        '50%',
                        '50%'
                    ],
                },
                series: {
                    animation: false,
                    dataLabels: {}
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:14px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{point.key} </td>' +
                    '<td style="color:{series.color};padding:0">{point.percentage:.1f} %</td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            series: [{
                name: 'Proprietary Ratio',
                data: [['Shareholders fund', this.ratioObj.proprietaryRatio * 100], ['Total Assets', 100]],

            }]
        };

        this.fixedAssetOption = {
            colors: ['#087E7D', '#0CB1AF'],
            chart: {
                type: 'pie',
                polar: false,
                width: 170,
                height: '180px'
            },
            title: {
                verticalAlign: 'middle',
                align: 'center',
                text: '<span class="pie-text_center">' + this.ratioObj.fixedAssetRatio + '</span>',
                style: { color: '#005b77', fontSize: '26px' },
                useHTML: true,
                y: 8
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
                    shadow: false,
                    center: [
                        '50%',
                        '50%'
                    ],
                },
                series: {
                    animation: false,
                    dataLabels: {}
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:14px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{point.key} </td>' +
                    '<td style="color:{series.color};padding:0">{point.percentage:.1f} %</td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            series: [{
                name: 'Fixed Assets Ratio',
                data: [['Fixed Assets / NonCurrent Liab', this.ratioObj.fixedAssetRatio * 100], ['Shareholders fund', 100]],
            }]
        };
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
