import { Component, OnDestroy, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Observable';
import { ActiveFinancialYear, ComapnyResponse } from '../../../models/api-models/Company';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'expenses-chart',
  templateUrl: 'expenses-chart.component.html'
})

export class ExpensesChartComponent implements OnInit, OnDestroy {
  public options: Options;
  public activeCompany: Observable<ComapnyResponse>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.options = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Historic World Population by Region'
      },
      subtitle: {
        text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
      },
      xAxis: {
        categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Population (millions)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' millions'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: ('#FFFFFF'),
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Year 1800',
        data: [107, 31, 635, 203, 2]
      }, {
        name: 'Year 1900',
        data: [133, 156, 947, 408, 6]
      }, {
        name: 'Year 2012',
        data: [1052, 954, 4250, 740, 38]
      }]
    };
    this.activeCompany = this.store.select(state => {
      if (!state.company.companies) {
        return;
      }
      return state.company.companies.find(cmp => {
        return cmp.uniqueName === state.session.companyUniqueName;
      });
    }).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.refreshData();
  }

  public refreshData() {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
