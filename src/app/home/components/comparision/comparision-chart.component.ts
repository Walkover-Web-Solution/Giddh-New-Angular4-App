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
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

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
  }

  public fetchChartData() {
    this.store.dispatch(this._homeActions.getComparisionChartDataOfActiveYear(
      this.activeFinancialYear.financialYearStarts,
      this.activeFinancialYear.financialYearEnds, false));

    this.store.dispatch(this._homeActions.getComparisionChartDataOfLastYear(
      this.lastFinancialYear.financialYearStarts,
      this.lastFinancialYear.financialYearEnds, false));
  }

  public generateCharts() {
    this.options = {
      yAxis: {
        title: {
          text: 'Number of Employees'
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: { color: '#333333', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }
      },

      plotOptions: {
        series: {
          pointStart: 2010
        }
      },

      series: [{
        name: 'Expense',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
      }, {
        name: 'Revenue',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
      }, {
        name: 'Profit/Loss',
        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
      }, {
        name: 'LY Expense',
      }, {
        name: 'LY Revenue',
      }, {
        name: 'LY Profit/Loss',
      }]
    };
  }
}
