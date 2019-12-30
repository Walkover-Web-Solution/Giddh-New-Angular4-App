import { skipWhile, take, takeUntil } from 'rxjs/operators';
import { AppState } from '../../../store/roots';
import { HomeActions } from '../../../actions/home/home.actions';
import { IComparisionChartResponse } from '../../../models/interfaces/dashboard.interface';
import { ActiveFinancialYear, CompanyResponse } from '../../../models/api-models/Company';
import { Component, Input, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import { Observable, ReplaySubject } from 'rxjs';
import { IndividualSeriesOptionsExtension } from '../history/IndividualSeriesOptionsExtention';
import { isNullOrUndefined } from 'util';
import * as  moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { Store } from '@ngrx/store';

@Component({
    selector: 'networth-chart',
    templateUrl: 'networth-chart.component.html',
    styleUrls: ['../../home.component.scss']
})

export class NetworthChartComponent implements OnInit {
    @Input() public refresh: boolean = false;
    public options: Options;
    public monthlyOption = {
        colors: ['#c45022'],
        chart: {
            type: 'column', height: '320px', width: 900
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
        },
        credits: {
            enabled: false
        },
        series: [],
        yAxis: {
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            title: {
                text: ''
            },
        }
    };
    public yearlyOption = {
        colors: ['#c45022'],
        chart: {
            type: 'line', height: '280px', width: 900
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
        },
        credits: {
            enabled: false
        },
        series: [],
        yAxis: {
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            title: {
                text: ''
            },
        },
        legend: {
            enabled: false
        }
    };
    public activeFinancialYear: ActiveFinancialYear;
    public lastFinancialYear: ActiveFinancialYear;
    public companies$: Observable<CompanyResponse[]>;
    public activeCompanyUniqueName$: Observable<string>;
    @Input() public comparisionChartData: Observable<IComparisionChartResponse>;
    public requestInFlight = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private monthArray = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    private networthData: any;
    private currentchart: string = 'Yearly';
    private AllSeries: IndividualSeriesOptionsExtension[];

    constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
        this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
        this.options = this.yearlyOption;
    }

    public togle(str: string) {
        this.currentchart = str;
        this.generateCharts();
    }

    public generateCharts() {
        if (this.currentchart === 'Yearly') {
            this.options = _.cloneDeep(this.yearlyOption);
            this.options.series = [{
                name: 'Yearly',
                data: this.networthData.yearlyBalances
            }];
        } else {
            this.options = _.cloneDeep(this.monthlyOption);
            this.options.series = [{
                name: 'Monthly',
                data: this.networthData.monthlyBalances
            }];
        }
    }

    public refreshChart() {
        this.refresh = true;
        this.fetchChartData();
    }

    public fetchChartData() {
        this.requestInFlight = true;
        this.networthData = [];
        if (this.activeFinancialYear) {
            this.store.dispatch(this._homeActions.getNetworthChartDataOfActiveYear(
                this.activeFinancialYear.financialYearStarts,
                this.activeFinancialYear.financialYearEnds, this.refresh));
        }
        this.refresh = false;
    }

    public ngOnInit() {
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
                // this.fetchChartData();
            }
        });
        this.comparisionChartData.pipe(
            skipWhile(p => (isNullOrUndefined(p) || isNullOrUndefined(p.NetworthActiveYear))))
            // .distinctUntilChanged((p, q) => p.NetworthActiveYear === this.networthData)
            .subscribe(p => {
                this.networthData = p.NetworthActiveYear;
                this.generateCharts();
                this.requestInFlight = false;
            });

    }
}
