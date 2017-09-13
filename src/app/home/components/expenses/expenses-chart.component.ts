import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Options } from 'highcharts';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Observable';
import { ActiveFinancialYear, ComapnyResponse } from '../../../models/api-models/Company';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HomeActions } from '../../../services/actions/home/home.actions';
import moment from 'moment';
import * as _ from 'lodash';
import { ICbAccount, IChildGroups, IExpensesChartClosingBalanceResponse } from '../../../models/interfaces/dashboard.interface';
import { AccountChartDataLastCurrentYear } from '../../../models/view-models/AccountChartDataLastCurrentYear';
import { INameUniqueName } from '../../../models/interfaces/nameUniqueName.interface';

@Component({
  selector: 'expenses-chart',
  templateUrl: 'expenses-chart.component.html'
})

export class ExpensesChartComponent implements OnInit, OnDestroy {
  @Input() public refresh: boolean = false;
  public requestInFlight: boolean = false;
  public options: Options;
  public activeFinancialYear: ActiveFinancialYear;
  public lastFinancialYear: ActiveFinancialYear;
  public companies$: Observable<ComapnyResponse[]>;
  public activeCompanyUniqueName$: Observable<string>;
  public expensesChartData$: Observable<IExpensesChartClosingBalanceResponse>;
  public accountStrings: AccountChartDataLastCurrentYear[] = [];
  public activeYearAccounts: ICbAccount[] = [];
  public lastYearAccounts: ICbAccount[] = [];
  public activeYearAccountsRanks: number[] = [];
  public lastYearAccountsRanks: number[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
    this.expensesChartData$ = this.store.select(p => p.home.expensesChart).takeUntil(this.destroyed$);
    this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.companies$ = this.store.select(p => p.session.companies).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.companies$.subscribe(c => {
      if (c) {
        let activeCmpUniqueName = '';
        let financialYears = [];
        this.activeCompanyUniqueName$.take(1).subscribe(a => {
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
                financialYears = _.orderBy(financialYears, (it) => {
                  return moment(it.financialYearStarts, 'DD-MM-YYYY');
                }, 'desc');
                this.lastFinancialYear = financialYears[0];
              }
            }
          }
          debugger;
          if (activeCmpUniqueName) { this.refreshData(); }
        }
      }
    });

    this.expensesChartData$.subscribe(exp => {
      if (exp) {
        if (exp.operatingcostActiveyear && exp.indirectexpensesActiveyear) {
          let indirectexpensesAccounts = [].concat.apply([], this.flattenGroup([exp.indirectexpensesActiveyear] as IChildGroups[]).map((p: IChildGroups) => p.accounts));
          let operatingcostAccounts = [].concat.apply([], this.flattenGroup([exp.operatingcostActiveyear] as IChildGroups[]).map((p: IChildGroups) => p.accounts));
          let accounts = _.unionBy(indirectexpensesAccounts as ICbAccount[], operatingcostAccounts as ICbAccount[]) as ICbAccount[];
          this.activeYearAccounts = accounts;
        }

        if (exp.operatingcostLastyear && exp.indirectexpensesLastyear) {
          let indirectexpensesAccounts = [].concat.apply([], this.flattenGroup([exp.indirectexpensesLastyear] as IChildGroups[]).map((p: IChildGroups) => p.accounts));
          let operatingcostAccounts = [].concat.apply([], this.flattenGroup([exp.operatingcostLastyear] as IChildGroups[]).map((p: IChildGroups) => p.accounts));
          let lastAccounts = _.unionBy(indirectexpensesAccounts as ICbAccount[], operatingcostAccounts as ICbAccount[]) as ICbAccount[];
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
  public refreshData() {
    this.requestInFlight = true;
    this.store.dispatch(this._homeActions.getExpensesChartDataOfActiveYear(this.activeFinancialYear.financialYearStarts, this.activeFinancialYear.financialYearEnds, this.refresh));

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

    this.options = {
      colors: ['#28283c', '#aeaec4'],
      chart: {
        type: 'column',
        height: '320px',
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: this.accountStrings.map(p => p.name),
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

  public generateActiveYearString(): INameUniqueName[] {
    let activeStrings: INameUniqueName[] = [];
    this.activeYearAccounts.map(acc => {
      activeStrings.push({ uniqueName: acc.uniqueName, name: acc.name });
    });
    return activeStrings;
  }

  public generateLastYearString(): INameUniqueName[] {
    let lastStrings: INameUniqueName[] = [];
    this.lastYearAccounts.map(acc => {
      lastStrings.push({ uniqueName: acc.uniqueName, name: acc.name });
    });
    return lastStrings;
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
