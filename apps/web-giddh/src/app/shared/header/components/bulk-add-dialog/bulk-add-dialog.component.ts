import { Component, Inject, Input, OnInit } from '@angular/core';
import { SettingsBranchActions } from 'apps/web-giddh/src/app/actions/settings/branch/settings.branch.action';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Store } from '@ngrx/store';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { digitsOnly } from '../../../helpers';
import { AccountsAction } from 'apps/web-giddh/src/app/actions/accounts.actions';
import { AccountAddNewDetailsComponentStore } from '../account-add-new-details/utility/account-add-new-details.store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bulk-add-dialog',
  templateUrl: './bulk-add-dialog.component.html',
  styleUrls: ['./bulk-add-dialog.component.scss'],
  providers: [AccountAddNewDetailsComponentStore]
})
export class BulkAddDialogComponent implements OnInit {

  /* This will hold local JSON data */
  public localeData: any = {};
  /* This will hold common JSON data */
  public commonLocaleData: any = {};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Holds company branches */
  public branches: Array<any>;
  /** Holds company specific data */
  public company: any = {
    branch: null,
  };
  public bulkAddAccountForm: UntypedFormGroup;

  constructor(
    private store: Store<AppState>,
    private readonly componentStore: AccountAddNewDetailsComponentStore,
    private settingsBranchAction: SettingsBranchActions,
    private generalService: GeneralService,
    private _fb: UntypedFormBuilder,
    private accountsAction: AccountsAction,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<any>
  ) { }

  /**
   * OninIt
   *
   * @memberof BulkAddDialogComponent
   */
  ngOnInit(): void {
    this.initializeNewForm();
    this.getCompanyBranches();
  }

  public initializeNewForm() {
    this.bulkAddAccountForm = this._fb.group({
      openingBalanceType: ['CREDIT'],
      openingBalance: [''],
      closingBalanceTriggerAmount: ['', Validators.compose([digitsOnly])],
      closingBalanceTriggerAmountType: ['CREDIT'],
      customFields: this._fb.array([])
    });

    this.bulkAddAccountForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
      this.store.dispatch(this.accountsAction.hasUnsavedChanges(this.bulkAddAccountForm.dirty));
    });
  }

  private openingBulkGet(): FormGroup {
    return this.formBuilder.group({
        openingBalance: [''],
        openingBalanceType: ['CREDIT']
    });
  }


  public onSubmit(): void {
    if (this.bulkAddAccountForm.valid) {
      // Use MatDialogRef to close the dialog and pass data
      this.data.dialogRef.close(this.bulkAddAccountForm.value);
    }
  }

  /**
    * Gets company branches
    *
    * @memberof BulkAddDialogComponent
  */
  public getCompanyBranches(): void {
    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
    this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
      if (response) {
        this.branches = response;
        const formArray = this.bulkAddAccountForm.get('customFields') as FormArray;
        formArray.clear();
        response.forEach(() => {
          formArray.push(this.openingBulkGet());
        })
        console.log(this.bulkAddAccountForm.get('customFields').value);
        this.company.isActive = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches?.length > 1;
        if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
          // Find the current checked out branch
          this.company.branch = response.find(branch => branch?.uniqueName === this.generalService.currentBranchUniqueName);
        } else {
          // Find the HO branch
          this.company.branch = response.find(branch => !branch.parentBranch);
        }
        console.log('Branche List', response);
      }
    });
  }

  public openingBalanceTypeChnaged(type: string, index: number) {
    const formArray = this.bulkAddAccountForm.get('customFields') as FormArray;
    const item = formArray.at(index) as FormGroup;
    if (Number(item.get('openingBalance')?.value) >= 0) {
      item.get('openingBalanceType')?.patchValue(type);
    }
    // if (Number(this.bulkAddAccountForm.get('openingBalance')?.value) > 0) {
    //   this.bulkAddAccountForm.get('openingBalanceType')?.patchValue(type);
    // }
  }

  public saveOpeningBalance():void {
    // if(this.bulkAddAccountForm.valid) {
    //   this.dialogRef.close({
    //     customFields: this.bulkAddAccountForm.get('customFields')?.value
    //   });
    // }
    this.dialogRef.close(this.bulkAddAccountForm.value);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
