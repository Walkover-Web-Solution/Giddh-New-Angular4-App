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
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../services/actions/company.actions';

@Component({
  selector: 'home',  // <home></home>
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('liveaccount') public liveaccount: LiveAccountsComponent;
  @ViewChild('expence') public expence: ExpensesChartComponent;
  @ViewChild('revenue') public revenue: RevenueChartComponent;
  @ViewChild('compare') public compare: ComparisionChartComponent;
  @ViewChild('history') public history: HistoryChartComponent;
  @ViewChild('networth') public networth: NetworthChartComponent;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private companyActions: CompanyActions, private cdRef: ChangeDetectorRef) {
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
    this.cdRef.detectChanges();
  }
  public hardRefresh() {
    //
    this.compare.refresh = true;
    this.compare.fetchChartData();

    this.expence.refresh = true;
    this.expence.refreshData();

    this.revenue.refresh = true;
    this.revenue.refreshData();

    this.history.requestInFlight = true;
    // this.history.refresh = true;
    // this.history.fetchChartData();

    this.networth.requestInFlight = true;
    // this.networth.refresh = true;
    // this.networth.fetchChartData();

    // this.expence
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
