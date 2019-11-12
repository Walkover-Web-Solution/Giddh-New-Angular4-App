import { skipWhile, take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import { ActiveFinancialYear, CompanyResponse } from '../../../models/api-models/Company';
import { Observable, ReplaySubject } from 'rxjs';
import { HomeActions } from '../../../actions/home/home.actions';
import {select, Store} from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { isNullOrUndefined } from 'util';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { DashboardService } from '../../../services/dashboard.service';
import {ProfitLossData, ProfitLossRequest, GetRevenueResponse, GetTotalExpenseResponse, GetIncomeBeforeTaxes} from "../../../models/api-models/tb-pl-bs";
import {TBPlBsActions} from "../../../actions/tl-pl.actions";
import * as Highcharts from 'highcharts';
import {GiddhCurrencyPipe} from '../../../shared/helpers/pipes/currencyPipe/currencyType.pipe';

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
  ],
  providers: [ GiddhCurrencyPipe ]
})

export class ProfitLossComponent implements OnInit, OnDestroy {
  @Input() public refresh: boolean = false;

  public options: Options;
  public activeFinancialYear: ActiveFinancialYear;
  public lastFinancialYear: ActiveFinancialYear;
  public companies$: Observable<CompanyResponse[]>;
  public activeCompanyUniqueName$: Observable<string>;
  public requestInFlight = true;
  public profitLossChart: Options;
  public totalOverDuesResponse$: Observable<any>;
  public totalIncome: number = 0;
  public totalIncomeType: string = '';
  public totalExpense: number = 0;
  public totalExpenseType: string = '';
  public netProfitLoss: number = 0;
  public netProfitLossType: string = '';
  public plRequest: ProfitLossRequest = {from: '', to: '', refresh: false};
  public amountSettings: any = {baseCurrencySymbol: '', balanceDecimalPlaces: ''};

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _homeActions: HomeActions, private _dashboardService: DashboardService, public tlPlActions: TBPlBsActions, public currencyPipe: GiddhCurrencyPipe) {
    this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
    this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
    this.totalOverDuesResponse$ = this.store.select(p => p.home.totalOverDues).pipe(takeUntil(this.destroyed$));
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

    this.filterData(moment().subtract(29, 'days').format(GIDDH_DATE_FORMAT), moment().format(GIDDH_DATE_FORMAT));

    this.store.pipe(select(p => p.tlPl.pl.data), takeUntil(this.destroyed$)).subscribe(p => {
      if (p) {
        let data = _.cloneDeep(p) as ProfitLossData;
        let revenue;
        let expense;
        let npl;

        if (data && data.incomeStatment && data.incomeStatment.revenue) {
          revenue = _.cloneDeep(data.incomeStatment.revenue) as GetRevenueResponse;
          this.totalIncome = revenue.amount;
          this.totalIncomeType = (revenue.type === "CREDIT") ? "Cr." : "Dr.";
        }

        if (data && data.incomeStatment && data.incomeStatment.totalExpenses) {
          expense = _.cloneDeep(data.incomeStatment.totalExpenses) as GetTotalExpenseResponse;
          this.totalExpense = expense.amount;
          this.totalExpenseType = (expense.type === "CREDIT") ? "Cr." : "Dr.";
        }

        if (data && data.incomeStatment && data.incomeStatment.incomeBeforeTaxes) {
          npl = _.cloneDeep(data.incomeStatment.incomeBeforeTaxes) as GetIncomeBeforeTaxes;
          this.netProfitLossType = (npl.type === "CREDIT") ? "+" : "-";
          this.netProfitLoss = npl.amount;
        }

        this.generateCharts();
      }
    });
  }

  public hardRefresh() {
    this.refresh = true;
    this.fetchChartData();
  }

  public fetchChartData() {
    this.requestInFlight = true;
    this.filterData(moment().subtract(29, 'days').format(GIDDH_DATE_FORMAT), moment().format(GIDDH_DATE_FORMAT));
  }

  public generateCharts() {
    let balanceDecimalPlaces = this.amountSettings.balanceDecimalPlaces;
    let cPipe = this.currencyPipe;

    this.profitLossChart = {
      colors: ['#FED46A', '#4693F1'],
      chart: {
        type: 'pie',
        polar: false,
        className: 'profit_loss_chart',
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
        //headerFormat: '<span style="font-size:12px">{point.key}</span><table>',
        //pointFormat: '<tr><td style="color:{series.color};padding:0"><b>{point.y:,.2f}/-</b> </td>' +
        //  '</tr>',
        //footerFormat: '</table>',
        shared: true,
        useHTML: true,
        formatter: function() {
          return cPipe.transform(this.point.y) + '/-';
        }
      },
      series: [{
        name: 'Profit & Loss',
        data: [['Total Income', this.totalIncome], ['Total Expenses', this.totalExpense]],
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
      this.filterData(dates[0], dates[1]);
    }
  }

  public filterData(from, to) {
    this.plRequest.from = from;
    this.plRequest.to = to;
    this.plRequest.refresh = false;

    this.store.dispatch(this.tlPlActions.GetProfitLoss(_.cloneDeep(this.plRequest)));
  }
}
