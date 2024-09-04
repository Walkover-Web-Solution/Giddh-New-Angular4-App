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

    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
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
        console.log('Data Value', this.data);
        this.initializeNewForm();
        this.getCompanyBranches();
        // if (this.data) {
        //     this.existingFormData(this.data);
        // }

        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response;
                const formArray = this.bulkAddAccountForm.get('customFields') as FormArray;
                console.log(formArray);
                formArray?.clear();
                response.forEach((item) => {
                    formArray?.push(this.openingBulkGet(
                        {
                            name: item.alias,
                            uniqueName: item.uniqueName
                        }
                    ));
                });
                this.company.isActive = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches?.length > 1;
                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    // Find the current checked out branch
                    this.company.branch = response.find(branch => branch?.uniqueName === this.generalService.currentBranchUniqueName);
                } else {
                    // Find the HO branch
                    this.company.branch = response.find(branch => !branch.parentBranch);
                }
            }
        });
    }

    private existingFormData(values: any): void {
        const formArray = this.bulkAddAccountForm.get('customFields') as FormArray;
        formArray.clear();
        values.forEach((item: any) => {
            formArray.push(this.openingBulkGet(item));
        });
    }

    /**
     * form group
     *
     * @memberof BulkAddDialogComponent
     */
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

    /**
     * getting data form
     *
     * @private
     * @param {*} [item]
     * @return {*}  {FormGroup}
     * @memberof BulkAddDialogComponent
     */
    private openingBulkGet(item?: any): FormGroup {
        return this.formBuilder.group({
            branch: [item ?? ''],
            openingBalance: [''],
            foreignOpeningBalance: [''],
            openingBalanceType: ['CREDIT']
        });
    }

    /**
      * Gets company branches
      *
      * @memberof BulkAddDialogComponent
    */
    public getCompanyBranches(): void {
        this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
    }

    /**
     * Credit and Debit opening Balalnce Type change
     *
     * @param {string} type
     * @param {number} index
     * @memberof BulkAddDialogComponent
     */
    public openingBalanceTypeChanged(type: string, index: number) {
        const formArray = this.bulkAddAccountForm.get('customFields') as FormArray;
        const item = formArray.at(index) as FormGroup;
        if (Number(item.get('openingBalance')?.value) >= 0) {
            item.get('openingBalanceType')?.patchValue(type);
        } else if (Number(item.get('foreignOpeningBalance')?.value)) {
            item.get('foreignOpeningBalance')?.patchValue(type);
        }
    }

    /**
     * save the opening balance value
     *
     * @memberof BulkAddDialogComponent
     */
    public saveOpeningBalance(): void {
        if (this.bulkAddAccountForm.valid) {
            console.log(this.bulkAddAccountForm.value);
            this.dialogRef.close(this.bulkAddAccountForm.value);
        } else {
            console.log('Form is invalid');
        }
    }

    /**
     * destroy
     *
     * @memberof BulkAddDialogComponent
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
