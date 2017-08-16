import { AccountRequest, AccountResponse } from '../../../../models/api-models/Account';
import { Observable } from 'rxjs';
import { GroupResponse } from '../../../../models/api-models/Group';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import { digitsOnly } from '../../../helpers/customValidationHelper';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CompanyService } from '../../../../services/companyService.service';
import { Select2OptionData } from '../../../theme/select2/select2.interface';
import { ModalDirective } from 'ngx-bootstrap';
import { ColumnGroupsAccountVM } from '../new-group-account-sidebar/VM';
import { uniqueNameInvalidStringReplace } from '../../../helpers/helperFunctions';

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
  @Input() public column: ColumnGroupsAccountVM[];
  public showGstList: boolean = false;
  public showDefaultGstListLength: number = 2;
  public createAccountInProcess$: Observable<boolean>;
  public createAccountIsSuccess$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
              private groupWithAccountsAction: GroupWithAccountsAction, private _companyService: CompanyService) {
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).takeUntil(this.destroyed$);
    this.isAccountNameAvailable$ = this.store.select(state => state.groupwithaccounts.isAccountNameAvailable).takeUntil(this.destroyed$);
    this.createAccountInProcess$ = this.store.select(state => state.groupwithaccounts.createAccountInProcess).takeUntil(this.destroyed$);
    this.createAccountIsSuccess$ = this.store.select(state => state.groupwithaccounts.createAccountIsSuccess).takeUntil(this.destroyed$);

    this._companyService.getAllStates().subscribe((data) => {
      let states: Select2OptionData[] = [];
      data.body.map(d => {
        states.push({text: d.name, id: d.code});
      });
      this.statesSource$ = Observable.of(states);
    }, (err) => {
      console.log(err);
    });
  }

  public ngOnInit() {
    this.addAccountForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: ['', [Validators.required]],
      openingBalanceType: ['CREDIT', [Validators.required]],
      openingBalance: [0, Validators.compose([digitsOnly])],
      mobileNo: [''],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      companyName: [''],
      attentionTo: [''],
      description: [''],
      address: [''],
      state: [''],
      stateCode: [''],
      hsnOrSac: [''],
      hsnNumber: [{value: '', disabled: false}, []],
      sacNumber: [{value: '', disabled: false}, []],
      gstDetails: this._fb.array([
        this.initialGstDetailsForm()
      ])
    });

    this.fetchingAccUniqueName$.subscribe(f => {
      if (f) {
        this.addAccountForm.controls['uniqueName'].disable();
      } else {
        this.addAccountForm.controls['uniqueName'].enable();
      }
    });

    this.addAccountForm.get('hsnOrSac').valueChanges.subscribe(a => {
      const hsn: AbstractControl = this.addAccountForm.get('hsnNumber');
      const sac: AbstractControl = this.addAccountForm.get('sacNumber');
      if (a === 'hsn') {
        // hsn.reset();
        sac.reset();
        hsn.enable();
        sac.disable();
      } else {
        // sac.reset();
        hsn.reset();
        sac.enable();
        hsn.disable();
      }
    });
    this.createAccountIsSuccess$.takeUntil(this.destroyed$).subscribe(p => {
      if (p) {
        // reset with default values
        this.addAccountForm.reset({openingBalanceType: 'CREDIT', openingBalance: 0});
      }
    });
  }

  public stateSelected(v) {
    this.addAccountForm.patchValue({stateCode: v.value});
  }

  public generateUniqueName() {
    let val: string = this.addAccountForm.controls['name'].value;
    val = uniqueNameInvalidStringReplace(val);
    if (val) {
      this.store.dispatch(this.accountsAction.getAccountUniqueName(val));

      this.isAccountNameAvailable$.subscribe(a => {
        if (a !== null && a !== undefined) {
          if (a) {
            this.addAccountForm.patchValue({uniqueName: val});
          } else {
            let num = 1;
            this.addAccountForm.patchValue({uniqueName: val + num});
          }
        }
      });
    } else {
      this.addAccountForm.patchValue({uniqueName: ''});
    }
  }

  public initialGstDetailsForm(): FormGroup {
    return this._fb.group({
      gstNumber: [''],
      addressList: this._fb.group({
        address: [''],
        stateCode: ['']
      })
    });
  }

  public addGstDetailsForm() {
    const gstDetails = this.addAccountForm.get('gstDetails') as FormArray;
    gstDetails.push(this.initialGstDetailsForm());
  }

  public removeGstDetailsForm(i: number) {
    const gstDetails = this.addAccountForm.get('gstDetails') as FormArray;
    gstDetails.removeAt(i);
  }

  public toggleGstList() {
    const gstDetails = this.addAccountForm.get('gstDetails') as FormArray;
    if (this.showGstList) {
      this.showDefaultGstListLength = 2;
      this.showGstList = false;
    } else {
      this.showDefaultGstListLength = gstDetails.length;
      this.showGstList = true;
    }
  }

  public submit() {
    let activeGroup = null;
    let states = null;

    this.activeGroup$.take(1).subscribe(p => activeGroup = p);
    this.statesSource$.take(1).subscribe(p => states = p);
    let accountObj: AccountRequest;
    let formsValue = this.addAccountForm.value;

    accountObj = formsValue as AccountRequest;
    if (formsValue.state) {
      accountObj.state = states.find(st => st.id === formsValue.state).text;
    }

    if (formsValue.hsnOrSac) {
      if (formsValue.hsnOrSac === 'hsn') {
        accountObj.hsnNumber = formsValue.hsnNumber;
      } else {
        accountObj.sacNumber = formsValue.sacNumber;
      }
      delete accountObj['hsnOrSac'];
    }

    // gst details
    // if (formsValue.gstDetails.length > 0) {
    //   let gstDetailsArr = [];
    //   let finalGstDetails = _.filter(formsValue.gstDetails, (gs: any) => {
    //     return gs.gstNumber !== '';
    //   });
    //   finalGstDetails.map(f => {
    //     gstDetailsArr.push({
    //       gstNumber: f.gstNumber,
    //       addressList: [{address: f.addressList.address, stateCode: f.addressList.stateCode}]
    //     });
    //   });
    //   accountObj.gstDetails = gstDetailsArr;
    // }
    delete accountObj['gstDetails'];
    this.store.dispatch(this.accountsAction.createAccount(activeGroup.uniqueName, accountObj));
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
