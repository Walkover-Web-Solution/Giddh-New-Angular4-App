import { skipWhile, take, takeUntil } from 'rxjs/operators';
import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';
import { ActiveFinancialYear, CompanyResponse } from '../../../models/api-models/Company';
import { Observable, ReplaySubject } from 'rxjs';
import { HomeActions } from '../../../actions/home/home.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { isNullOrUndefined } from 'util';
import { FormControl } from '@angular/forms';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { DashboardService } from '../../../services/dashboard.service';
import {GiddhCurrencyPipe} from '../../../shared/helpers/pipes/currencyPipe/currencyType.pipe';
import { createSelector } from 'reselect';

@Component({
  selector: 'toal-overdues-chart',
  templateUrl: 'total-overdues-chart.component.html',
  styleUrls: ['../../home.component.scss'],
  styles: [
    `
      .total_amt {
        font-size: 18px;
      }

      .customerDueText {
        color: #0CB1AF;
      }
      .vendorDueText{
        color:#F85C88;
      }

      .secondary_text {
        color: #5B64C9;
      }
      span.monthDropdown {
        font-size: 12px;
        color: #666666;
        vertical-align: top;
      }
      .dashboard-filter .btn-group {
          display: block;
              line-height: 1;
      }
       .dashboard-filter .btn-group span{
        vertical-align: middle;
         color: #666666;
       }
       .underline{
         text-decoration:underline;
       }
       .dashboard-filter{
         display:inline-flex;
         color:#666666;
             align-items: flex-end;

       }

       .dashboard-filter .icon-collapse-icon{
        margin-left: 8px;
    font-size: 14px;
}

.dueAmount {
    color: #262626;
    font-size: 16px;
    margin: 0;
    padding: 0;
}
     span.icon-rupees {
    font-size: 15px;
}
.panel-body small {
    color: #666666;
}

    `
  ]
})

export class TotalOverduesChartComponent implements OnInit, OnDestroy {
  @Input() public refresh: boolean = false;

  public options: Options;
  public activeFinancialYear: ActiveFinancialYear;
  public lastFinancialYear: ActiveFinancialYear;
  public companies$: Observable<CompanyResponse[]>;
  public activeCompanyUniqueName$: Observable<string>;
  public requestInFlight = true;
  public totaloverDueChart: Options;
  public totalOverDuesResponse$: Observable<any>;
  public sundryDebtorResponse: any = {};
  public sundryCreditorResponse: any = {};
  public totalRecievable: number = 0;
  public totalPayable: number = 0;
  public overDueObj: any = {};
  public ReceivableDurationAmt: number = 0;
  public PaybaleDurationAmt: number = 0;
  public moment = moment;
  public amountSettings: any = {baseCurrencySymbol: '', balanceDecimalPlaces: ''};
  public isDefault: boolean = true;
  public universalDate$: Observable<any>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _homeActions: HomeActions, private _dashboardService: DashboardService, public currencyPipe: GiddhCurrencyPipe) {
    this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
    this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
    this.totalOverDuesResponse$ = this.store.select(p => p.home.totalOverDues).pipe(takeUntil(this.destroyed$));
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    // get activeFinancialYear and lastFinancialYear
    this.companies$.subscribe(c => {
      if (c) {
        let activeCompany: CompanyResponse;
        let activeCmpUniqueName = '';
        let financialYears = [];
        this.activeCompanyUniqueName$.pipe(take(1)).subscribe(a => {
          activeCmpUniqueName = a;
          activeCompany = c.find(p => p.uniqueName === a);
          if (activeCompany) {
            this.amountSettings.baseCurrencySymbol = activeCompany.baseCurrencySymbol;
            this.amountSettings.balanceDecimalPlaces = activeCompany.balanceDecimalPlaces;
            this.activeFinancialYear = activeCompany.activeFinancialYear;
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
        }
      }
    });

    // listen for universal date
    this.universalDate$.subscribe(dateObj => {
      if (this.isDefault && dateObj) {
        let dates = [];
        dates = [moment(dateObj[0]).format(GIDDH_DATE_FORMAT), moment(dateObj[1]).format(GIDDH_DATE_FORMAT), false];
        this.getFilterDate(dates);
        this.isDefault = false;
      }
    });

    this.totalOverDuesResponse$.pipe(
      skipWhile(p => (isNullOrUndefined(p))))
      .subscribe(p => {
        if (p.length) {
          this.overDueObj = p;
          this.overDueObj.forEach((grp) => {
            if (grp.uniqueName === 'sundrydebtors') {
              this.sundryDebtorResponse = grp;
              this.totalRecievable = this.sundryDebtorResponse.closingBalance.amount;
              this.ReceivableDurationAmt = this.sundryDebtorResponse.debitTotal - this.sundryDebtorResponse.creditTotal;
            } else {
              this.sundryCreditorResponse = grp;
              this.totalPayable = this.sundryCreditorResponse.closingBalance.amount;
              this.PaybaleDurationAmt = this.sundryCreditorResponse.creditTotal - this.sundryCreditorResponse.debitTotal;
            }
          });

          this.generateCharts();
        }

      });
  }

  public generateCharts() {
    let baseCurrencySymbol = this.amountSettings.baseCurrencySymbol;
    let balanceDecimalPlaces = this.amountSettings.balanceDecimalPlaces;
    let cPipe = this.currencyPipe;

    this.totaloverDueChart = {
      colors: ['#F85C88', '#0CB1AF'],
      chart: {
        type: 'pie',
        polar: false,
        className: 'overdue_chart',
        width: 300,
        height: '180px'
      },
      title: {
        text: '',
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
          shadow: false
        },
        series: {
          animation: false,
          dataLabels: {}
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function() {
          return baseCurrencySymbol+ " " + cPipe.transform(this.point.y) + '/-';
        }
      },
      series: [{
        name: 'Total Overdues',
        data: [['Customer Due', this.totalRecievable], ['Vendor Due', this.totalPayable]],
      }],
    };

    this.requestInFlight = false;
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public getFilterDate(dates: any) {
    if (dates !== null) {
      this.requestInFlight = true;
      this.store.dispatch(this._homeActions.getTotalOverdues(dates[0], dates[1], true));
    }
  }
}
