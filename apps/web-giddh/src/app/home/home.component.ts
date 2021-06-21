import { take, takeUntil } from 'rxjs/operators';
import { RevenueChartComponent } from './components/revenue/revenue-chart.component';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { HomeActions } from '../actions/home/home.actions';
import { Router } from '@angular/router';
import { AccountService } from 'apps/web-giddh/src/app/services/account.service';
import { ProfitLossComponent } from './components/profit-loss/profile-loss.component';
import { BankAccountsComponent } from './components/bank-accounts/bank-accounts.component';
import { CrDrComponent } from './components/cr-dr-list/cr-dr-list.component';
import { GeneralService } from "../services/general.service";

@Component({
    selector: 'home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {
    public needsToRedirectToLedger$: Observable<boolean>;
    @ViewChild('revenue', { static: true }) public revenue: RevenueChartComponent;
    @ViewChild('profitloss', { static: true }) public profitloss: ProfitLossComponent;
    @ViewChild('bankaccount', { static: true }) public bankaccount: BankAccountsComponent;
    @ViewChild('crdrlist', { static: true }) public crdrlist: CrDrComponent;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public hideallcharts: boolean = false;
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private _homeActions: HomeActions,
        private _router: Router,
        private _accountService: AccountService,
        private _generalService: GeneralService
    ) {
        this.needsToRedirectToLedger$ = this.store.pipe(select(p => p.login.needsToRedirectToLedger), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.needsToRedirectToLedger$.pipe(take(1)).subscribe(result => {
            if (result) {
                this._accountService.getFlattenAccounts('', '').pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    if (data.status === 'success' && data.body.results.length > 0) {
                        this._router.navigate([`ledger/${data.body.results[0].uniqueName}`]);
                    }
                });
            }
        });
        
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
}
