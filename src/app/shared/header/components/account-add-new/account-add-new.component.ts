import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { digitsOnly } from '../../../helpers';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { AppState } from '../../../../store';
import { Store } from '@ngrx/store';
import { uniqueNameInvalidStringReplace } from '../../../helpers/helperFunctions';
import { Observable } from 'rxjs/Observable';
import { AccountRequestV2 } from '../../../../models/api-models/Account';
import { ReplaySubject } from 'rxjs/Rx';
import { CompanyService } from '../../../../services/companyService.service';
import { contriesWithCodes, IContriesWithCodes } from '../../../helpers/countryWithCodes';
import { ToasterService } from '../../../../services/toaster.service';
import { CompanyResponse, States } from '../../../../models/api-models/Company';
import { CompanyActions } from '../../../../actions/company.actions';
import * as _ from '../../../../lodash-optimized';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import { setTimeout } from 'timers';

@Component({
  selector: 'account-add-new',
  templateUrl: 'account-add-new.component.html',
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

    .save-btn {
      font-weight: 600;
      color: #0aa50a;
      letter-spacing: 1px;
      background-color: #dcdde4;
    }
  `]
})

export class AccountAddNewComponent implements OnInit, OnDestroy {
  public addAccountForm: FormGroup;
  @Input() public activeGroupUniqueName: string;
  @Input() public fetchingAccUniqueName$: Observable<boolean>;
  @Input() public isAccountNameAvailable$: Observable<boolean>;
  @Input() public createAccountInProcess$: Observable<boolean>;
  @Input() public createAccountIsSuccess$: Observable<boolean>;
  @Input() public isGstEnabledAcc: boolean = false;
  @Input() public isHsnSacEnabledAcc: boolean = false;
  @Output() public submitClicked: EventEmitter<{ activeGroupUniqueName: string, accountRequest: AccountRequestV2 }> = new EventEmitter();

  public showOtherDetails: boolean = false;
  public partyTypeSource: IOption[] = [
    { value: 'NOT APPLICABLE', label: 'NOT APPLICABLE' },
    { value: 'DEEMED EXPORT', label: 'DEEMED EXPORT' },
    { value: 'GOVERNMENT ENTITY', label: 'GOVERNMENT ENTITY' },
    { value: 'SEZ', label: 'SEZ' }
  ];
  public countrySource: IOption[] = [];
  public stateStream$: Observable<States[]>;
  public statesSource$: Observable<IOption[]> = Observable.of([]);
  public currencySource$: Observable<IOption[]> = Observable.of([]);
  public companiesList$: Observable<CompanyResponse[]>;
  public activeCompany: CompanyResponse;
  public moreGstDetailsVisible: boolean = false;
  public gstDetailsLength: number = 3;
  public isMultipleCurrency: boolean = false;
  public companyCurrency: string;
  public countryPhoneCode: IOption[] = [];
  public isIndia: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
    private _companyService: CompanyService, private _toaster: ToasterService, private companyActions: CompanyActions) {
    this.companiesList$ = this.store.select(s => s.session.companies).takeUntil(this.destroyed$);
    this.stateStream$ = this.store.select(s => s.general.states).takeUntil(this.destroyed$);
    this.stateStream$.subscribe((data) => {
      // console.log('state Called');
      let states: IOption[] = [];
      if (data) {
        data.map(d => {
          states.push({ label: `${d.code} - ${d.name}`, value: d.code });
        });
      }
      this.statesSource$ = Observable.of(states);
    }, (err) => {
      // console.log(err);
    });

    this.store.select(s => s.session.currencies).takeUntil(this.destroyed$).subscribe((data) => {
      let currencies: IOption[] = [];
      if (data) {
        data.map(d => {
          currencies.push({ label: d.code, value: d.code });
        });
      }
      this.currencySource$ = Observable.of(currencies);
    });

    contriesWithCodes.map(c => {
      this.countrySource.push({ value: c.countryflag, label: `${c.countryflag} - ${c.countryName}` });
    });

    // Country phone Code
    contriesWithCodes.map(c => {
      this.countryPhoneCode.push({ value: c.value, label: c.value });
    });

    this.store.select(s => s.settings.profile).takeUntil(this.destroyed$).subscribe((profile) => {
      // this.store.dispatch(this.companyActions.RefreshCompanies());
    });
  }

  public ngOnInit() {
    this.initializeNewForm();
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
          addresses.push(this.initialGstDetailsForm());
          this.isIndia = false;
        } else {
          if (addresses.controls.length === 0) {
            this.addBlankGstForm();
          }
          this.isIndia = true;
        }
      }
    });
    // get openingblance value changes
    this.addAccountForm.get('openingBalance').valueChanges.subscribe(a => {
      if (a && (a === 0 || a <= 0) && this.addAccountForm.get('openingBalanceType').value) {
        this.addAccountForm.get('openingBalanceType').patchValue('');
      } else if (a && (a === 0 || a > 0) && this.addAccountForm.get('openingBalanceType').value === '') {
        this.addAccountForm.get('openingBalanceType').patchValue('CREDIT');
      }
    });
    this.store.select(p => p.session.companyUniqueName).distinctUntilChanged().subscribe(a => {
      if (a) {
        this.companiesList$.take(1).subscribe(companies => {
          this.activeCompany = companies.find(cmp => cmp.uniqueName === a);
        });
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
          // set country
          this.setCountryByCompany(currentCompany);
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

    this.addAccountForm.get('name').valueChanges.debounceTime(100).subscribe(name => {
      let val: string = name;
      val = uniqueNameInvalidStringReplace(val);
      if (val) {
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
      } else {
        this.addAccountForm.patchValue({ uniqueName: '' });
      }
    });
  }

  public setCountryByCompany(company: CompanyResponse) {
    let result: IContriesWithCodes = contriesWithCodes.find((c) => c.countryName === company.country);
    if (result) {
      this.addAccountForm.get('country').get('countryCode').patchValue(result.countryflag);
    } else {
      this.addAccountForm.get('country').get('countryCode').patchValue('IN');
    }
  }

  public initializeNewForm() {
    this.addAccountForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: ['', [Validators.required]],
      openingBalanceType: ['CREDIT'],
      foreignOpeningBalance: [0, Validators.compose([digitsOnly])],
      openingBalance: [0, Validators.compose([digitsOnly])],
      mobileNo: [''],
      mobileCode: ['91'],
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
      sacNumber: [{ value: '', disabled: false }]
    });
  }

  public initialGstDetailsForm(): FormGroup {
    let gstFields = this._fb.group({
      gstNumber: ['', Validators.compose([Validators.maxLength(15)])],
      address: ['', Validators.maxLength(120)],
      stateCode: [{ value: '', disabled: false }],
      isDefault: [false],
      isComposite: [false],
      partyType: ['NOT APPLICABLE']
    });
    return gstFields;
  }

  // public generateUniqueName() {
  //   alert('changed');
  //   let val: string = this.addAccountForm.controls['name'].value;
  //   val = uniqueNameInvalidStringReplace(val);
  //   if (val) {
  //     this.store.dispatch(this.accountsAction.getAccountUniqueName(val));
  //     this.isAccountNameAvailable$.subscribe(a => {
  //       if (a !== null && a !== undefined) {
  //         if (a) {
  //           this.addAccountForm.patchValue({ uniqueName: val });
  //         } else {
  //           let num = 1;
  //           this.addAccountForm.patchValue({ uniqueName: val + num });
  //         }
  //       }
  //     });
  //   } else {
  //     this.addAccountForm.patchValue({ uniqueName: '' });
  //   }
  //   // if (val.match(/[\\/(){};:"<>#?%, ]/g)) {
  //   //   this._toaster.clearAllToaster();
  //   //   this._toaster.errorToast('Account name must not contain special symbol like [\/(){};:"<>#?%');
  //   // } else {
  //   // }
  // }

  public addGstDetailsForm(value: string) {
    if (value && !value.startsWith(' ', 0)) {
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

  public addBlankGstForm() {
    const addresses = this.addAccountForm.get('addresses') as FormArray;
    if (addresses.value.length === 0) {
      addresses.push(this.initialGstDetailsForm());
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
      this.statesSource$.take(1).subscribe(state => {
        let s = state.find(st => st.value === gstVal.substr(0, 2));
        statesEle.setDisabledState(false);
        // gstForm.get('stateCode').disable();
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
    if (Number(this.addAccountForm.get('openingBalance').value) > 0) {
      this.addAccountForm.get('openingBalanceType').patchValue(type);
    }
  }

  public showLessGst() {
    this.gstDetailsLength = 3;
    this.moreGstDetailsVisible = false;
  }

  public resetAddAccountForm() {
    this.addAccountForm.reset();
    // const addresses = this.addAccountForm.get('addresses') as FormArray;
    // const countries = this.addAccountForm.get('country') as FormGroup;
    // addresses.controls.map((a, index) => {
    //   a.reset();
    //   addresses.removeAt(index);
    // });
    // // countries.reset();
    // this.addAccountForm.reset();
    // // this.addBlankGstForm();
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

      if (accountRequest.mobileCode && accountRequest.mobileNo) {
        accountRequest.mobileNo = accountRequest.mobileCode + '-' + accountRequest.mobileNo;
        delete accountRequest['mobileCode'];
      }
    }

    this.submitClicked.emit({
      activeGroupUniqueName: this.activeGroupUniqueName,
      accountRequest: this.addAccountForm.value
    });
  }

  public ngOnDestroy() {
    this.resetAddAccountForm();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
