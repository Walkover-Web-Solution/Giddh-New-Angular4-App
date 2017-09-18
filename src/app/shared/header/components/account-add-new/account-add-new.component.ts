import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
import { contriesWithCodes, IContriesWithCodes } from '../../../helpers/countryWithCodes';
import { ToasterService } from '../../../../services/toaster.service';

@Component({
  selector: 'account-add-new',
  templateUrl: 'account-add-new.component.html'
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
  public partyTypeSource: Select2OptionData[] = [
    { id: 'not applicable', text: 'Not Applicable' },
    { id: 'deemed export', text: 'Deemed Export' },
    { id: 'government entity', text: 'Government Entity' },
    { id: 'sez', text: 'Sez' },
  ];
  public countrySource: Select2OptionData[] = [];
  public statesSource$: Observable<Select2OptionData[]> = Observable.of([]);
  public showMoreGstDetails: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
    private _companyService: CompanyService, private _toaster: ToasterService) {
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
      openingBalanceType: ['CREDIT', [Validators.required]],
      openingBalance: [0, Validators.compose([digitsOnly])],
      mobileNo: [''],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      companyName: [''],
      attentionTo: [''],
      description: [''],
      addresses: this._fb.array([
        this.initialGstDetailsForm()
      ]),
      country: this._fb.group({
        countryCode: ['']
      }),
      hsnOrSac: [''],
      hsnNumber: [{ value: '', disabled: false }, []],
      sacNumber: [{ value: '', disabled: false }, []],
    });
  }

  public initialGstDetailsForm(): FormGroup {
    let gstFields = this._fb.group({
      gstNumber: ['', Validators.compose([Validators.required, Validators.maxLength(15)])],
      address: [''],
      stateCode: [''],
      isDefault: [false],
      isComposite: [false],
      partyType: ['']
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
  public getStateCode(gstForm: FormGroup) {
    let gstVal: string = gstForm.get('gstNumber').value;
    if (gstVal.length >= 2) {
      this.statesSource$.take(1).subscribe(state => {
        let s = state.find(st => st.id === gstVal.substr(0, 2));
        if (s) {
          gstForm.get('stateCode').patchValue(s.id);
          gstForm.get('stateCode').disable();
        } else {
          gstForm.get('stateCode').patchValue(null);
          this._toaster.clearAllToaster();
          this._toaster.warningToast('Invalid GSTIN.');
        }
      });
    } else {
      gstForm.get('stateCode').patchValue(null);
      gstForm.get('stateCode').enable();
    }
  }
  public submit() {
    console.log(this.addAccountForm.value);
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
