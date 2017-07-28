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
import { ICbAccount, IExpensesChartClosingBalanceResponse } from '../../../models/interfaces/dashboard.interface';

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
  public activeYearAccounts: ICbAccount[] = [];
  public lastYearAccounts: ICbAccount[] = [];
  public activeYearAccountsRanks: number[] = [];
  public lastYearAccountsRanks: number[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
    this.expensesChartData$ = this.store.select(p => p.home.expensesChart).takeUntil(this.destroyed$);
    this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.companies$ = this.store.select(p => p.company.companies).takeUntil(this.destroyed$);
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
                financialYears = _.orderBy(financialYears, (it) => {
                  return moment(it.financialYearStarts, 'DD-MM-YYYY');
                }, 'desc');
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
            grp.accounts.map(ac => {
              accounts.push(ac);
            });
          });
          exp.indirectexpensesActiveyear.childGroups.map(grp => {
            grp.accounts.map(ac => {
              accounts.push(ac);
            });
          });
          this.activeYearAccounts = accounts;
        }

        if (exp.operatingcostLastyear && exp.indirectexpensesLastyear) {
          let lastAccounts = [];
          exp.operatingcostLastyear.childGroups.map(grp => {
            grp.accounts.map(ac => {
              lastAccounts.push(ac);
            });
          });
          exp.indirectexpensesLastyear.childGroups.map(grp => {
            grp.accounts.map(ac => {
              lastAccounts.push(ac);
            });
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
    let displayStrings = _.uniqBy(this.generateActiveYearString().concat(this.generateLastYearString()), 'uniqueName');
    let ranks = this.generateRanksObject(displayStrings);
    //
    // displayStrings.map((ds, index) => {
    //   let f1 = ranks.find(r => r.uniqueName === ds.uniqueName);
    //   if (!f1) {
    //     displayStrings.splice(index, 1);
    //   } else {
    //     this.accountStrings.push(ds.name);
    //   }
    // });
    // this.activeYearAccountsRanks = ranks.map(r => r.activeAmount);
    // this.lastYearAccountsRanks = ranks.map(r => r.lastAmount);

    // this.activeYearAccounts.map(acc => {
    //     let findIndex = _.findIndex(displayStrings, p => p.uniqueName === acc.uniqueName);
    //     if (findIndex > -1) {
    //       if (acc.closingBalance.amount > 0) {
    //         activeRanks.push(acc.closingBalance.amount);
    //       } else {
    //         displayStrings.splice(findIndex, 1);
    //       }
    //     } else {
    //       activeRanks.push(0);
    //     }
    // });
    //
    // this.lastYearAccounts.map(acc => {
    //   let findIndex = _.findIndex(displayStrings, p => p.uniqueName === acc.uniqueName);
    //   if (findIndex > -1) {
    //     if (acc.closingBalance.amount > 0) {
    //       lastRanks.push(acc.closingBalance.amount);
    //     } else {
    //       displayStrings.splice(findIndex, 1);
    //     }
    //   } else {
    //     lastRanks.push(0);
    //   }
    // });
    // this.accountStrings = displayStrings.map(d => d.name);
    // this.activeYearAccountsRanks = activeRanks;
    // this.lastYearAccountsRanks = lastRanks;

    // this.activeYearAccounts.map(acc => {
    //   if (this.accountStrings.indexOf(acc.uniqueName) === -1) {
    //     activeRanks.push(0);
    //   } else {
    //     activeRanks.push(acc.closingBalance.amount);
    //   }
    // });
    //
    // this.lastYearAccounts.map(acc => {
    //   if (this.accountStrings.indexOf(acc.groupName) === -1) {
    //     lastRanks.push(0);
    //   } else {
    //     lastRanks.push(acc.closingBalance.amount);
    //   }
    // });
    // this.activeYearAccountsRanks = activeRanks;
    // this.lastYearAccountsRanks = lastRanks;

    this.options = {
      chart: {
        type: 'column',
        height: '320px'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: this.accountStrings,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
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
        name: `This Year`,
        data: this.activeYearAccountsRanks

      }, {
        name: `Last Year`,
        data: this.lastYearAccountsRanks

      }]
    };
  }

  public generateRanksObject(displayStrings: any[]) {
    let rankArray = [];
    this.activeYearAccounts.map(acc => {
      let f = displayStrings.find(a => acc.uniqueName === a.uniqueName);
      if (f) {
        rankArray.push(new ChartData(acc.name, acc.uniqueName, acc.closingBalance.amount));
      }
    });

    this.lastYearAccounts.map(acc => {
      let f = displayStrings.find(a => acc.uniqueName === a.uniqueName);
      if (f) {
        rankArray.push(new ChartData(acc.name, acc.uniqueName, 0, acc.closingBalance.amount));
      }
    });

    return rankArray;
  }

  public generateActiveYearString(): any[] {
    let activeStrings = [];
    this.activeYearAccounts.map(acc => {
      activeStrings.push({name: acc.name, uniqueName: acc.uniqueName});
    });
    return activeStrings;
  }

  public generateLastYearString(): any[] {
    let lastStrings = [];
    this.lastYearAccounts.map(acc => {
      lastStrings.push({name: acc.name, uniqueName: acc.uniqueName});
    });
    return lastStrings;
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

class ChartData {
  constructor(public name: string, public uniqueName: string, public activeAmount: number = 0, public lastAmount: number = 0) {
    //
  }
}
