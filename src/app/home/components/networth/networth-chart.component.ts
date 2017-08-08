import { AppState } from '../../../store/roots';
import { HomeActions } from '../../../services/actions/home/home.actions';
import { IComparisionChartResponse } from '../../../models/interfaces/dashboard.interface';
import { ComapnyResponse, ActiveFinancialYear } from '../../../models/api-models/Company';
import { Component, OnInit, Input } from '@angular/core';
import { Options } from 'highcharts';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IndividualSeriesOptionsExtension } from '../history/IndividualSeriesOptionsExtention';
import { Observable } from 'rxjs/Observable';
import { isNullOrUndefined } from 'util';
import * as  moment from 'moment';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';

@Component({
  selector: 'networth-chart',
  templateUrl: 'networth-chart.component.html'
})

export class NetworthChartComponent implements OnInit {
  @Input() public refresh: boolean = false;
  public options: Options;
  public monthlyOption = {
    chart: {
      type: 'column', height: '320px'
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
    series: []
  };
  public yearlyOption = {
    chart: {
      type: 'line', height: '320px'
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
    series: []
  };
  public activeFinancialYear: ActiveFinancialYear;
  public lastFinancialYear: ActiveFinancialYear;
  public companies$: Observable<ComapnyResponse[]>;
  public activeCompanyUniqueName$: Observable<string>;
  public comparisionChartData$: Observable<IComparisionChartResponse>;
  public requestInFlight = true;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private monthArray = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  private networthData: any;
  private currentchart: string = 'Monthly';
  private AllSeries: IndividualSeriesOptionsExtension[];
  constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
    this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.companies$ = this.store.select(p => p.company.companies).takeUntil(this.destroyed$);
    this.comparisionChartData$ = this.store.select(p => p.home.comparisionChart).takeUntil(this.destroyed$);
    this.options = this.monthlyOption;
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
  public fetchChartData() {
    this.requestInFlight = true;
    this.networthData = [];
    this.store.dispatch(this._homeActions.getNetworthChartDataOfActiveYear(
      this.activeFinancialYear.financialYearStarts,
      this.activeFinancialYear.financialYearEnds, this.refresh));
    this.refresh = false;
  }
  public ngOnInit() {
    this.comparisionChartData$
      .skipWhile(p => (isNullOrUndefined(p) || isNullOrUndefined(p.NetworthActiveYear)))
      // .distinctUntilChanged((p, q) => p.NetworthActiveYear === this.networthData)
      .subscribe(p => {
        this.networthData = p.NetworthActiveYear;
        this.generateCharts();
        this.requestInFlight = false;
      });
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
        // this.fetchChartData();
      }
    });
  }
}
