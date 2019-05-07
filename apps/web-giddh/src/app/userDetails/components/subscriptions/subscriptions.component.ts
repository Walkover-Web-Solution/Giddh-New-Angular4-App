import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AppState } from '../../../store/roots';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import * as moment from 'moment';

import { SubscriptionsActions } from '../../../actions/userSubscriptions/subscriptions.action';

@Component({
  selector: 'subscriptions',
  styleUrls: ['./subscriptions.component.css'],
  templateUrl: './subscriptions.component.html'
})

export class SubscriptionsComponent implements OnInit, OnDestroy {
  public subscriptions: any;
  public transactions: any;
  public companies: any;
  public companyTransactions: any;
  public moment = moment;
  public modalRef: BsModalRef;
  public subscriptionStatus = {
    true: 'Active',
    false: 'Renew'
  };

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
              private _subscriptionsActions: SubscriptionsActions,
              private modalService: BsModalService) {
    this.store.select(s =>  s.subscriptions.companies)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(s => this.companies = s);
    this.store.select(s =>  s.subscriptions.companyTransactions)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(s => this.companyTransactions = s);
  }

  public ngOnInit() {
    //
    this.getSubscriptionList();
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public getSubscriptionList() {
    this.store.dispatch(this._subscriptionsActions.SubscribedCompanies());
    this.store.select(s =>  s.subscriptions.subscriptions)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(s => {
        if (s && s.length) {
          this.subscriptions = s;
          this.store.dispatch(this._subscriptionsActions.SubscribedCompaniesList(s && s[0]));
          this.store.dispatch(this._subscriptionsActions.SubscribedUserTransactions(s && s[0]));
          this.store.select(s =>  s.subscriptions.transactions)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(s => this.transactions = s);
        }
      });
  }

  public getCompanyTransactions(companyName) {
    if (this.subscriptions && this.subscriptions.length) {
      this.store.dispatch(this._subscriptionsActions.SubscribedCompanyTransactions(this.subscriptions && this.subscriptions[0], companyName));
    }
  }

  public openModal(template: TemplateRef<any>, company, subscription) {
    this.getCompanyTransactions(company.uniqueName);
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'subscription_modal'})
    );
    let cont = {
      subscription,
      company
    }
    this.modalRef.content = cont;
  }
}
