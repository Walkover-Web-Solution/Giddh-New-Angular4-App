import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { AccountRequestV2, AccountResponseV2, IAccountAddress } from '../../../../models/api-models/Account';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { ToasterService } from '../../../../services/toaster.service';
import { CompanyService } from '../../../../services/companyService.service';
import { contriesWithCodes } from '../../../helpers/countryWithCodes';
import { digitsOnly } from '../../../helpers/index';
import { SelectComponent } from '../../../../theme/ng-select/select.component';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from '../../../../lodash-optimized';
import { CompanyActions } from '../../../../services/actions/company.actions';

@Component({
  selector: 'account-update-new',
  templateUrl: 'account-update-new.component.html',
  styles: [`
    .hsn-sac {
      left: 51px;
      position: relative;
    }

    .hsn-sac-radio {
      top: 34px;
      position: relative;
      left: -10px;
    }

    .hsn-sac-w-m-input {
      width: 144px;
      margin-left: 50px;
    }

    .hsn-sac-group {
      position: relative;
      top: -75px;
      left: 197px;
    }

    .upd-btn {
      font-weight: 600;
      color: #0aa50a;
      letter-spacing: 1px;
      background-color: #dcdde4;
    }

    .del-btn {
      font-weight: 600;
      color: red;
      letter-spacing: 1px;
      background-color: #dcdde4;
    }
  `]
})
export class AccountUpdateNewComponent implements OnInit, OnDestroy {
  public addAccountForm: FormGroup;
  @Input() public activeGroupUniqueName: string;
  @Input() public fetchingAccUniqueName$: Observable<boolean>;
  @Input() public createAccountInProcess$: Observable<boolean>;
  @Input() public createAccountIsSuccess$: Observable<boolean>;
  @Input() public isGstEnabledAcc: boolean = false;
  @Input() public activeAccount$: Observable<AccountResponseV2>;
  @Input() public isHsnSacEnabledAcc: boolean = false;
  @Input() public updateAccountInProcess$: Observable<boolean>;
  @Input() public updateAccountIsSuccess$: Observable<boolean>;
  @Output() public submitClicked: EventEmitter<{ value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }>
    = new EventEmitter();
  @Output() public deleteClicked: EventEmitter<any> = new EventEmitter();

  @ViewChild('deleteAccountModal') public deleteAccountModal: ModalDirective;
  public showOtherDetails: boolean = false;
  public partyTypeSource: IOption[] = [
    {value: 'NOT APPLICABLE', label: 'NOT APPLICABLE'},
    {value: 'DEEMED EXPORT', label: 'DEEMED EXPORT'},
    {value: 'GOVERNMENT ENTITY', label: 'GOVERNMENT ENTITY'},
    {value: 'SEZ', label: 'SEZ'}
  ];
  public countrySource: IOption[] = [];
  public statesSource$: Observable<IOption[]> = Observable.of([]);
  public moreGstDetailsVisible: boolean = false;
  public gstDetailsLength: number = 3;
  public isMultipleCurrency: boolean = false;
  public companyCurrency: string;
  public countryPhoneCode: IOption[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
              private _companyService: CompanyService, private _toaster: ToasterService, private companyActions: CompanyActions) {
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).takeUntil(this.destroyed$);

    // bind state sources
    this._companyService.getAllStates().subscribe((data) => {
      let states: IOption[] = [];
      if (data) {
        data.body.map(d => {
          states.push({label: `${d.code} - ${d.name}`, value: d.code});
        });
      }
      this.statesSource$ = Observable.of(states);
    });
    // bind countries
    contriesWithCodes.map(c => {
      this.countrySource.push({value: c.countryflag, label: `${c.countryflag} - ${c.countryName}`});
    });

    // Country phone Code
    contriesWithCodes.map(c => {
      this.countryPhoneCode.push({value: c.value, label: c.value});
    });

    this.store.select(s => s.settings.profile).distinctUntilChanged().takeUntil(this.destroyed$).subscribe((profile) => {
      this.store.dispatch(this.companyActions.RefreshCompanies());
    });

  }

  public ngOnInit() {
    this.addAccountForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: ['', [Validators.required]],
      openingBalanceType: ['CREDIT', [Validators.required]],
      foreignOpeningBalance: [0, Validators.compose([digitsOnly])],
      openingBalance: [0, Validators.compose([digitsOnly])],
      // MobileCode: [''],
      mobileNo: [''],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      companyName: [''],
      attentionTo: [''],
      description: [''],
      addresses: this._fb.array([]),
      country: this._fb.group({
        countryCode: ['']
      }),
      hsnOrSac: [''],
      currency: [''],
      hsnNumber: [{value: '', disabled: false}],
      sacNumber: [{value: '', disabled: false}]
    });
    // fill form with active account
    this.activeAccount$.subscribe(acc => {
      if (acc) {
        let accountDetails: AccountRequestV2 = acc as AccountRequestV2;
        // render gst details if there's no details add one automatically
        if (accountDetails.addresses.length > 0) {
          accountDetails.addresses.map(a => {
            this.renderGstDetails(a);
          });
        } else {
          this.addBlankGstForm();
        }
        // hsn/sac enable disable
        if (acc.hsnNumber) {
          this.addAccountForm.get('sacNumber').disable();
          this.addAccountForm.get('hsnNumber').enable();
          this.addAccountForm.get('hsnOrSac').patchValue('hsn');
        } else if (acc.sacNumber) {
          this.addAccountForm.get('hsnNumber').disable();
          this.addAccountForm.get('sacNumber').enable();
          this.addAccountForm.get('hsnOrSac').patchValue('sac');
        }
        this.openingBalanceTypeChnaged(accountDetails.openingBalanceType);
        this.addAccountForm.patchValue(accountDetails);
        if (!accountDetails.mobileNo) {
          this.addAccountForm.get('mobileNo').patchValue('');
        }
      }
    });
    // get hsn and sac value changes
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
    // get country code value change
    this.addAccountForm.get('country').get('countryCode').valueChanges.subscribe(a => {
      if (a !== 'IN') {
        this.addAccountForm.controls['addresses'] = this._fb.array([]);
      } else {
        this.addBlankGstForm();
      }
    });

    // get active company
    // this.store.select(p => p.session.companyUniqueName).distinctUntilChanged().subscribe(a => {
    //   if (a) {
    //     this.addAccountForm.get('companyName').patchValue(a);
    //   }
    // });
    // get openingblance value changes
    this.addAccountForm.get('openingBalance').valueChanges.subscribe(a => {
      if (a && (a === 0 || a <= 0) && this.addAccountForm.get('openingBalanceType').value) {
        this.addAccountForm.get('openingBalanceType').patchValue('CREDIT');
      } else if (a && (a === 0 || a > 0) && this.addAccountForm.get('openingBalanceType').value === '') {
        this.addAccountForm.get('openingBalanceType').patchValue('CREDIT');
      }
    });

    this.store.select(s => s.session).takeUntil(this.destroyed$).subscribe((session) => {
      let companyUniqueName: string;
      if (session.companyUniqueName) {
        companyUniqueName = _.cloneDeep(session.companyUniqueName);
      }
      if (session.companies && session.companies.length) {
        let companies = _.cloneDeep(session.companies);
        let currentCompany = companies.find((company) => company.uniqueName === companyUniqueName);
        if (currentCompany) {
          this.companyCurrency = _.clone(currentCompany.baseCurrency);
          this.isMultipleCurrency = _.clone(currentCompany.isMultipleCurrency);
          if (this.isMultipleCurrency) {
            this.addAccountForm.get('currency').enable();
          } else {
            this.addAccountForm.get('currency').disable();
          }
        }
      }
    });
  }

  public initialGstDetailsForm(val: IAccountAddress = null): FormGroup {
    let gstFields = this._fb.group({
      gstNumber: ['', Validators.compose([Validators.maxLength(15)])],
      address: ['', Validators.maxLength(120)],
      stateCode: [{value: '', disabled: false}],
      isDefault: [false],
      isComposite: [false],
      partyType: ['NOT APPLICABLE']
    });
    if (val) {
      setTimeout(() => {
        gstFields.patchValue(val);
      }, 300);
      if (val.gstNumber) {
        // gstFields.get('stateCode').disable();
      }
    }
    return gstFields;
  }

  public addGstDetailsForm(value: string) {
    if (value && !value.startsWith(' ', 0)) {
      const addresses = this.addAccountForm.get('addresses') as FormArray;
      addresses.push(this.initialGstDetailsForm(null));
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

  public addBlankGstForm() {
    const addresses = this.addAccountForm.get('addresses') as FormArray;
    addresses.push(this.initialGstDetailsForm(null));
  }

  public renderGstDetails(val: IAccountAddress = null) {
    const addresses = this.addAccountForm.get('addresses') as FormArray;
    addresses.push(this.initialGstDetailsForm(val));
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

  public getStateCode(gstForm: FormGroup, statesEle: SelectComponent) {
    let gstVal: string = gstForm.get('gstNumber').value;
    if (gstVal.length >= 2) {
      this.statesSource$.take(1).subscribe(state => {
        let s = state.find(st => st.value === gstVal.substr(0, 2));
        statesEle.setDisabledState(false);
        // statesEle.disabled = true;
        if (s) {
          gstForm.get('stateCode').patchValue(s.value);
          statesEle.setDisabledState(true);
        } else {
          gstForm.get('stateCode').patchValue(null);
          statesEle.setDisabledState(false);
          this._toaster.clearAllToaster();
          this._toaster.warningToast('Invalid GSTIN.');
        }
      });
    } else {
      statesEle.setDisabledState(false);
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

  public resetUpdateAccountForm() {
    const addresses = this.addAccountForm.get('addresses') as FormArray;
    const countries = this.addAccountForm.get('country') as FormGroup;
    addresses.reset();
    countries.reset();
    this.addAccountForm.reset();
    this.addBlankGstForm();
  }

  public submit() {
    let accountRequest: AccountRequestV2 = this.addAccountForm.value as AccountRequestV2;
    let activeAccountName: string;
    this.activeAccount$.take(1).subscribe(a => activeAccountName = a.uniqueName);
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
      value: {groupUniqueName: this.activeGroupUniqueName, accountUniqueName: activeAccountName},
      accountRequest: this.addAccountForm.value
    });
  }

  public ngOnDestroy() {
    this.resetUpdateAccountForm();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
