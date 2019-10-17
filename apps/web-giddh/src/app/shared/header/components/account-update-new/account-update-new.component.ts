import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountRequestV2, AccountResponseV2, IAccountAddress } from '../../../../models/api-models/Account';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { ToasterService } from '../../../../services/toaster.service';
import { CompanyService } from '../../../../services/companyService.service';
import { contriesWithCodes } from '../../../helpers/countryWithCodes';
import { digitsOnly } from '../../../helpers';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from '../../../../lodash-optimized';
import { CompanyResponse, States } from '../../../../models/api-models/Company';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';

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
  @Input() public showBankDetail: boolean = false;
  @Input() public showVirtualAccount: boolean = false;
  @Input() public isDebtorCreditor: boolean = false;
  @Input() public showDeleteButton: boolean = true;
  @Input() public accountDetails: any;

  public companiesList$: Observable<CompanyResponse[]>;
  public activeCompany: CompanyResponse;
  @Output() public submitClicked: EventEmitter<{ value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }>
    = new EventEmitter();
  @Output() public deleteClicked: EventEmitter<any> = new EventEmitter();

  @ViewChild('deleteAccountModal') public deleteAccountModal: ModalDirective;
  public showOtherDetails: boolean = false;
  public partyTypeSource: IOption[] = [
    { value: 'NOT APPLICABLE', label: 'NOT APPLICABLE' },
    { value: 'DEEMED EXPORT', label: 'DEEMED EXPORT' },
    { value: 'GOVERNMENT ENTITY', label: 'GOVERNMENT ENTITY' },
    { value: 'SEZ', label: 'SEZ' }
  ];
  public countrySource: IOption[] = [];
  public stateStream$: Observable<States[]>;
  public statesSource$: Observable<IOption[]> = observableOf([]);
  public currencySource$: Observable<IOption[]> = observableOf([]);
  public moreGstDetailsVisible: boolean = false;
  public gstDetailsLength: number = 3;
  public isMultipleCurrency: boolean = false;
  public companyCurrency: string;
  public countryPhoneCode: IOption[] = [];
  public isIndia: boolean = false;
  public companyCountry: string = '';
  public activeAccountName: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
    private _companyService: CompanyService, private _toaster: ToasterService) {
    this.companiesList$ = this.store.select(s => s.session.companies).pipe(takeUntil(this.destroyed$));
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).pipe(takeUntil(this.destroyed$));
    this.stateStream$ = this.store.select(s => s.general.states).pipe(takeUntil(this.destroyed$));
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).pipe(takeUntil(this.destroyed$));

    // bind state sources
    this.stateStream$.subscribe((data) => {
      let states: IOption[] = [];
      if (data) {
        data.map(d => {
          states.push({ label: `${d.code} - ${d.name}`, value: d.code });
        });
      }
      this.statesSource$ = observableOf(states);
    });

    this.store.select(s => s.session.currencies).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      let currencies: IOption[] = [];
      if (data) {
        data.map(d => {
          currencies.push({ label: d.code, value: d.code });
        });
      }
      this.currencySource$ = observableOf(currencies);
    });

    // bind countries
    contriesWithCodes.map(c => {
      this.countrySource.push({ value: c.countryflag, label: `${c.countryflag} - ${c.countryName}` });
    });

    // Country phone Code
    contriesWithCodes.map(c => {
      this.countryPhoneCode.push({ value: c.value, label: c.value });
    });

    this.store.select(s => s.settings.profile).pipe(distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe((profile) => {
      // this.store.dispatch(this.companyActions.RefreshCompanies());
    });
    this.store.select(p => p.session.companyUniqueName).pipe(distinctUntilChanged()).subscribe(a => {
      if (a) {
        this.companiesList$.pipe(take(1)).subscribe(companies => {
          this.activeCompany = companies.find(cmp => cmp.uniqueName === a);
        });
      }
    });

  }

  public ngOnInit() {
    this.addAccountForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: ['', [Validators.required]],
      openingBalanceType: ['CREDIT', [Validators.required]],
      foreignOpeningBalance: [0, Validators.compose([digitsOnly])],
      openingBalance: [0, Validators.compose([digitsOnly])],
      mobileCode: ['91'],
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
      hsnNumber: [{ value: '', disabled: false }],
      sacNumber: [{ value: '', disabled: false }],
      accountBankDetails: this._fb.array([
        this._fb.group({
          bankName: [''],
          bankAccountNo: [''],
          ifsc: ['']
        })
      ]),
      cashFreeVirtualAccountData: this._fb.group({
        ifscCode: [''],
        name: [''],
        virtualAccountNumber: ['']
      }),
      closingBalanceTriggerAmount: [0, Validators.compose([digitsOnly])],
      closingBalanceTriggerAmountType: ['CREDIT']
    });
    // fill form with active account
    this.activeAccount$.pipe(takeUntil(this.destroyed$)).subscribe(acc => {
      if (acc) {
        let accountDetails: AccountRequestV2 = acc as AccountRequestV2;
        // render gst details if there's no details add one automatically
        // && accountDetails.country.countryCode === 'IN' && this.activeCompany.country === 'India'
        if (accountDetails.addresses.length > 0) {
          accountDetails.addresses.map(a => {
            this.renderGstDetails(a, accountDetails.addresses.length);
          });
        } else {
          // this.addBlankGstForm();
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
        if (accountDetails.mobileNo) {
          if (accountDetails.mobileNo.length > 10 && accountDetails.mobileNo.indexOf('-') > -1) {
            let mobileArray = accountDetails.mobileNo.split('-');
            this.addAccountForm.get('mobileCode').patchValue(mobileArray[0]);
            this.addAccountForm.get('mobileNo').patchValue(mobileArray[1]);
          } else {
            this.addAccountForm.get('mobileNo').patchValue(accountDetails.mobileNo);
          }
        } else {
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
      if (a) {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        let addressFormArray = (this.addAccountForm.controls['addresses'] as FormArray);
        let lengthofFormArray = addressFormArray.controls.length;
        if (a !== 'IN') {
          this.isIndia = false;
          for (let index = 0; index < lengthofFormArray; index++) {
            addressFormArray.removeAt(index);
          }
          addresses.push(this.initialGstDetailsForm(null));
          this.isIndia = false;
        } else {
          if (addresses.controls.length === 0) {
            this.addBlankGstForm();
          }
          this.isIndia = true;
        }
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

    this.store.select(s => s.session).pipe(takeUntil(this.destroyed$)).subscribe((session) => {
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
          this.companyCountry = currentCompany.country;
        }
      }
    });
  }

  public onViewReady(ev) {
    let accountCountry = this.addAccountForm.get('country').get('countryCode').value;
    if (accountCountry) {
      if (accountCountry !== 'IN') {
        // this.addAccountForm.controls['addresses'] = this._fb.array([]);
        this.isIndia = false;
      } else {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        if (addresses.controls.length === 0) {
          this.addBlankGstForm();
        }
        this.isIndia = true;
      }
    }
  }

  public initialGstDetailsForm(val: IAccountAddress = null): FormGroup {
    let gstFields = this._fb.group({
      gstNumber: ['', Validators.compose([Validators.maxLength(15)])],
      address: ['', Validators.maxLength(120)],
      stateCode: [{ value: '', disabled: false }],
      isDefault: [false],
      isComposite: [false],
      partyType: ['NOT APPLICABLE']
    });
    if (val) {
      gstFields.patchValue(val);
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

  public renderGstDetails(val: IAccountAddress = null, addressLength: any) {
    const addresses = this.addAccountForm.get('addresses') as FormArray;
    if (addresses.length !== addressLength) {
      addresses.push(this.initialGstDetailsForm(val));
    }
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

  public getStateCode(gstForm: FormGroup, statesEle: ShSelectComponent) {
    let gstVal: string = gstForm.get('gstNumber').value;

    if (gstVal.length !== 15) {
      gstForm.get('partyType').reset('NOT APPLICABLE');
    }

    if (gstVal.length >= 2) {
      this.statesSource$.pipe(take(1)).subscribe(state => {
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

  public openingBalanceClick() {
    if (Number(this.addAccountForm.get('openingBalance').value) === 0) {
      this.addAccountForm.get('openingBalance').setValue(undefined);
    }
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

    if (this.accountDetails) {
      this.activeAccountName = this.accountDetails.uniqueName;
    } else {
      this.activeAccount$.pipe(take(1)).subscribe(a => this.activeAccountName = a.uniqueName);
    }

    if (this.isHsnSacEnabledAcc) {
      delete accountRequest['country'];
      delete accountRequest['addresses'];
      delete accountRequest['hsnOrSac'];
      delete accountRequest['mobileNo'];
      delete accountRequest['mobileCode'];
      delete accountRequest['email'];
      delete accountRequest['attentionTo'];
    } else {
      delete accountRequest['hsnOrSac'];
      delete accountRequest['hsnNumber'];
      delete accountRequest['sacNumber'];

      accountRequest.addresses = accountRequest.addresses.map(f => {
        if (!f.partyType || f.partyType === '') {
          f.partyType = 'NOT APPLICABLE';
        }
        return f;
      });

      if (accountRequest.mobileCode && accountRequest.mobileNo) {
        accountRequest.mobileNo = accountRequest.mobileCode + '-' + accountRequest.mobileNo;
        delete accountRequest['mobileCode'];
      }
    }

    if (!this.showVirtualAccount) {
      delete accountRequest['cashFreeVirtualAccountData'];
    }
    // if (this.showVirtualAccount && (!accountRequest.mobileNo || !accountRequest.email)) {
    //   this._toaster.errorToast('Mobile no. & email Id is mandatory');
    //   return;
    // }
    // if (this.showBankDetail) {
    //   if (accountRequest.accountBankDetails && accountRequest.accountBankDetails.length > 0) {
    //     if (!accountRequest['accountBankDetails'][0].bankAccountNo || !accountRequest['accountBankDetails'][0].ifsc) {
    //       accountRequest['accountBankDetails'] = [];
    //     }
    //   }
    // } else {
    if (!this.showBankDetail) {
      delete accountRequest['accountBankDetails'];
    }

    this.submitClicked.emit({
      value: { groupUniqueName: this.activeGroupUniqueName, accountUniqueName: this.activeAccountName },
      accountRequest: this.addAccountForm.value
    });
  }

  public closingBalanceTypeChanged(type: string) {
    if (Number(this.addAccountForm.get('closingBalanceTriggerAmount').value) > 0) {
      this.addAccountForm.get('closingBalanceTriggerAmountType').patchValue(type);
    }
  }

  public ngOnDestroy() {
    this.resetUpdateAccountForm();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
