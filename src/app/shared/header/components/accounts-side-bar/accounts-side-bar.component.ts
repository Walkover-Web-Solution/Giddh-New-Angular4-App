import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IFlattenGroupsAccountsDetail } from '../../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'accounts-side-bar',
  templateUrl: './accounts-side-bar.component.html',
  styleUrls: ['./accounts-side-bar.component.css']
})
export class AccountsSideBarComponent implements OnInit, OnDestroy {
  @Input() public flyAccounts: boolean;
  public flatAccountWGroupsList$: Observable<IFlattenGroupsAccountsDetail[]>;
  public companyList$: Observable<any>;
  public showAccountList: boolean = true;
  public noGroups: boolean;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>) {
    this.flatAccountWGroupsList$ = this.store.select(state => {
      return state.groupwithaccounts.flattenGroupsAccounts;
    }).takeUntil(this.destroyed$);

    this.companyList$ = this.store.select(state => {
      return state.company.companies;
    }).takeUntil(this.destroyed$);
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
