import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountRequestV2, AccountResponseV2, IAccountAddress } from '../../../../models/api-models/Account';
import {select, Store} from '@ngrx/store';
import { AppState } from '../../../../store';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { ToasterService } from '../../../../services/toaster.service';
import { CompanyService } from '../../../../services/companyService.service';
import { contriesWithCodes } from '../../../helpers/countryWithCodes';
import { digitsOnly } from '../../../helpers';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from '../../../../lodash-optimized';
import {CompanyResponse, States, StatesRequest} from '../../../../models/api-models/Company';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import {IForceClear} from "../../../../models/api-models/Sales";
import { CommonActions } from '../../../../actions/common.actions';
import {GeneralActions} from "../../../../actions/general/general.actions";
import {CompanyActions} from "../../../../actions/company.actions";
import {CountryRequest} from "../../../../models/api-models/Common";

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
   .horizontal-form .mobileCode .error-msg {
    position: absolute;
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
  @ViewChild('autoFocusUpdate') public autoFocusUpdate: ElementRef;


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

  public states: any[] = [];
  public statesSource$: Observable<IOption[]> = observableOf([]);
  public moreGstDetailsVisible: boolean = false;
  public gstDetailsLength: number = 3;
  public isMultipleCurrency: boolean = false;
  public companyCurrency: string;
  public isIndia: boolean = false;
  public companyCountry: string = '';
  public activeAccountName: string = '';
  public forceClear$: Observable<IForceClear> = observableOf({status: false});
  public countrySource: IOption[] = [];
  public countrySource$: Observable<IOption[]> = observableOf([]);
  public currencies: IOption[] = [];
  public currencySource$: Observable<IOption[]> = observableOf([]);
  public countryCurrency: any[] = [];
  public countryPhoneCode: IOption[] = [];
  public callingCodesSource$: Observable<IOption[]> = observableOf([]);
  public stateGstCode: any[] = [];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
    private _companyService: CompanyService, private _toaster: ToasterService, private commonActions: CommonActions, private _generalActions: GeneralActions) {
    this.companiesList$ = this.store.select(s => s.session.companies).pipe(takeUntil(this.destroyed$));
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).pipe(takeUntil(this.destroyed$));

    this.getCountry();
    this.getCurrency();
    this.getCallingCodes();

    this.store.select(p => p.session.companyUniqueName).pipe(distinctUntilChanged()).subscribe(a => {
      if (a) {
        this.companiesList$.pipe(take(1)).subscribe(companies => {
          this.activeCompany = companies.find(cmp => cmp.uniqueName === a);
          if(this.activeCompany.countryV2 !== undefined && this.activeCompany.countryV2 !== null) {
            this.getStates(this.activeCompany.countryV2.alpha2CountryCode);
          }
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
      mobileCode: [''],
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
        if (accountDetails.addresses.length > 0) {
          accountDetails.addresses.map(a => {
            this.renderGstDetails(a, accountDetails.addresses.length);
          });
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
        sac.reset();
        hsn.enable();
        sac.disable();
      } else {
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

        this.resetGstStateForm();

        if (a !== 'IN') {
          this.isIndia = false;

          Object.keys(addressFormArray.controls).forEach((key) => {
            if(parseInt(key) > 0) {
              addressFormArray.removeAt(1); // removing index 1 only because as soon as we remove any index, it automatically updates index
            }
          });
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
          this.companyCountry = currentCompany.countryV2.alpha2CountryCode;
        }
      }
    });
    setTimeout(() => {
      this.autoFocusUpdate.nativeElement.focus();
    }, 50);
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
    if (addresses.length < addressLength) {
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
        let stateCode = this.stateGstCode[gstVal.substr(0, 2)];

        let s = state.find(st => st.value === stateCode);
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
  public selectCountry(event: IOption) {
    if (event) {
      let phoneCode = event.additional;
      this.addAccountForm.get('mobileCode').patchValue(phoneCode);
      this.getStates(event.value);
    }
  }

  public resetGstStateForm() {
    this.forceClear$ = observableOf({status: true});

    let addresses = this.addAccountForm.get('addresses') as FormArray;
    for (let control of addresses.controls) {
      control.get('stateCode').patchValue(null);
      control.get('gstNumber').setValue("");
    }
  }

  public getCountry() {
    this.store.pipe(select(s => s.common.countries), takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        Object.keys(res).forEach(key => {
          this.countrySource.push({value: res[key].alpha2CountryCode, label: res[key].alpha2CountryCode + ' - ' + res[key].countryName, additional: res[key].callingCode});
          // Creating Country Currency List
          if(res[key].currency !== undefined && res[key].currency !== null) {
            this.countryCurrency[res[key].countryName] = [];
            this.countryCurrency[res[key].countryName] = res[key].currency.code;
          }
        });
        this.countrySource$ = observableOf(this.countrySource);
      } else {
        let countryRequest = new CountryRequest();
        countryRequest.formName = '';
        this.store.dispatch(this.commonActions.GetCountry(countryRequest));
      }
    });
  }

  public getCurrency() {
    this.store.pipe(select(s => s.common.currencies), takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        Object.keys(res).forEach(key => {
          this.currencies.push({ label: res[key].code, value: res[key].code });
        });
        this.currencySource$ = observableOf(this.currencies);
      } else {
        this.store.dispatch(this.commonActions.GetCurrency());
      }
    });
  }

  public getCallingCodes() {
    this.store.pipe(select(s => s.common.callingcodes), takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        Object.keys(res.callingCodes).forEach(key => {
          this.countryPhoneCode.push({ label: res.callingCodes[key], value: res.callingCodes[key] });
        });
        this.callingCodesSource$ = observableOf(this.countryPhoneCode);
      } else {
        this.store.dispatch(this.commonActions.GetCallingCodes());
      }
    });
  }

  public getStates(countryCode) {
    this.store.dispatch(this._generalActions.resetStatesList());
    this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        Object.keys(res.stateList).forEach(key => {

          if(res.stateList[key].stateGstCode !== null) {
            this.stateGstCode[res.stateList[key].stateGstCode] = [];
            this.stateGstCode[res.stateList[key].stateGstCode] = res.stateList[key].code;
          }

          this.states.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].code });
        });
        this.statesSource$ = observableOf(this.states);
      } else {
        let statesRequest = new StatesRequest();
        statesRequest.country = countryCode;
        this.store.dispatch(this._generalActions.getAllState(statesRequest));
      }
    });
  }
}
