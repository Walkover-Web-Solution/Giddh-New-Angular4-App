import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AccountResponse, AccountSharedWithResponse, ShareAccountRequest } from '../../../../models/api-models/Account';
import { AccountsAction } from '../../../../services/actions/accounts.actions';

@Component({
  selector: 'share-account-modal',
  templateUrl: './share-account-modal.component.html'
})

export class ShareAccountModalComponent implements OnInit, OnDestroy {
  public email: string;
  public activeAccount$: Observable<AccountResponse>;
  public activeAccountSharedWith$: Observable<AccountSharedWithResponse[]>;
  @Output() public closeShareAccountModal: EventEmitter<any> = new EventEmitter();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private accountActions: AccountsAction) {
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
    this.activeAccountSharedWith$ = this.store.select(state => state.groupwithaccounts.activeAccountSharedWith).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    //
  }

  public async shareAccount() {
    let activeAccount = await this.activeAccount$.first().toPromise();

    let accObject = new ShareAccountRequest();
    accObject.role = 'view_only';
    accObject.user = this.email;
    this.store.dispatch(this.accountActions.shareAccount(accObject, activeAccount.uniqueName));
    this.email = '';
  }

  public async unShareAccount(val) {
    let activeAccount = await this.activeAccount$.first().toPromise();

    this.store.dispatch(this.accountActions.unShareAccount(val, activeAccount.uniqueName));
  }

  public closeModal() {
    this.email = '';
    this.closeShareAccountModal.emit();
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
