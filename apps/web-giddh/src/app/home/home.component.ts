import { take, takeUntil } from 'rxjs/operators';
import { ComparisionChartComponent } from './components/comparision/comparision-chart.component';
import { NetworthChartComponent } from './components/networth/networth-chart.component';
import { HistoryChartComponent } from './components/history/history-chart.component';
import { RevenueChartComponent } from './components/revenue/revenue-chart.component';
import { ExpensesChartComponent } from './components/expenses/expenses-chart.component';
import { LiveAccountsComponent } from './components/live-accounts/live-accounts.component';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { ActiveFinancialYear, CompanyResponse, StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { IComparisionChartResponse, IExpensesChartClosingBalanceResponse, IRevenueChartClosingBalanceResponse } from '../models/interfaces/dashboard.interface';
import * as moment from 'moment/moment';
import * as _ from '../lodash-optimized';
import { API_TO_CALL, CHART_CALLED_FROM } from '../actions/home/home.const';
import { HomeActions } from '../actions/home/home.actions';
import { Router } from '@angular/router';
import { AccountService } from 'apps/web-giddh/src/app/services/account.service';
import { ProfitLossComponent } from './components/profit-loss/profile-loss.component';
import { gstComponent } from './components/gst/gst.component';
import { BankAccountsComponent } from './components/bank-accounts/bank-accounts.component';
import { CrDrComponent } from './components/cr-dr-list/cr-dr-list.component';
import { TotalSalesComponent } from './components/total-sales/total-sales.component';
import { SubscriptionsUser } from "../models/api-models/Subscriptions";
import { createSelector } from "reselect";
import { GeneralService } from "../services/general.service";

@Component({
    selector: 'home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
    public companies$: Observable<CompanyResponse[]>;
    public activeCompanyUniqueName$: Observable<string>;
    public needsToRedirectToLedger$: Observable<boolean>;
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
    @ViewChild('profitloss') public profitloss: ProfitLossComponent;
    @ViewChild('gst') public gst: gstComponent;
    @ViewChild('bankaccount') public bankaccount: BankAccountsComponent;
    @ViewChild('crdrlist') public crdrlist: CrDrComponent;
    @ViewChild('totalSales') public totalSales: TotalSalesComponent;

    public selectedCompany: Observable<CompanyResponse>;
    public subscribedPlan: SubscriptionsUser;
    public activeFinancialYear: ActiveFinancialYear;
    public lastFinancialYear: ActiveFinancialYear;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public hideallcharts: boolean = false;

    constructor(
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private cdRef: ChangeDetectorRef,
        private _homeActions: HomeActions,
        private _router: Router,
        private _accountService: AccountService,
        private _generalService: GeneralService
    ) {
        this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
        this.comparisionChartData$ = this.store.select(p => p.home.comparisionChart).pipe(takeUntil(this.destroyed$));
        this.expensesChartData$ = this.store.select(p => p.home.expensesChart).pipe(takeUntil(this.destroyed$));
        this.historyComparisionChartData$ = this.store.select(p => p.home.history_comparisionChart).pipe(takeUntil(this.destroyed$));
        this.networthComparisionChartData$ = this.store.select(p => p.home.networth_comparisionChart).pipe(takeUntil(this.destroyed$));
        this.revenueChartData$ = this.store.select(p => p.home.revenueChart).pipe(takeUntil(this.destroyed$));
        this.needsToRedirectToLedger$ = this.store.select(p => p.login.needsToRedirectToLedger).pipe(takeUntil(this.destroyed$));

        this.selectedCompany = this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
            if (!companies) {
                return;
            }

            let orderedCompanies = _.orderBy(companies, 'name');
            this.companies$ = observableOf(orderedCompanies);
            this.store.dispatch(this.companyActions.setTotalNumberofCompanies(orderedCompanies.length));
            let selectedCmp = companies.find(cmp => {
                if (cmp && cmp.uniqueName) {
                    return cmp.uniqueName === uniqueName;
                } else {
                    return false;
                }
            });

            return selectedCmp;
        })).pipe(takeUntil(this.destroyed$));

        this.selectedCompany.subscribe((res: any) => {
            if (res) {
                if (res.subscription) {
                    this.store.dispatch(this.companyActions.setCurrentCompanySubscriptionPlan(res.subscription));
                    this.subscribedPlan = res.subscription;
                }
            }
        });
    }

    public ngOnInit() {
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'home';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

        this._generalService.invokeEvent.subscribe(value => {
            if (value === 'hideallcharts') {
                this.hideallcharts = true;
            }
            if (value === 'showallcharts') {
                this.hideallcharts = false;
            }
        });
    }

    public ngAfterViewInit(): void {
        this.companies$.subscribe(c => {
            if (c) {
                let activeCmpUniqueName = '';
                let financialYears: ActiveFinancialYear[] = [];
                this.activeCompanyUniqueName$.pipe(take(1)).subscribe(a => {
                    activeCmpUniqueName = a;
                    let res = c.find(p => p.uniqueName === a);
                    if (res) {
                        this.activeFinancialYear = res.activeFinancialYear;

                        this.needsToRedirectToLedger$.pipe(take(1)).subscribe(result => {
                            if (result) {
                                this._accountService.getFlattenAccounts('', '').pipe(takeUntil(this.destroyed$)).subscribe(data => {
                                    if (data.status === 'success' && data.body.results.length > 0) {
                                        this._router.navigate([`ledger/${data.body.results[0].uniqueName}`]);
                                    }
                                });
                            }
                        });
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
                        // this.store.dispatch(this._homeActions.getComparisionChartDataOfActiveYear(this.activeFinancialYear.financialYearStarts, this.activeFinancialYear.financialYearEnds, false, CHART_CALLED_FROM.PAGEINIT, [API_TO_CALL.PL]));
                        this.cdRef.detectChanges();
                    }
                }
            }
        });

    }

    // public hardRefresh() {
    //     let API = [API_TO_CALL.PL];
    //     if (this.activeFinancialYear) {
    //         //this.expence.refresh = true;
    //         this.compare.requestInFlight = true;
    //         //this.history.requestInFlight = true;
    //         //this.networth.requestInFlight = true;
    //         //this.expence.fetchChartData();

    //         this.revenue.refreshChart();
    //         if (this.compare.showProfitLoss) {
    //             API.push(API_TO_CALL.PL);
    //         }
    //         if (this.compare.showExpense) {
    //             API.push(API_TO_CALL.EXPENCE);
    //         }
    //         if (this.compare.showRevenue) {
    //             API.push(API_TO_CALL.REVENUE);
    //         }

    //         if (this.history.showProfitLoss) {
    //             API.push(API_TO_CALL.PL);
    //         }
    //         if (this.history.showExpense) {
    //             API.push(API_TO_CALL.EXPENCE);
    //         }
    //         if (this.history.showRevenue) {
    //             API.push(API_TO_CALL.REVENUE);
    //         }

    //         let unique = API.filter((elem, index, self) => {
    //             return index === self.indexOf(elem);
    //         });

    //         this.store.dispatch(this._homeActions.getComparisionChartDataOfActiveYear(
    //             this.activeFinancialYear.financialYearStarts,
    //             this.activeFinancialYear.financialYearEnds, true, CHART_CALLED_FROM.PAGEINIT, unique));
    //         API = [];
    //         if (this.compare.showProfitLoss && this.compare.showLastYear) {
    //             API.push(API_TO_CALL.PL);
    //         }
    //         if (this.compare.showExpense && this.compare.showLastYear) {
    //             API.push(API_TO_CALL.EXPENCE);
    //         }
    //         if (this.compare.showRevenue && this.compare.showLastYear) {
    //             API.push(API_TO_CALL.REVENUE);
    //         }

    //         if (this.history.showProfitLoss && this.history.showLastYear) {
    //             API.push(API_TO_CALL.PL);
    //         }
    //         if (this.history.showExpense && this.history.showLastYear) {
    //             API.push(API_TO_CALL.EXPENCE);
    //         }
    //         if (this.history.showRevenue && this.history.showLastYear) {
    //             API.push(API_TO_CALL.REVENUE);
    //         }

    //         unique = API.filter((elem, index, self) => {
    //             return index === self.indexOf(elem);
    //         });
    //         if (this.lastFinancialYear && this.history.showLastYear && this.compare.showLastYear) {
    //             this.store.dispatch(this._homeActions.getComparisionChartDataOfLastYear(
    //                 this.lastFinancialYear.financialYearStarts,
    //                 this.lastFinancialYear.financialYearEnds, true, CHART_CALLED_FROM.HISTORY, unique));
    //         }
    //     }
    // }

    public ngOnDestroy() {
        this.store.dispatch(this._homeActions.ResetHomeState());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public goToSelectPlan() {
        this._router.navigate(['pages', 'user-details'], { queryParams: { tab: 'subscriptions', tabIndex: 3, showPlans: true } });
    }
}
