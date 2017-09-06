import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IFlattenGroupsAccountsDetail } from '../../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FlyAccountsActions } from '../../../../services/actions/fly-accounts.actions';
import * as _ from 'lodash';
@Component({
  selector: 'accounts-side-bar',
  templateUrl: './accounts-side-bar.component.html',
  styleUrls: ['./accounts-side-bar.component.css']
})
export class AccountsSideBarComponent implements OnInit, OnDestroy {
  @Input() public flyAccounts: boolean;
  public flatAccountWGroupsList: IFlattenGroupsAccountsDetail[];
  public isFlyAccountInProcess$: Observable<boolean>;
  public companyList$: Observable<any>;
  public showAccountList: boolean = true;

  @Input()
  public set noGroups(val: boolean) {
    this._noGroups = val;
    this.toggleAccounts(val);
  }

  public get noGroups(): boolean {
    return this._noGroups;
  }

  private _noGroups: boolean;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _flyAccountActions: FlyAccountsActions) {
    this.store.select(state => {
      return state.flyAccounts.flattenGroupsAccounts;
    }).takeUntil(this.destroyed$).subscribe(p => {
      this.flatAccountWGroupsList = _.cloneDeep(p);
      this.toggleAccounts(this._noGroups);
      this._noGroups = true;
    });
    this.isFlyAccountInProcess$ = this.store.select(s => s.flyAccounts.isFlyAccountInProcess).takeUntil(this.destroyed$);

    this.companyList$ = this.store.select(state => {
      return state.company.companies;
    }).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.store.dispatch(this._flyAccountActions.GetflatAccountWGroups());
  }

  public toggleAccounts(noGroups: boolean) {
    this.flatAccountWGroupsList.forEach(p => {
        p.isOpen = noGroups;
      }
    );
  }

  public ngOnDestroy() {
    this.store.dispatch(this._flyAccountActions.ResetflatAccountWGroups());
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
