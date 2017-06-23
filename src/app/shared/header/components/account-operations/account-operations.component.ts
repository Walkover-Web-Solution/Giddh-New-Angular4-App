import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'account-operations',
  templateUrl: './account-operations.component.html',
})
export class AccountOperationsComponent implements OnInit {
  // tslint:disable-next-line:no-empty
  public addAccountForm: FormGroup;
  constructor(private _fb: FormBuilder) { }

  public ngOnInit() {
    this.addAccountForm = this._fb.group({
      accName: ['', Validators.required],
      accUnq: ['', Validators.required],
      openingBalance: ['', Validators.required],
      openingBalanceType: ['', Validators.required],
      mobileNo: ['', Validators.required],
      email: ['', [ Validators.required, Validators.email]],
      companyName: ['', Validators.required],
      attentionTo: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

}
