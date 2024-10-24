import { Component, Inject, OnInit } from '@angular/core';
import { SettingsBranchActions } from 'apps/web-giddh/src/app/actions/settings/branch/settings.branch.action';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AccountsAction } from 'apps/web-giddh/src/app/actions/accounts.actions';
import { AccountAddNewDetailsComponentStore } from '../account-add-new-details/utility/account-add-new-details.store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BranchHierarchyType } from 'apps/web-giddh/src/app/app.constant';

@Component({
    selector: 'bulk-add-dialog',
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
    public bulkAddAccountForm: FormGroup;

    constructor(
        private store: Store<AppState>,
        private readonly componentStore: AccountAddNewDetailsComponentStore,
        private settingsBranchAction: SettingsBranchActions,
        private generalService: GeneralService,
        private accountsAction: AccountsAction,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<any>
    ) { }

    /**
     * This hook will be use for component initialization
     *
     * @memberof BulkAddDialogComponent
     */
    public ngOnInit(): void {
        this.initNewForm();
        this.getCompanyBranches();
        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response?.filter(branch => !branch.consolidatedBranch);
                const formArray = this.bulkAddAccountForm.get('customFields') as FormArray;
                formArray?.clear();
                this.branches.forEach((item) => {
                    if (item?.name) {
                        formArray?.push(this.openingBulkGet(
                            {
                                name: item.name,
                                uniqueName: item.uniqueName
                            }
                        ));
                    }
                });
                if (this.data?.saveBulkData?.length) {
                    // Then, merge the data by matching uniqueName
                    this.mergeFormArrayWithData(this.data?.saveBulkData);
                }
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

    /**
     * This will be use for merge form array data with temporary save bulk data
     *
     * @param {any[]} branchData
     * @memberof BulkAddDialogComponent
     */
    public mergeFormArrayWithData(branchData: any[]): void {
        const branchFormArray = this.bulkAddAccountForm.get('customFields') as FormArray;
        branchFormArray.controls.forEach((formGroup) => {
            const formArrayBranch = formGroup.get('branch')?.value;
            const matchingBranch = branchData.find(branch => branch.branch.uniqueName === formArrayBranch.uniqueName);

            if (matchingBranch) {
                formGroup.patchValue({
                    openingBalance: matchingBranch.openingBalance,
                    foreignOpeningBalance: matchingBranch.foreignOpeningBalance,
                    openingBalanceType: matchingBranch.openingBalanceType
                });
            }
        });
    }

    /**
     * Initialise Form Group
     *
     * @memberof BulkAddDialogComponent
     */
    public initNewForm(): void {
        this.bulkAddAccountForm = this.formBuilder.group({
            openingBalanceType: ['CREDIT'],
            openingBalance: [''],
            customFields: this.formBuilder.array([])
        });

        this.bulkAddAccountForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.store.dispatch(this.accountsAction.hasUnsavedChanges(this.bulkAddAccountForm.dirty));
        });
    }

    /**
     * Get bulk data balance
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
      * Get company branches
      *
      * @memberof BulkAddDialogComponent
    */
    public getCompanyBranches(): void {
        this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
    }

    /**
     * Credit and Debit opening Balalnce Type change
     *
     * @param {string} type
     * @param {number} index
     * @memberof BulkAddDialogComponent
     */
    public openingBalanceTypeChanged(type: string, index: number): void {
        const formArray = this.bulkAddAccountForm.get('customFields') as FormArray;
        const item = formArray.at(index) as FormGroup;
        if (Number(item.get('openingBalance')?.value) >= 0) {
            item.get('openingBalanceType')?.patchValue(type);
        } else if (Number(item.get('foreignOpeningBalance')?.value)) {
            item.get('foreignOpeningBalance')?.patchValue(type);
        }
    }

    /**
     * Save opening balance value
     *
     * @memberof BulkAddDialogComponent
     */
    public saveOpeningBalance(): void {
        if (this.bulkAddAccountForm.valid) {
            const branchesWithOpeningBalance = this.bulkAddAccountForm?.value.customFields.filter(branch => branch.openingBalance !== "" && branch.openingBalance !== null);
            this.bulkAddAccountForm.value.customFields = branchesWithOpeningBalance;
            this.dialogRef.close(this.bulkAddAccountForm.value);
        }
    }

    /**
     * This will be use for component destroy
     *
     * @memberof BulkAddDialogComponent
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
