import { Component, Input, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import { ActiveFinancialYear, CompanyResponse } from '../../../models/api-models/Company';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HomeActions } from '../../../actions/home/home.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { IComparisionChartResponse } from '../../../models/interfaces/dashboard.interface';
import { isNullOrUndefined } from 'util';
import { IndividualSeriesOptionsExtension } from '../history/IndividualSeriesOptionsExtention';
import { CHART_CALLED_FROM, API_TO_CALL } from '../../../actions/home/home.const';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';

@Component({
  selector: 'ratio-analysis-chart',
  templateUrl: 'ratio-analysis-chart.component.html',
  styleUrls: ['../../home.component.scss']
})

export class RatioAnalysisChartComponent implements OnInit {
  @Input() public refresh: boolean = false;

  public ApiToCALL: API_TO_CALL[] = [API_TO_CALL.PL];
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

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
    this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.companies$ = this.store.select(p => p.session.companies).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
      this.store.dispatch(this._homeActions.getRatioAnalysis(moment().format(GIDDH_DATE_FORMAT)));
    // get activeFinancialYear and lastFinancialYear
    this.companies$.subscribe(c => {
      if (c) {
        let activeCompany: CompanyResponse;
        let activeCmpUniqueName = '';
        let financialYears = [];
        this.activeCompanyUniqueName$.take(1).subscribe(a => {
          activeCmpUniqueName = a;
          activeCompany = c.find(p => p.uniqueName === a);
          if (activeCompany) { this.activeFinancialYear = activeCompany.activeFinancialYear; }
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

    this.comparisionChartData
      .skipWhile(p => (isNullOrUndefined(p)))
      .subscribe(p => {
        console.log(p);
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

    this.refresh = false;
  }

  public generateCharts() {
    this.currentRatioOption = {
      chart: {
          type: 'pie',
          width: 250,
          height: '250px'
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
        categories: []
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
      plotOptions: {
          pie: {
              shadow: false,
              size: '40%',
              innerSize: '60%',
          }
      },
      series: [{
          name: 'Browsers',
          data: [['Firefox', 2.62], ['Chrome', 1]]
      }]
    };
    this.debtOptions = {
      chart: {
          type: 'pie',
          width: 250,
          height: '250px'
      },
      title: {
          text: ''
      },
      yAxis: {
          title: {
              text: ''
          }
      },
      plotOptions: {
          pie: {
              shadow: false,
              size: '40%',
              innerSize: '60%',
          }
      },
      tooltip: {
          // formatter: function() {
          //     return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
          // }
      },
      series: [{
          name: 'Browsers',
          data: [['Firefox', 2.62], ['Chrome', 1]]
      }]
    };

    this.proprietaryOption = {
      chart: {
          type: 'pie',
          width: 250,
          height: '250px'
      },
      title: {
          text: ''
      },
      yAxis: {
          title: {
              text: ''
          }
      },
      plotOptions: {
          pie: {
              shadow: false,
              size: '40%',
              innerSize: '60%',
          }
      },
      tooltip: {
          // formatter: function() {
          //     return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
          // }
      },
      series: [{
          name: 'Browsers',
          data: [['Firefox', 2.62], ['Chrome', 1]]
      }]
    };

    this.fixedAssetOption = {
      chart: {
          type: 'pie',
          width: 250,
          height: '250px'
      },
      title: {
          text: ''
      },
      yAxis: {
          title: {
              text: ''
          }
      },
      plotOptions: {
          pie: {
              shadow: false,
              size: '40%',
              innerSize: '60%',
          }
      },
      tooltip: {
          // formatter: function() {
          //     return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
          // }
      },
      series: [{
          name: 'Browsers',
          data: [['Firefox', 2.62], ['Chrome', 1]]
      }]
    };
      // chart: {
      //   height: '273px',
      //   width: 900,
      //   zoomType: 'x'
      // },
      // title: {
      //   text: ''
      // },
      // yAxis: {
      //   title: {
      //     text: ''
      //   },
      //   gridLineWidth: 0,
      //   minorGridLineWidth: 0,
      // },
      // xAxis: {
      //   categories: []
      // },
      // legend: {
      //   layout: 'horizontal',
      //   align: 'center',
      //   verticalAlign: 'bottom',
      //   itemStyle: { color: '#333333', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' },
      //   enabled: false
      // },
      // credits: {
      //   enabled: false
      // },
  }
}
