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
  public ratioObj: any = {} ;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
    this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.companies$ = this.store.select(p => p.session.companies).takeUntil(this.destroyed$);
    this.rationResponse$ = this.store.select(p => p.home.RatioAnalysis).takeUntil(this.destroyed$);
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

    this.rationResponse$
      .skipWhile(p => (isNullOrUndefined(p)))
      .subscribe(p => {
        this.ratioObj = p;
        // console.log(p);
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
    // this.ApiToCALL = [];

    this.refresh = false;
  }

  public generateCharts() {
    this.currentRatioOption = {
      colors: ['#d37c59', '#005b77'],
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
      series: [{
          name: 'Current Ratio',
          data: [['Current Assets', this.ratioObj.currentRatio * 10 / 10], ['Current Liabilities', 10]],
      }],
    };

    this.debtOptions = {
      colors: ['#d37c59', '#005b77'],
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
      series: [{
          name: 'Debt Equity Ratio',
          data: [['Current Liab + NonCurrent Liab', this.ratioObj.debtEquityRatio * 10 / 10], ['Shareholders fund', 10]],

      }]
    };

    this.proprietaryOption = {
      colors: ['#d37c59', '#005b77'],
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
      series: [{
          name: 'Proprietary Ratio',
          data: [['Shareholders fund', this.ratioObj.proprietaryRatio * 10 / 10], ['Total Assets', 10]],

      }]
    };

    this.fixedAssetOption = {
      colors: ['#d37c59', '#005b77'],
      chart: {
          type: 'pie',
          polar: false,
          width: 170,
          height: '180px'
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
      series: [{
          name: 'Fixed Assets Ratio',
          data: [['Fixed Assets / NonCurrent Liab', this.ratioObj.fixedAssetRatio * 10 / 10], ['Shareholders fund', 10]],
      }]
    };
  }
}
