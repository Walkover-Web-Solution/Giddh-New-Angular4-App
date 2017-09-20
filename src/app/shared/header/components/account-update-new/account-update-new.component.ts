import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild } from '@angular/core';
import { ColumnGroupsAccountVM } from '../new-group-account-sidebar/VM';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { AccountRequestV2, AccountResponseV2, AccountResponse } from '../../../../models/api-models/Account';
import { Select2OptionData } from '../../../theme/select2/index';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { ToasterService } from '../../../../services/toaster.service';
import { CompanyService } from '../../../../services/companyService.service';
import { contriesWithCodes } from '../../../helpers/countryWithCodes';
import { digitsOnly } from '../../../helpers/index';
import { Select2Component } from '../../../theme/select2/select2.component';
import { GroupResponse } from '../../../../models/api-models/Group';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'account-update-new',
  templateUrl: 'account-update-new.component.html',
})
export class AccountUpdateNewComponent implements OnInit, OnDestroy {
  public addAccountForm: FormGroup;
  @Input() public activeGroupUniqueName: string;
  @Input() public fetchingAccUniqueName$: Observable<boolean>;
  @Input() public createAccountInProcess$: Observable<boolean>;
  @Input() public createAccountIsSuccess$: Observable<boolean>;
  @Input() public isGstEnabledAcc: boolean = false;
  @Input() public isHsnSacEnabledAcc: boolean = false;
  @Output() public submitClicked: EventEmitter<{ activeGroupUniqueName: string, accountRequest: AccountRequestV2 }> = new EventEmitter();

  @ViewChild('deleteAccountModal') public deleteAccountModal: ModalDirective;
  public activeGroup$: Observable<GroupResponse>;
  public activeAccount$: Observable<AccountResponse>;
  public updateAccountInProcess$: Observable<boolean>;
  public updateAccountIsSuccess$: Observable<boolean>;
  public showOtherDetails: boolean = false;
  public partyTypeSource: Select2OptionData[] = [
    { id: 'not applicable', text: 'Not Applicable' },
    { id: 'deemed export', text: 'Deemed Export' },
    { id: 'government entity', text: 'Government Entity' },
    { id: 'sez', text: 'Sez' }
  ];
  public countrySource: Select2OptionData[] = [];
  public statesSource$: Observable<Select2OptionData[]> = Observable.of([]);
  public moreGstDetailsVisible: boolean = false;
  public gstDetailsLength: number = 3;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
    private _companyService: CompanyService, private _toaster: ToasterService) {
      this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
      this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
      this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).takeUntil(this.destroyed$);
      this.updateAccountInProcess$ = this.store.select(state => state.groupwithaccounts.updateAccountInProcess).takeUntil(this.destroyed$);
      this.updateAccountIsSuccess$ = this.store.select(state => state.groupwithaccounts.updateAccountIsSuccess).takeUntil(this.destroyed$);

    this._companyService.getAllStates().subscribe((data) => {
      let states: Select2OptionData[] = [];
      data.body.map(d => {
        states.push({ text: d.name, id: d.code });
      });
      this.statesSource$ = Observable.of(states);
    }, (err) => {
      // console.log(err);
    });

    contriesWithCodes.map(c => {
      this.countrySource.push({ id: c.countryflag, text: `${c.countryflag} - ${c.countryName}` });
    });
  }

  public ngOnInit() {
    this.addAccountForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: ['', [Validators.required]],
      openingBalanceType: ['', [Validators.required]],
      openingBalance: [0, Validators.compose([digitsOnly])],
      mobileNo: [''],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      companyName: [''],
      attentionTo: [''],
      description: [''],
      addresses: this.isGstEnabledAcc ? this._fb.array([
        this.initialGstDetailsForm()
      ]) : null,
      country: this._fb.group({
        countryCode: ['']
      }),
      hsnOrSac: [''],
      hsnNumber: [{ value: '', disabled: false }],
      sacNumber: [{ value: '', disabled: false }]
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

    this.store.select(p => p.session.companyUniqueName).distinctUntilChanged().subscribe(a => {
      if (a) {
        this.addAccountForm.get('companyName').patchValue(a);
      }
    });
  }

  public initialGstDetailsForm(): FormGroup {
    let gstFields = this._fb.group({
      gstNumber: ['', Validators.compose([Validators.required, Validators.maxLength(15)])],
      address: ['', Validators.maxLength(120)],
      stateCode: [{ value: '', disabled: false }],
      isDefault: [false],
      isComposite: [false],
      partyType: ['']
    });
    return gstFields;
  }

  public addGstDetailsForm(gstForm: FormGroup) {
    if (gstForm.valid) {
      const addresses = this.addAccountForm.get('addresses') as FormArray;
      addresses.push(this.initialGstDetailsForm());
    } else {
      this._toaster.clearAllToaster();
      this._toaster.errorToast('Please fill GSTIN field first');
    }
    return;
  }
  public removeGstDetailsForm(i: number) {
    const addresses = this.addAccountForm.get('addresses') as FormArray;
    addresses.removeAt(i);
  }

  public isDefaultAddressSelected(val: boolean, i: number) {
    if (val) {
      let addresses = this.addAccountForm.get('addresses') as FormArray;
      for (let control of addresses.controls) {
        control.get('isDefault').patchValue(false);
      }
      addresses.controls[i].get('isDefault').patchValue(true);
    }
  }

  public getStateCode(gstForm: FormGroup, statesEle: Select2Component) {
    let gstVal: string = gstForm.get('gstNumber').value;
    if (gstVal.length >= 2) {
      this.statesSource$.take(1).subscribe(state => {
        let s = state.find(st => st.id === gstVal.substr(0, 2));
        statesEle.element.attr('disabled', 'true');
        if (s) {
          gstForm.get('stateCode').patchValue(s.id);
        } else {
          gstForm.get('stateCode').patchValue(null);
          this._toaster.clearAllToaster();
          this._toaster.warningToast('Invalid GSTIN.');
        }
      });
    } else {
      statesEle.element.removeAttr('disabled');
      gstForm.get('stateCode').patchValue(null);
    }
  }

  public showMoreGst() {
    const addresses = this.addAccountForm.get('addresses') as FormArray;
    this.gstDetailsLength = addresses.controls.length;
    this.moreGstDetailsVisible = true;
  }

  public openingBalanceTypeChnaged(type: string) {
    if (this.addAccountForm.get('openingBalance').value > 0) {
      this.addAccountForm.get('openingBalanceType').patchValue(type);
    }
  }
  public showLessGst() {
    this.gstDetailsLength = 3;
    this.moreGstDetailsVisible = false;
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

  public submit() {
    let accountRequest: AccountRequestV2 = this.addAccountForm.value as AccountRequestV2;

    if (this.isHsnSacEnabledAcc) {
      delete accountRequest['country'];
      delete accountRequest['addresses'];
      delete accountRequest['hsnOrSac'];
      delete accountRequest['mobileNo'];
      delete accountRequest['email'];
      delete accountRequest['attentionTo'];
    } else {
      delete accountRequest['hsnOrSac'];
      delete accountRequest['hsnNumber'];
      delete accountRequest['sacNumber'];
    }

    this.submitClicked.emit({
      activeGroupUniqueName: this.activeGroupUniqueName,
      accountRequest: this.addAccountForm.value
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
