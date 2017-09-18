import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { digitsOnly } from '../../../helpers/customValidationHelper';

@Component({
  selector: 'account-add-new',
  templateUrl: 'account-add-new.component.html'
})

export class AccountAddNewComponent implements OnInit {
  public addAccountForm: FormGroup;
  constructor(private _fb: FormBuilder) {
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
}
