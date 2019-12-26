import { take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable, ReplaySubject } from 'rxjs';
import { ActiveFinancialYear, CompanyResponse } from '../../../models/api-models/Company';
import { HomeActions } from '../../../actions/home/home.actions';
import * as moment from 'moment/moment';
import * as _ from 'lodash';
import { IChildGroups, IExpensesChartClosingBalanceResponse } from '../../../models/interfaces/dashboard.interface';
import { AccountChartDataLastCurrentYear } from '../../../models/view-models/AccountChartDataLastCurrentYear';
import { INameUniqueName } from '../../../models/api-models/Inventory';

@Component({
    selector: 'expenses-chart',
    templateUrl: 'expenses-chart.component.html',
    styleUrls: ['../../home.component.scss']
})

export class ExpensesChartComponent implements OnInit, OnDestroy {
    @Input() public refresh: boolean = false;
    public requestInFlight: boolean = false;
    public options: Options;
    public activeFinancialYear: ActiveFinancialYear;
    public lastFinancialYear: ActiveFinancialYear;
    public companies$: Observable<CompanyResponse[]>;
    public activeCompanyUniqueName$: Observable<string>;
    @Input() public expensesChartData: Observable<IExpensesChartClosingBalanceResponse>;
    public accountStrings: AccountChartDataLastCurrentYear[] = [];
    public activeYearAccounts: IChildGroups[] = [];
    public lastYearAccounts: IChildGroups[] = [];
    public activeYearAccountsRanks: number[] = [];
    public lastYearAccountsRanks: number[] = [];
    public activeYearTotal: number = 0;
    public lastYearTotal: number = 0;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
        this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.companies$.subscribe(c => {
            if (c) {
                let activeCmpUniqueName = '';
                let financialYears = [];
                this.activeCompanyUniqueName$.pipe(take(1)).subscribe(a => {
                    activeCmpUniqueName = a;
                    let res = c.find(p => p.uniqueName === a);
                    if (res) {
                        this.activeFinancialYear = res.activeFinancialYear;
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
                    // if (activeCmpUniqueName) { this.fetchChartData(); }
                }
            }
        });

        this.expensesChartData.subscribe(exp => {
            if (exp) {
                if (exp.operatingcostActiveyear && exp.indirectexpensesActiveyear) {
                    let indirectexpensesGroups = [].concat.apply([], exp.indirectexpensesActiveyear.childGroups);
                    let operatingcostGroups = [].concat.apply([], exp.operatingcostActiveyear.childGroups);
                    let accounts = _.unionBy(indirectexpensesGroups as IChildGroups[], operatingcostGroups as IChildGroups[]) as IChildGroups[];
                    this.activeYearAccounts = accounts;
                }

                if (exp.operatingcostLastyear && exp.indirectexpensesLastyear) {
                    let indirectexpensesGroups = [].concat.apply([], exp.indirectexpensesLastyear.childGroups);
                    let operatingcostGroups = [].concat.apply([], exp.operatingcostLastyear.childGroups);
                    let lastAccounts = _.unionBy(indirectexpensesGroups as IChildGroups[], operatingcostGroups as IChildGroups[]) as IChildGroups[];
                    this.lastYearAccounts = lastAccounts;
                }
            }
            this.generateCharts();
            this.requestInFlight = false;
        });
    }

    public flattenGroup(tree: IChildGroups[]) {
        return _.flattenDeep(this.recurse(tree));
    }

    public recurse(nodes: IChildGroups[]) {
        return _.map(nodes, (node: IChildGroups) => {
            return [
                node,
                this.recurse(node.childGroups)
            ];
        });
    }

    public refreshChart() {
        this.refresh = true;
        this.fetchChartData();
    }

    public fetchChartData() {
        this.requestInFlight = true;
        if (this.activeFinancialYear) {
            this.store.dispatch(this._homeActions.getExpensesChartDataOfActiveYear(this.activeFinancialYear.financialYearStarts, this.activeFinancialYear.financialYearEnds, this.refresh));
        }
        if (this.lastFinancialYear) {
            this.store.dispatch(this._homeActions.getExpensesChartDataOfLastYear(this.lastFinancialYear.financialYearStarts, this.lastFinancialYear.financialYearEnds, this.refresh));
        }
        this.refresh = false;
    }

    public generateCharts() {
        this.accountStrings = _.uniqBy(this.generateActiveYearString().concat(this.generateLastYearString()), 'uniqueName');
        this.accountStrings.forEach((ac) => {
            ac.activeYear = 0;
            ac.lastYear = 0;
            let index = -1;
            index = _.findIndex(this.activeYearAccounts, (p) => p.uniqueName === ac.uniqueName);
            if (index !== -1) {
                ac.activeYear = this.activeYearAccounts[index].closingBalance.amount;
            }
            index = -1;
            index = _.findIndex(this.lastYearAccounts, (p) => p.uniqueName === ac.uniqueName);
            if (index !== -1) {
                ac.lastYear = this.lastYearAccounts[index].closingBalance.amount;
            }
        });

        this.accountStrings = _.filter(this.accountStrings, (a) => {
            return !(a.activeYear === 0 && a.lastYear === 0);
        });
        this.activeYearAccountsRanks = this.accountStrings.map(p => p.activeYear);
        this.lastYearAccountsRanks = this.accountStrings.map(p => p.lastYear);
        this.activeYearTotal = _.sum(this.activeYearAccountsRanks);
        this.lastYearTotal = _.sum(this.lastYearAccountsRanks);

        this.options = {
            colors: ['#28283c', '#aeaec4'],
            chart: {
                type: 'column',
                height: '256px'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: this.accountStrings.map(p => p.name),
                crosshair: true,
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} rs</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0
                },
                bar: {
                    groupPadding: 0,
                    pointPadding: 0
                }
            },
            series: [{
                name: `This Year`,
                data: this.activeYearAccountsRanks

            }, {
                name: `Last Year`,
                data: this.lastYearAccountsRanks

            }],
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            }
        };
    }

    public generateActiveYearString(): INameUniqueName[] {
        let activeStrings: INameUniqueName[] = [];
        this.activeYearAccounts.map(acc => {
            activeStrings.push({ uniqueName: acc.uniqueName, name: acc.groupName });
        });
        return activeStrings;
    }

    public generateLastYearString(): INameUniqueName[] {
        let lastStrings: INameUniqueName[] = [];
        this.lastYearAccounts.map(acc => {
            lastStrings.push({ uniqueName: acc.uniqueName, name: acc.groupName });
        });
        return lastStrings;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
