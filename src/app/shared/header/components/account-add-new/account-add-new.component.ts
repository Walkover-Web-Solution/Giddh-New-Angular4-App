import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { digitsOnly } from '../../../helpers/customValidationHelper';
import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { uniqueNameInvalidStringReplace } from '../../../helpers/helperFunctions';
import { Observable } from 'rxjs/Observable';
import { AccountRequestV2 } from '../../../../models/api-models/Account';
import { ReplaySubject } from 'rxjs/Rx';
import { Select2OptionData } from '../../../theme/select2/index';
import { CompanyService } from '../../../../services/companyService.service';
import { contriesWithCodes } from '../../../helpers/countryWithCodes';
import { ToasterService } from '../../../../services/toaster.service';
import { Select2Component } from '../../../theme/select2/select2.component';
import { ComapnyResponse } from '../../../../models/api-models/Company';
import { SelectComponent } from '../../../theme/ng-select/select.component';
import { IOption } from '../../../theme/ng-select/option.interface';

@Component({
  selector: 'account-add-new',
  templateUrl: 'account-add-new.component.html',
  styles: [`
  .hsn-sac{
    left: 51px;
      position: relative;
  }
  .hsn-sac-radio{
    top: 34px;
      position: relative;
      left: -10px;
  }
  .hsn-sac-w-m-input{
    width: 144px;
      margin-left: 50px;
  }
  .hsn-sac-group{
    position: relative;
      top: -75px;
      left: 197px;
  }
  .save-btn{
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
  public statesSource$: Observable<IOption[]> = Observable.of([]);
  public companiesList$: Observable<ComapnyResponse[]>;
  public activeCompany: ComapnyResponse;
  public moreGstDetailsVisible: boolean = false;
  public gstDetailsLength: number = 3;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
    private _companyService: CompanyService, private _toaster: ToasterService) {
    this.companiesList$ = this.store.select(s => s.session.companies).takeUntil(this.destroyed$);
    this._companyService.getAllStates().subscribe((data) => {
      let states: IOption[] = [];
      data.body.map(d => {
        states.push({ label: `${d.code} - ${d.name}`, value: d.code });
      });
      this.statesSource$ = Observable.of(states);
    }, (err) => {
      // console.log(err);
    });

    contriesWithCodes.map(c => {
      this.countrySource.push({ value: c.countryflag, label: `${c.countryflag} - ${c.countryName}` });
    });
  }

  public ngOnInit() {
    this.addAccountForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: ['', [Validators.required]],
      openingBalanceType: ['CREDIT'],
      openingBalance: [0, Validators.compose([digitsOnly])],
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
    // get country code value change
    this.addAccountForm.get('country').get('countryCode').valueChanges.subscribe(a => {
      if (a !== 'IN') {
        this.addAccountForm.controls['addresses'] = this._fb.array([]);
      } else {
        this.addBlankGstForm();
      }
    });
    // get openingblance value changes
    this.addAccountForm.get('openingBalance').valueChanges.subscribe(a => {
      if (a === 0 || a < 0) {
        this.addAccountForm.get('openingBalanceType').patchValue('');
      }
    });
    this.store.select(p => p.session.companyUniqueName).distinctUntilChanged().subscribe(a => {
      if (a) {
        this.companiesList$.take(1).subscribe(companies => {
          this.activeCompany = companies.find(cmp => cmp.uniqueName === a);
        });
        this.addAccountForm.get('companyName').patchValue(a);
      }
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

  public generateUniqueName() {
    let val: string = this.addAccountForm.controls['name'].value;
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
  }

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
    addresses.push(this.initialGstDetailsForm());
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
        statesEle.disabled = true;
        if (s) {
          gstForm.get('stateCode').patchValue(s.value);
        } else {
          gstForm.get('stateCode').patchValue(null);
          this._toaster.clearAllToaster();
          this._toaster.warningToast('Invalid GSTIN.');
        }
      });
    } else {
      statesEle.disabled = false;
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
