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
  public fetchingUniqueName$: Observable<boolean>;
  public isAccountNameAvailable$: Observable<boolean>;
  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
    private groupWithAccountsAction: GroupWithAccountsAction) {
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup);
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount);
    this.fetchingUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingUniqueName);
    this.isAccountNameAvailable$ = this.store.select(state => state.groupwithaccounts.isAccountNameAvailable);
  }

  public ngOnInit() {
    this.addAccountForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: ['', [Validators.required]],
      openingBalanceType: ['CREDIT', [Validators.required]],
      openingBalance: [0, Validators.compose([Validators.required, Validators.pattern('\\d+(\\.\\d{2})*$')])],
      mobileNo: [''],
      email: [''],
      companyName: [''],
      attentionTo: [''],
      description: [''],
      address: ['']
    });
    this.activeAccount$.subscribe(acc => {
      if (acc) {
        this.addAccountForm.patchValue(acc);
      } else {
        this.addAccountForm.reset();
        this.addAccountForm.controls['openingBalanceType'].patchValue('CREDIT');
        this.addAccountForm.controls['openingBalance'].patchValue(0);
      }
    });
  }

  public generateUniqueName() {
    let val: string = this.addAccountForm.controls['name'].value;
    val = val.replace(/ |,|\//g, '').toLocaleLowerCase();
    this.store.dispatch(this.accountsAction.getAccountUniqueName(val));

    this.isAccountNameAvailable$.subscribe(a => {
      if (a !== null && a !== undefined) {
        if (a) {
          this.addAccountForm.patchValue({ uniqueName: val });
        } else {
          let num = 1;
          this.addAccountForm.patchValue({ uniqueName: val + num });
        }
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
