import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TallyActions } from '../actions/tally/tally.action';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { SubscriptionsActions } from '../actions/userSubscriptions/subscriptions.action';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  templateUrl: './tally.component.html'
})

export class TallyComponent implements OnInit, OnDestroy {
  public subscriptions: any;
  public tallyLogs: any;
  public oldTallyLogs: any;
  public company: any;
  public moment = moment;
  public selectedDate: string;
  public selectedCompanyName: string;
  public selectedTime: string;
  public showDatePicker: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>,
              private _subscriptionAction: SubscriptionsActions,
              private _tallyActions: TallyActions) {
    this.store.select(s =>  s.tallyLogs.tallyLogs)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(s => this.tallyLogs = s);
    this.store.select(s =>  s.tallyLogs.oldTallyLogs)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(s => this.oldTallyLogs = s);
  }
  public ngOnInit() {
    //
    let that = this;
    this.store.dispatch(this._subscriptionAction.SubscribedCompanies());
    this.store.select(s =>  s.subscriptions.subscriptions)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(s => {
        if (s && s.length) {
          this.company = s && s[0] && s[0].companies && s[0].companies[0];
          that.getCurrentTallyLogs(this.company.uniqueName);
          that.getOldTallyLogs(this.company.uniqueName);
        }
      });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public getCurrentTallyLogs(companyUniqueName)  {
    //
    this.store.dispatch(this._tallyActions.GetCurrentTallyLogs(companyUniqueName));
  }

  public getOldTallyLogs(companyUniqueName)  {
    //
    let from = moment(new Date()).subtract('10', 'day').format('DD-MM-YYYY');
    let to = moment(new Date()).subtract('1', 'day').format('DD-MM-YYYY');
    this.store.dispatch(this._tallyActions.GetOldTallyLogs(companyUniqueName, from, to));
  }

  public downloadFile(fileName) {
    this.store.dispatch(this._tallyActions.DownloadFile(fileName, this.company.uniqueName));
  }

  public searchGo() {
    let from = moment(this.selectedDate).format('DD-MM-YYYY');
    let to = moment(this.selectedDate).format('DD-MM-YYYY');
    this.store.dispatch(this._tallyActions.GetOldTallyLogs(this.selectedCompanyName, from, to));
  }
  public setDate(date) {
    this.selectedDate = _.cloneDeep(moment(date).format('DD-MM-YYYY'));
    this.showDatePicker = !this.showDatePicker;
  }

}
