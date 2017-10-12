import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { FIXED_CATEGORY_OF_GROUPS } from '../sales.module';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { AccountRequest } from '../../models/api-models/Account';
import { AccountsAction } from '../../services/actions/accounts.actions';

@Component({
  selector: 'aside-menu-account',
  styles: [`
  :host{
    position: fixed;
    left: auto;
    top: 0;
    right: 0;
    bottom: 0;
    width: 400px;
    z-index: 1045;
  }
  `],
  templateUrl: './aside.menu.account.component.html'
})
export class AsideMenuAccountComponent implements OnInit {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  public flatAccountWGroupsList$: Observable<Select2OptionData[]>;
  public select2Options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Group',
    allowClear: true
  };
  public activeGroupUniqueName: string;
  public isGroupItemSelected: boolean = false;
  public isGstEnabledAcc: boolean = true;
  public isHsnSacEnabledAcc: boolean = true;
  public fetchingAccUniqueName$: Observable<boolean>;
  public isAccountNameAvailable$: Observable<boolean>;
  public createAccountInProcess$: Observable<boolean>;
  public createAccountIsSuccess$: Observable<boolean>;
  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private accountsAction: AccountsAction
  ) {
    // account-add component's property
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).takeUntil(this.destroyed$);
    this.isAccountNameAvailable$ = this.store.select(state => state.groupwithaccounts.isAccountNameAvailable).takeUntil(this.destroyed$);
    this.createAccountInProcess$ = this.store.select(state => state.groupwithaccounts.createAccountInProcess).takeUntil(this.destroyed$);
    this.createAccountIsSuccess$ = this.store.select(state => state.groupwithaccounts.createAccountIsSuccess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    // get groups list
    this.store.select(state => {
      return state.flyAccounts.flattenGroupsAccounts;
    }).takeUntil(this.destroyed$).subscribe(o => {
      if (o && o.length > 0) {
        let result: Select2OptionData[] = [];
        _.forEach(_.cloneDeep(o), (grp: IFlattenGroupsAccountsDetail) => {
          if (_.indexOf(FIXED_CATEGORY_OF_GROUPS, grp.groupUniqueName) === -1) {
            result.push({ text: grp.groupName, id: grp.groupUniqueName });
          }
        });
        this.flatAccountWGroupsList$ = Observable.of(result);
      }
    });
  }

  public addNewGroup(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequest }) {
    this.store.dispatch(this.accountsAction.createAccount(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
    this.closeAsidePane(event);
  }

  public groupSelected(data) {
    if (data.value) {
      this.isGroupItemSelected = true;
      this.activeGroupUniqueName = data.value;
    }else {
      this.isGroupItemSelected = false;
      this.activeGroupUniqueName = null;
    }
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }
}
