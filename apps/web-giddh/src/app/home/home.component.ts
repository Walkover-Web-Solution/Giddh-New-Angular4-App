import { take, takeUntil } from 'rxjs/operators';
import { ComparisionChartComponent } from './components/comparision/comparision-chart.component';
import { NetworthChartComponent } from './components/networth/networth-chart.component';
import { HistoryChartComponent } from './components/history/history-chart.component';
import { RevenueChartComponent } from './components/revenue/revenue-chart.component';
import { ExpensesChartComponent } from './components/expenses/expenses-chart.component';
import { LiveAccountsComponent } from './components/live-accounts/live-accounts.component';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { IComparisionChartResponse, IExpensesChartClosingBalanceResponse, IRevenueChartClosingBalanceResponse } from '../models/interfaces/dashboard.interface';
import * as _ from '../lodash-optimized';
import { HomeActions } from '../actions/home/home.actions';
import { Router } from '@angular/router';
import { AccountService } from 'apps/web-giddh/src/app/services/account.service';
import { ProfitLossComponent } from './components/profit-loss/profile-loss.component';
import { gstComponent } from './components/gst/gst.component';
import { BankAccountsComponent } from './components/bank-accounts/bank-accounts.component';
import { CrDrComponent } from './components/cr-dr-list/cr-dr-list.component';
import { TotalSalesComponent } from './components/total-sales/total-sales.component';
import { SubscriptionsUser } from "../models/api-models/Subscriptions";
import { GeneralService } from "../services/general.service";

@Component({
    selector: 'home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {
    public needsToRedirectToLedger$: Observable<boolean>;
    public revenueChartData$: Observable<IRevenueChartClosingBalanceResponse>;
    public networthComparisionChartData$: Observable<IComparisionChartResponse>;
    public historyComparisionChartData$: Observable<IComparisionChartResponse>;
    public expensesChartData$: Observable<IExpensesChartClosingBalanceResponse>;
    public comparisionChartData$: Observable<IComparisionChartResponse>;
    @ViewChild('liveaccount', {static: true}) public liveaccount: LiveAccountsComponent;
    @ViewChild('expence', {static: true}) public expence: ExpensesChartComponent;
    @ViewChild('revenue', {static: true}) public revenue: RevenueChartComponent;
    @ViewChild('compare', {static: true}) public compare: ComparisionChartComponent;
    @ViewChild('history', {static: true}) public history: HistoryChartComponent;
    @ViewChild('networth', {static: true}) public networth: NetworthChartComponent;
    @ViewChild('profitloss', {static: true}) public profitloss: ProfitLossComponent;
    @ViewChild('gst', {static: true}) public gst: gstComponent;
    @ViewChild('bankaccount', {static: true}) public bankaccount: BankAccountsComponent;
    @ViewChild('crdrlist', {static: true}) public crdrlist: CrDrComponent;
    @ViewChild('totalSales', {static: true}) public totalSales: TotalSalesComponent;

    public subscribedPlan: SubscriptionsUser;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public hideallcharts: boolean = false;

    constructor(
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private _homeActions: HomeActions,
        private _router: Router,
        private _accountService: AccountService,
        private _generalService: GeneralService
    ) {
        this.comparisionChartData$ = this.store.pipe(select(p => p.home.comparisionChart), takeUntil(this.destroyed$));
        this.expensesChartData$ = this.store.pipe(select(p => p.home.expensesChart), takeUntil(this.destroyed$));
        this.historyComparisionChartData$ = this.store.pipe(select(p => p.home.history_comparisionChart), takeUntil(this.destroyed$));
        this.networthComparisionChartData$ = this.store.pipe(select(p => p.home.networth_comparisionChart), takeUntil(this.destroyed$));
        this.revenueChartData$ = this.store.pipe(select(p => p.home.revenueChart), takeUntil(this.destroyed$));
        this.needsToRedirectToLedger$ = this.store.pipe(select(p => p.login.needsToRedirectToLedger), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if(activeCompany) {
                if (activeCompany.subscription) {
                    this.store.dispatch(this.companyActions.setCurrentCompanySubscriptionPlan(activeCompany.subscription));
                    this.subscribedPlan = activeCompany.subscription;
                }

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
    }

    public ngOnInit() {
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'home';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

        this._generalService.invokeEvent.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            if (value === 'hideallcharts') {
                this.hideallcharts = true;
            }
            if (value === 'showallcharts') {
                this.hideallcharts = false;
            }
        });
    }

    public ngOnDestroy() {
        this.store.dispatch(this._homeActions.ResetHomeState());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public goToSelectPlan() {
        this._router.navigate(['pages', 'user-details'], { queryParams: { tab: 'subscriptions', tabIndex: 3, showPlans: true } });
    }
}
