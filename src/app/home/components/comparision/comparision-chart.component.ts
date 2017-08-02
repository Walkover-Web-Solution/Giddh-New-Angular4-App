import { Component, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import { ActiveFinancialYear, ComapnyResponse } from '../../../models/api-models/Company';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HomeActions } from '../../../services/actions/home/home.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import moment from 'moment';
import * as _ from 'lodash';
import { IComparisionChartResponse } from '../../../models/interfaces/dashboard.interface';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'compare-chart',
  templateUrl: 'comparision-chart.component.html'
})

export class ComparisionChartComponent implements OnInit {
  public options: Options;
  public activeFinancialYear: ActiveFinancialYear;
  public lastFinancialYear: ActiveFinancialYear;
  public companies$: Observable<ComapnyResponse[]>;
  public activeCompanyUniqueName$: Observable<string>;
  public comparisionChartData$: Observable<IComparisionChartResponse>;
  public requestInFlight = true;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private monthArray = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  private expenseData = [];
  private expenseDataLY = [];
  private revenueData = [];
  private revenueDataLY = [];
  private profitLossData = [];
  private profitLossDataLY = [];

  constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
    this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.companies$ = this.store.select(p => p.company.companies).takeUntil(this.destroyed$);
    this.comparisionChartData$ = this.store.select(p => p.home.comparisionChart).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    // get activeFinancialYear and lastFinancialYear
    this.companies$.subscribe(c => {
      if (c) {
        let activeCompany: ComapnyResponse;
        let activeCmpUniqueName = '';
        let financialYears = [];
        this.activeCompanyUniqueName$.take(1).subscribe(a => {
          activeCmpUniqueName = a;
          activeCompany = c.find(p => p.uniqueName === a);
          this.activeFinancialYear = activeCompany.activeFinancialYear;
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
        }
        this.fetchChartData();
      }
    });

    this.comparisionChartData$
      .skipWhile(p => isNullOrUndefined(p) || isNullOrUndefined(p.ProfitLossActiveYear) || isNullOrUndefined(p.revenueLastYear) || isNullOrUndefined(p.revenueActiveYear))
      .distinctUntilChanged((p, q) => p.ExpensesActiveMonthly === this.expenseData)
      .subscribe(p => {
        this.expenseData = (p.ExpensesActiveMonthly);
        this.expenseDataLY = (p.ExpensesLastYearMonthly);
        this.revenueData = (p.revenueActiveYearMonthly);
        this.revenueDataLY = (p.revenueLastYearMonthly);
        this.profitLossData = p.ProfitLossActiveYearMonthly;
        this.generateCharts();
        this.requestInFlight = false;
      });
  }

  public fetchChartData() {
    this.expenseData = [];
    this.requestInFlight = true;
    this.store.dispatch(this._homeActions.getComparisionChartDataOfActiveYear(
      this.activeFinancialYear.financialYearStarts,
      this.activeFinancialYear.financialYearEnds, false));

    this.store.dispatch(this._homeActions.getComparisionChartDataOfLastYear(
      this.lastFinancialYear.financialYearStarts,
      this.lastFinancialYear.financialYearEnds, false));
  }

  public generateCharts() {
    this.options = {
      title: {
        text: ''
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      xAxis: {
        categories: this.monthArray
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: { color: '#333333', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }
      },
      series: [{
        name: 'Expense',
        data: this.expenseData
      }, {
        name: 'Revenue',
        data: this.revenueData
      }, {
        name: 'Profit/Loss',
        data: this.profitLossData
      }, {
        name: 'LY Expense',
        data: this.expenseDataLY
      }, {
        name: 'LY Revenue',
        data: this.revenueDataLY
      }, {
        name: 'LY Profit/Loss',
        data: this.profitLossDataLY
      }]
    };
  }
}
