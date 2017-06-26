import { AccountRequest } from './../../../../models/api-models/Account';
import { Observable } from 'rxjs';
import { GroupResponse } from './../../../../models/api-models/Group';
import { GroupWithAccountsAction } from './../../../../services/actions/groupwithaccounts.actions';
import { AppState } from './../../../../store/roots';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'account-add',
  templateUrl: './account-add.component.html'
})
export class AccountAddComponent implements OnInit {
  public addAccountForm: FormGroup;
  public activeGroup$: Observable<GroupResponse>;
  constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) {
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup);
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
  }

  public async submit() {
    let activeGroup = await this.activeGroup$.first().toPromise();

    let accountObj = new AccountRequest();
    accountObj = this.addAccountForm.value as AccountRequest;
    this.store.dispatch(this.groupWithAccountsAction.createAccount(activeGroup.uniqueName, accountObj));
    this.addAccountForm.reset();
  }
}
