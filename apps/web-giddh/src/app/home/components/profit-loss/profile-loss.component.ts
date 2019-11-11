import { skipWhile, take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import { ActiveFinancialYear, CompanyResponse } from '../../../models/api-models/Company';
import { Observable, ReplaySubject } from 'rxjs';
import { HomeActions } from '../../../actions/home/home.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { isNullOrUndefined } from 'util';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { DashboardService } from '../../../services/dashboard.service';
import {TBPlBsActions} from "../../../actions/tl-pl.actions";
import {ProfitLossRequest} from "../../../models/api-models/tb-pl-bs";

@Component({
  selector: 'profit-loss',
  templateUrl: 'profit-loss.component.html',
  styleUrls: ['../../home.component.scss'],
  styles: [
    `
      .total_amt {
        font-size: 18px;
      }

      .totalIncomeText {
        color: #4693F1;
      }
      .totalExpensesText{
        color:#FED46A
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

export class ProfitLossComponent implements OnInit, OnDestroy {
  @Input() public refresh: boolean = false;

  // public ApiToCALL: API_TO_CALL[] = [API_TO_CALL.PL];
  public options: Options;
  public activeFinancialYear: ActiveFinancialYear;
  public lastFinancialYear: ActiveFinancialYear;
  public companies$: Observable<CompanyResponse[]>;
  public activeCompanyUniqueName$: Observable<string>;
  public requestInFlight = true;
  public profitLossChart: Options;
  public profitLossResponse$: Observable<any>;
  public sundryDebtorResponse: any = {};
  public sundryCreditorResponse: any = {};
  public totalRecievable: number = 0;
  public totalPayable: number = 0;
  public overDueObj: any = {};
  public ReceivableDurationAmt: number = 0;
  public PaybaleDurationAmt: number = 0;


  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _homeActions: HomeActions, private _dashboardService: DashboardService, public tlPlActions: TBPlBsActions) {
    this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
    this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
    this.profitLossResponse$ = this.store.select(p => p.home.totalOverDues).pipe(takeUntil(this.destroyed$));
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
        // if (activeCmpUniqueName) { this.fetchChartData(); }
      }
    });

    this.store.dispatch(this._homeActions.getTotalOverdues(moment().subtract(29, 'days').format(GIDDH_DATE_FORMAT), moment().format(GIDDH_DATE_FORMAT), false));

    this.profitLossResponse$.pipe(
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

          // console.log(p);
          this.generateCharts();
          this.requestInFlight = false;
        }

      });

  }

  public hardRefresh() {
    this.refresh = true;
    this.fetchChartData();
  }

  public fetchChartData() {
    this.requestInFlight = true;
    // this.ApiToCALL = [];
    this.store.dispatch(this._homeActions.getTotalOverdues(moment().subtract(29, 'days').format(GIDDH_DATE_FORMAT), moment().format(GIDDH_DATE_FORMAT), true));
  }

  public generateCharts() {
    this.profitLossChart = {
      colors: ['#FED46A', '#4693F1'],
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
          shadow: false,
          // center: [
          //     '50%',
          //     '50%'
          // ],
        },
        series: {
          animation: false,
          dataLabels: {}
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:12px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0"><b>{point.percentage:.1f} %</b> </td>' +
          '</tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      series: [{
        name: 'Total Overdues',
        data: [['Total Recievable', this.totalRecievable * 100 / (this.totalRecievable + this.totalPayable)], ['Total Payable', this.totalPayable * 100 / (this.totalPayable + this.totalRecievable)]],
      }],
    };
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

  public filterData() {
    let request: ProfitLossRequest;
    this.store.dispatch(this.tlPlActions.GetProfitLoss(_.cloneDeep(request)));
  }
}
