import { AccountRequest } from './../../../../models/api-models/Account';
import { Observable } from 'rxjs';
import { GroupResponse } from './../../../../models/api-models/Group';
import { AppState } from './../../../../store/roots';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { AccountResponse } from '../../../../models/api-models/Account';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';

@Component({
  selector: 'account-add',
  templateUrl: './account-add.component.html'
})
export class AccountAddComponent implements OnInit {
  public addAccountForm: FormGroup;
  public activeGroup$: Observable<GroupResponse>;
  public activeAccount$: Observable<AccountResponse>;
  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
    private groupWithAccountsAction: GroupWithAccountsAction) {
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup);
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount);
  }

  public ngOnInit() {
    this.addAccountForm = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      uniqueName: ['', [Validators.required]],
      openingBalanceType: ['', [Validators.required]],
      openingBalance: ['', [Validators.required]],
      mobileNo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      companyName: ['', [Validators.required]],
      attentionTo: ['', [Validators.required]],
      description: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
    this.activeAccount$.subscribe(acc => {
      if (acc) {
        this.addAccountForm.patchValue(acc);
      } else {
        this.addAccountForm.reset();
      }
    });
  }

  public async submit() {
    let activeGroup = await this.activeGroup$.first().toPromise();

    let accountObj = new AccountRequest();
    accountObj = this.addAccountForm.value as AccountRequest;
    this.store.dispatch(this.accountsAction.createAccount(activeGroup.uniqueName, accountObj));
    this.addAccountForm.reset();
  }

  public async updateAccount() {
    let activeAcc = await this.activeAccount$.first().toPromise();
    let accountObj = new AccountRequest();
    accountObj = this.addAccountForm.value as AccountRequest;
    this.store.dispatch(this.accountsAction.updateAccount(activeAcc.uniqueName, accountObj));
  }

  public jumpToGroup(uniqueName: string) {
    this.store.dispatch(this.accountsAction.resetActiveAccount());
    this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(uniqueName));
  }
}
