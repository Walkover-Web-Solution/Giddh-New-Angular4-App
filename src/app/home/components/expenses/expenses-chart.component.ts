import { Component, OnDestroy, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Observable';
import { ActiveFinancialYear, ComapnyResponse } from '../../../models/api-models/Company';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HomeActions } from '../../../services/actions/home/home.actions';
import moment from 'moment';
import * as _ from 'lodash';
import { IChildGroups, IExpensesChartClosingBalanceResponse } from '../../../models/interfaces/dashboard.interface';

@Component({
  selector: 'expenses-chart',
  templateUrl: 'expenses-chart.component.html'
})

export class ExpensesChartComponent implements OnInit, OnDestroy {
  public options: Options;
  public activeFinancialYear: ActiveFinancialYear;
  public lastFinancialYear: ActiveFinancialYear;
  public companies$: Observable<ComapnyResponse[]>;
  public activeCompanyUniqueName$: Observable<string>;
  public expensesChartData$: Observable<IExpensesChartClosingBalanceResponse>;
  public accountStrings: string[] = [];
  public activeYearAccounts: IChildGroups[] = [];
  public lastYearAccounts: IChildGroups[] = [];
  public activeYearAccountsRanks: number[] = [];
  public lastYearAccountsRanks: number[] = [];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
    this.expensesChartData$ = this.store.select(p => p.home.expensesChart).takeUntil(this.destroyed$);
    this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.companies$ = this.store.select(p => p.company.companies).takeUntil(this.destroyed$);
    this.expensesChartData$ = this.store.select(p => p.home.expensesChart).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.companies$.subscribe(c => {
      if (c) {
        let activeCmpUniqueName = '';
        let financialYears = [];
        this.activeCompanyUniqueName$.take(1).subscribe(a => {
          activeCmpUniqueName = a;
          this.activeFinancialYear = c.find(p => p.uniqueName === a).activeFinancialYear;
        });
        if (this.activeFinancialYear) {
          for (let cmp of c) {
            if (cmp.uniqueName === activeCmpUniqueName) {
              if (cmp.financialYears.length > 1) {
                financialYears = cmp.financialYears.filter(cm => cm.uniqueName !== this.activeFinancialYear.uniqueName);
                financialYears = _.orderBy(financialYears, 'financialYearStarts', 'desc');
                this.lastFinancialYear = financialYears[0];
              }
            }
          }
          this.refreshData();
        }
      }
    });

    this.expensesChartData$.subscribe(exp => {
      if (exp) {
        if (exp.operatingcostActiveyear && exp.indirectexpensesActiveyear) {
          let accounts = [];
          exp.operatingcostActiveyear.childGroups.map(grp => {
            accounts.push(grp);
          });
          exp.indirectexpensesActiveyear.childGroups.map(grp => {
            accounts.push(grp);
          });
          this.activeYearAccounts = accounts;
        }

        if (exp.operatingcostLastyear && exp.indirectexpensesLastyear) {
          let lastAccounts = [];
          exp.operatingcostActiveyear.childGroups.map(grp => {
            lastAccounts.push(grp);
          });
          exp.indirectexpensesActiveyear.childGroups.map(grp => {
            lastAccounts.push(grp);
          });
          this.lastYearAccounts = lastAccounts;
        }
      }
      this.generateCharts();
    });
  }

  public refreshData() {
    this.store.dispatch(this._homeActions.getExpensesChartDataOfActiveYear(this.activeFinancialYear.financialYearStarts, this.activeFinancialYear.financialYearEnds));

    if (this.lastFinancialYear) {
      this.store.dispatch(this._homeActions.getExpensesChartDataOfLastYear(this.lastFinancialYear.financialYearStarts, this.lastFinancialYear.financialYearEnds));
    }
  }

  public generateCharts() {
    let activeRanks = [];
    let lastRanks = [];

    this.accountStrings = _.uniq(this.generateActiveYearString().concat(this.generateLastYearString()));

    this.activeYearAccounts.map(acc => {
      if (this.accountStrings.indexOf(acc.groupName) === -1) {
        activeRanks.push(0);
      } else {
        activeRanks.push(acc.closingBalance.amount);
      }
    });

    this.lastYearAccounts.map(acc => {
      if (this.accountStrings.indexOf(acc.groupName) === -1) {
        lastRanks.push(0);
      } else {
        lastRanks.push(acc.closingBalance.amount);
      }
    });
    this.activeYearAccountsRanks = activeRanks;
    this.lastYearAccountsRanks = lastRanks;

    this.options = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Monthly Average Rainfall'
      },
      subtitle: {
        text: 'Source: WorldClimate.com'
      },
      xAxis: {
        categories: this.accountStrings,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Rainfall (mm)'
        }
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
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: `${this.activeFinancialYear ? this.activeFinancialYear.financialYearStarts : ''} to ${this.activeFinancialYear ? this.activeFinancialYear.financialYearEnds : ''}`,
        data: this.activeYearAccountsRanks

      }, {
        name: `${this.lastFinancialYear ? this.lastFinancialYear.financialYearStarts : ''} to ${this.lastFinancialYear ? this.lastFinancialYear.financialYearEnds : ''}`,
        data: this.lastYearAccountsRanks

      }]
    };
  }

  public generateActiveYearString(): string[] {
    let activeStrings = [];
    this.activeYearAccounts.map(acc => {
      activeStrings.push(acc.groupName);
    });
    return activeStrings;
  }

  public generateLastYearString(): string[] {
    let lastStrings = [];
    this.lastYearAccounts.map(acc => {
      lastStrings.push(acc.groupName);
    });
    return lastStrings;
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
