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
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction) {
    //
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
    return this._fb.group({
      gstNumber: [''],
      address: [''],
      stateCode: [''],
      isDefault: [false],
      isComposite: [false],
      partyType: ['']
    });
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
  public addGstDetailsForm() {
    const addresses = this.addAccountForm.get('addresses') as FormArray;
    addresses.push(this.initialGstDetailsForm());
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

  public submit() {
    console.log(this.addAccountForm.value);
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
