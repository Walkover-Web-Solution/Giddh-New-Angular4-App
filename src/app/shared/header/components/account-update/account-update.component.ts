import { AccountRequest, AccountResponseV2 } from '../../../../models/api-models/Account';
import { Observable } from 'rxjs';
import { GroupResponse } from '../../../../models/api-models/Group';
import { AppState } from '../../../../store';
import { Store } from '@ngrx/store';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { digitsOnly } from '../../../helpers';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CompanyService } from '../../../../services/companyService.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { ColumnGroupsAccountVM } from '../new-group-account-sidebar/VM';
import { IGstDetailListItem } from '../../../../models/interfaces/gstDetailListItem.interface';
import { States } from '../../../../models/api-models/Company';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';

@Component({
  selector: 'account-update',
  templateUrl: './account-update.component.html'
})
export class AccountUpdateComponent implements OnInit, OnDestroy {
  @ViewChild('deleteAccountModal') public deleteAccountModal: ModalDirective;
  @Input() public column: ColumnGroupsAccountVM[];
  @Input() public activeGroupUniqueName: string;
  @Input() public isHsnSacEnabledAcc: boolean = false;
  @Input() public isGstEnabledAcc: boolean = false;
  public showGstList: boolean = false;
  public showDefaultGstListLength: number = 2;
  public updateAccountForm: FormGroup;
  public activeGroup$: Observable<GroupResponse>;
  public activeAccount$: Observable<AccountResponseV2>;
  public fetchingAccUniqueName$: Observable<boolean>;
  public isAccountNameAvailable$: Observable<boolean>;
  public updateAccountInProcess$: Observable<boolean>;
  public updateAccountIsSuccess$: Observable<boolean>;
  public stateStream$: Observable<States[]>;
  public statesSource$: Subject<IOption[]> = new Subject<IOption[]>();
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
              private groupWithAccountsAction: GroupWithAccountsAction, private _companyService: CompanyService) {
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).takeUntil(this.destroyed$);
    this.isAccountNameAvailable$ = this.store.select(state => state.groupwithaccounts.isAccountNameAvailable).takeUntil(this.destroyed$);
    this.updateAccountInProcess$ = this.store.select(state => state.groupwithaccounts.updateAccountInProcess).takeUntil(this.destroyed$);
    this.updateAccountIsSuccess$ = this.store.select(state => state.groupwithaccounts.updateAccountIsSuccess).takeUntil(this.destroyed$);
    this.stateStream$ = this.store.select(s => s.general.states).takeUntil(this.destroyed$);
    this.stateStream$.subscribe((data) => {
      let states: IOption[] = [];
      if (data) {
        data.map(d => {
          states.push({label: d.name, value: d.code});
        });
      }
      this.statesSource$.next(states);
    }, (err) => {
      // console.log(err);
    });
  }

  public ngOnInit() {
    this.updateAccountForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: ['', [Validators.required]],
      openingBalanceType: ['', [Validators.required]],
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
      hsnNumber: [{value: '', disabled: false}, [digitsOnly]],
      sacNumber: [{value: '', disabled: false}, [digitsOnly]],
      gstDetails: this._fb.array([
        this.initialGstDetailsForm()
      ])
    });

    this.activeAccount$.subscribe(acc => {
      if (acc) {
        this.updateAccountForm.patchValue(acc);
        if (acc.hsnNumber) {
          this.updateAccountForm.get('hsnNumber').enable();
          this.updateAccountForm.get('hsnOrSac').patchValue('hsn');
        } else if (acc.sacNumber) {
          this.updateAccountForm.get('sacNumber').enable();
          this.updateAccountForm.get('hsnOrSac').patchValue('sac');
        }

        // this.statesSource$.takeUntil(this.destroyed$).delay(500).subscribe((data) => {
        //   data.map(d => {
        //     if (d.text === acc.state) {
        //       this.updateAccountForm.patchValue({state: d.id});
        //       this.stateSelected({value: d.id});
        //     }
        //   });
        // });
      }
    });
    this.fetchingAccUniqueName$.subscribe(f => {
      if (f) {
        this.updateAccountForm.controls['uniqueName'].disable();
      } else {
        this.updateAccountForm.controls['uniqueName'].enable();
      }
    });
    this.updateAccountForm.get('hsnOrSac').valueChanges.subscribe(a => {
      const hsn: AbstractControl = this.updateAccountForm.get('hsnNumber');
      const sac: AbstractControl = this.updateAccountForm.get('sacNumber');
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
  }

  public stateSelected(v) {
    this.updateAccountForm.patchValue({stateCode: v.value});
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

  public addGstDetailsForm(i?: number, item?) {
    const gstDetails = this.updateAccountForm.get('gstDetails') as FormArray;
    if (i && item) {
      let putObj: IGstDetailListItem = {gstNumber: item.gstNumber, addressList: Object.assign({})};
      if (gstDetails[i]) {
        gstDetails[i].patchValue(item);
      } else {
        gstDetails.push(this.initialGstDetailsForm());
        gstDetails[i].patchValue(item);
      }
    } else {
      gstDetails.push(this.initialGstDetailsForm());
    }
  }

  public removeGstDetailsForm(i: number) {
    const gstDetails = this.updateAccountForm.get('gstDetails') as FormArray;
    gstDetails.removeAt(i);
  }

  public toggleGstList() {
    const gstDetails = this.updateAccountForm.get('gstDetails') as FormArray;
    if (this.showGstList) {
      this.showDefaultGstListLength = 2;
      this.showGstList = false;
    } else {
      this.showDefaultGstListLength = gstDetails.length;
      this.showGstList = true;
    }
  }

  public updateAccount() {
    let activeAcc;
    let states;

    this.activeAccount$.take(1).subscribe(p => activeAcc = p);
    this.statesSource$.take(1).subscribe(p => states = p);
    let accountObj = new AccountRequest();
    accountObj = this.updateAccountForm.value as AccountRequest;
    // temporary commented out because new gst design changes
    // if (this.updateAccountForm.value.state) {
    //   accountObj.state = states.find(st => st.id === this.updateAccountForm.value.state).text;
    // }
    if (this.updateAccountForm.value.hsnOrSac) {
      if (this.updateAccountForm.value.hsnOrSac === 'hsn') {
        accountObj.hsnNumber = this.updateAccountForm.value.hsnNumber;
      } else {
        accountObj.sacNumber = this.updateAccountForm.value.sacNumber;
      }
      delete accountObj['hsnOrSac'];
    }
    delete accountObj['gstDetails'];
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
    this.updateAccountForm.reset();
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
