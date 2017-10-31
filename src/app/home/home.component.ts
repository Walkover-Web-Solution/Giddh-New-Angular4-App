import { ComparisionChartComponent } from './components/comparision/comparision-chart.component';
import { NetworthChartComponent } from './components/networth/networth-chart.component';
import { HistoryChartComponent } from './components/history/history-chart.component';
import { RevenueChartComponent } from './components/revenue/revenue-chart.component';
import { ExpensesChartComponent } from './components/expenses/expenses-chart.component';
import { LiveAccountsComponent } from './components/live-accounts/live-accounts.component';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { StateDetailsRequest, CompanyResponse, ActiveFinancialYear } from '../models/api-models/Company';
import { CompanyActions } from '../services/actions/company.actions';
import { IComparisionChartResponse, IExpensesChartClosingBalanceResponse, IRevenueChartClosingBalanceResponse } from '../models/interfaces/dashboard.interface';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment/moment';
import * as _ from '../lodash-optimized';
import { CHART_CALLED_FROM, API_TO_CALL } from '../services/actions/home/home.const';
import { HomeActions } from '../services/actions/home/home.actions';
@Component({
  selector: 'home',  // <home></home>
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public companies$: Observable<CompanyResponse[]>;
  public activeCompanyUniqueName$: Observable<string>;
  public revenueChartData$: Observable<IRevenueChartClosingBalanceResponse>;
  public networthComparisionChartData$: Observable<IComparisionChartResponse>;
  public historyComparisionChartData$: Observable<IComparisionChartResponse>;
  public expensesChartData$: Observable<IExpensesChartClosingBalanceResponse>;
  public comparisionChartData$: Observable<IComparisionChartResponse>;
  @ViewChild('liveaccount') public liveaccount: LiveAccountsComponent;
  @ViewChild('expence') public expence: ExpensesChartComponent;
  @ViewChild('revenue') public revenue: RevenueChartComponent;
  @ViewChild('compare') public compare: ComparisionChartComponent;
  @ViewChild('history') public history: HistoryChartComponent;
  @ViewChild('networth') public networth: NetworthChartComponent;
  public activeFinancialYear: ActiveFinancialYear;
  public lastFinancialYear: ActiveFinancialYear;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private companyActions: CompanyActions, private cdRef: ChangeDetectorRef, private _homeActions: HomeActions) {
    this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.companies$ = this.store.select(p => p.session.companies).takeUntil(this.destroyed$);
    this.comparisionChartData$ = this.store.select(p => p.home.comparisionChart).takeUntil(this.destroyed$);
    this.expensesChartData$ = this.store.select(p => p.home.expensesChart).takeUntil(this.destroyed$);
    this.historyComparisionChartData$ = this.store.select(p => p.home.history_comparisionChart).takeUntil(this.destroyed$);
    this.networthComparisionChartData$ = this.store.select(p => p.home.networth_comparisionChart).takeUntil(this.destroyed$);
    this.revenueChartData$ = this.store.select(p => p.home.revenueChart).takeUntil(this.destroyed$);

    //
  }

  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'home';
    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

  }

  public ngAfterViewInit(): void {
    this.companies$.subscribe(c => {
      if (c) {
        let activeCmpUniqueName = '';
        let financialYears: ActiveFinancialYear[] = [];
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
          if (activeCmpUniqueName) {
            // debugger;
            this.store.dispatch(this._homeActions.getComparisionChartDataOfActiveYear(
              this.activeFinancialYear.financialYearStarts,
              this.activeFinancialYear.financialYearEnds, false, CHART_CALLED_FROM.PAGEINIT, [API_TO_CALL.PL]));

            this.expence.fetchChartData();
            this.revenue.fetchChartData();

            this.history.requestInFlight = true;
            // this.history.refresh = true;
            // this.history.fetchChartData();

            this.networth.requestInFlight = true;
            this.cdRef.detectChanges();
          }
        }
      }
    });

  }
  public hardRefresh() {
    let API = [API_TO_CALL.PL];
    if (this.activeFinancialYear) {
      this.expence.refresh = true;
      this.compare.requestInFlight = true;
      this.history.requestInFlight = true;
      this.networth.requestInFlight = true;
      this.expence.fetchChartData();

      this.revenue.refresh = true;
      this.revenue.fetchChartData();
      if (this.compare.showProfitLoss) { API.push(API_TO_CALL.PL); }
      if (this.compare.showExpense) { API.push(API_TO_CALL.EXPENCE); }
      if (this.compare.showRevenue) { API.push(API_TO_CALL.REVENUE); }

      if (this.history.showProfitLoss) { API.push(API_TO_CALL.PL); }
      if (this.history.showExpense) { API.push(API_TO_CALL.EXPENCE); }
      if (this.history.showRevenue) { API.push(API_TO_CALL.REVENUE); }

      // if(this.networth.)
      let unique = API.filter((elem, index, self) => {
        return index === self.indexOf(elem);
      });

      this.store.dispatch(this._homeActions.getComparisionChartDataOfActiveYear(
        this.activeFinancialYear.financialYearStarts,
        this.activeFinancialYear.financialYearEnds, true, CHART_CALLED_FROM.PAGEINIT, unique));
      API = [];
      if (this.compare.showProfitLoss && this.compare.showLastYear) { API.push(API_TO_CALL.PL); }
      if (this.compare.showExpense && this.compare.showLastYear) { API.push(API_TO_CALL.EXPENCE); }
      if (this.compare.showRevenue && this.compare.showLastYear) { API.push(API_TO_CALL.REVENUE); }

      if (this.history.showProfitLoss && this.history.showLastYear) { API.push(API_TO_CALL.PL); }
      if (this.history.showExpense && this.history.showLastYear) { API.push(API_TO_CALL.EXPENCE); }
      if (this.history.showRevenue && this.history.showLastYear) { API.push(API_TO_CALL.REVENUE); }

      // if(this.networth.)
      unique = API.filter((elem, index, self) => {
        return index === self.indexOf(elem);
      });
      if (this.lastFinancialYear && this.history.showLastYear && this.compare.showLastYear) {
        this.store.dispatch(this._homeActions.getComparisionChartDataOfLastYear(
          this.lastFinancialYear.financialYearStarts,
          this.lastFinancialYear.financialYearEnds, true, CHART_CALLED_FROM.HISTORY, unique));
      }
      // debugger;
    }
  }

  public ngOnDestroy() {
    this.store.dispatch(this._homeActions.ResetHomeState());
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
