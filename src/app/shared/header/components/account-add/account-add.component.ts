import { AccountRequest } from './../../../../models/api-models/Account';
import { Observable } from 'rxjs';
import { GroupResponse } from './../../../../models/api-models/Group';
import { AppState } from './../../../../store/roots';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { AccountResponse } from '../../../../models/api-models/Account';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import { uniqueNameValidator } from '../../../helpers/customValidationHelper';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { States } from '../../../../models/api-models/Company';
import { CompanyService } from '../../../../services/companyService.service';
import { Select2OptionData } from '../../../theme/select2/select2.interface';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'account-add',
  templateUrl: './account-add.component.html'
})
export class AccountAddComponent implements OnInit, OnDestroy {
  public addAccountForm: FormGroup;
  public activeGroup$: Observable<GroupResponse>;
  public activeAccount$: Observable<AccountResponse>;
  public fetchingAccUniqueName$: Observable<boolean>;
  public isAccountNameAvailable$: Observable<boolean>;
  @ViewChild('deleteAccountModal') public deleteAccountModal: ModalDirective;
  public statesSource$: Observable<Select2OptionData[]> = Observable.of([]);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
    private groupWithAccountsAction: GroupWithAccountsAction, private _companyService: CompanyService) {
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).takeUntil(this.destroyed$);
    this.isAccountNameAvailable$ = this.store.select(state => state.groupwithaccounts.isAccountNameAvailable).takeUntil(this.destroyed$);

    this._companyService.getAllStates().subscribe((data) => {
      let states: Select2OptionData[] = [];
      data.body.map(d => {
        states.push({ text: d.name, id: d.code });
      });
      this.statesSource$ = Observable.of(states);
    }, (err) => {
      console.log(err);
    });
  }

  public ngOnInit() {
    this.addAccountForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: ['', [Validators.required], uniqueNameValidator],
      openingBalanceType: ['', [Validators.required]],
      openingBalance: [0, Validators.compose([Validators.required, Validators.pattern('\\d+(\\.\\d{2})*$')])],
      mobileNo: ['', Validators.pattern('[7-9][0-9]{9}')],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      companyName: [''],
      attentionTo: [''],
      description: [''],
      address: [''],
      state: [''],
      stateCode: ['']
    });

    this.activeAccount$.subscribe(acc => {
      if (acc) {
        this.addAccountForm.patchValue(acc);
        this.statesSource$.subscribe((data) => {
          data.map(d => {
            if (d.text === acc.state) {
              this.addAccountForm.patchValue({state: d.id});
              this.stateSelected({value: d.id});
            }
          });
        });
      } else {
        this.addAccountForm.reset();
        this.addAccountForm.controls['openingBalanceType'].patchValue('CREDIT');
        this.addAccountForm.controls['openingBalance'].patchValue(0);
      }
    });
    this.fetchingAccUniqueName$.subscribe(f => {
      if (f) {
        this.addAccountForm.controls['uniqueName'].disable();
      } else {
        this.addAccountForm.controls['uniqueName'].enable();
      }
    });
  }

  public stateSelected(v) {
    this.addAccountForm.patchValue({stateCode: v.value});
  }
  public generateUniqueName() {
    let val: string = this.addAccountForm.controls['name'].value;
    val = val.replace(/[^a-zA-Z0-9]/g, '').toLocaleLowerCase();
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
    let states = await this.statesSource$.first().toPromise();

    let accountObj = new AccountRequest();
    accountObj = this.addAccountForm.value as AccountRequest;
    accountObj.state = states.find(st => st.id === this.addAccountForm.value.state).text;
    this.store.dispatch(this.accountsAction.createAccount(activeGroup.uniqueName, accountObj));
    this.addAccountForm.reset();
  }
  public async updateAccount() {
    let activeAcc = await this.activeAccount$.first().toPromise();
    let states = await this.statesSource$.first().toPromise();

    let accountObj = new AccountRequest();
    accountObj = this.addAccountForm.value as AccountRequest;
    accountObj.state = states.find(st => st.id === this.addAccountForm.value.state).text;
    this.store.dispatch(this.accountsAction.updateAccount(activeAcc.uniqueName, accountObj));
  }

  public showDeleteAccountModal() {
    this.deleteAccountModal.show();
  }

  public hideDeleteAccountModal() {
    this.deleteAccountModal.hide();
  }

  public deleteAccount() {
    let activeAccUniqueName = null;
    this.activeAccount$.take(1).subscribe(s => activeAccUniqueName = s.uniqueName);
    this.store.dispatch(this.accountsAction.deleteAccount(activeAccUniqueName));
    this.hideDeleteAccountModal();
    this.addAccountForm.reset();
  }

  public jumpToGroup(uniqueName: string) {
    this.store.dispatch(this.accountsAction.resetActiveAccount());
    this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(uniqueName));
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
