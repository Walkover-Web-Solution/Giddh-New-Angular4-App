import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable, ReplaySubject } from "rxjs";
import { takeUntil, distinctUntilChanged, take } from "rxjs/operators";
import { CompanyActions } from "../../../actions/company.actions";
import { cloneDeep, findIndex, forEach } from "../../../lodash-optimized";
import { IGroupsWithStocksHierarchyMinItem } from "../../../models/interfaces/groups-with-stocks.interface";
import { InventoryService } from "../../../services/inventory.service";
import { ToasterService } from "../../../services/toaster.service";
import { uniqueNameInvalidStringReplace } from "../../../shared/helpers/helperFunctions";
import { AppState } from "../../../store";
import { ConfirmModalComponent } from "../../../theme/new-confirm-modal/confirm-modal.component";
import { IOption } from "../../../theme/ng-virtual-select/sh-options.interface";
import { Location } from '@angular/common';

@Component({
    selector: 'create-update-group',
    templateUrl: './create-update-group.component.html',
    styleUrls: ['./create-update-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUpdateGroupComponent implements OnInit, OnDestroy {
    /* This will store image path */
    public imgPath: string = '';
    /** This holds company  */
    public companyUniqueName$: Observable<string>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stock groups list */
    public stockGroups: IOption[] = [];
    /** Holds stock type from url */
    private stockType: string = "";
    /** Holds stock group unique name */
    public stockGroupUniqueName: string = "";
    /** Holds stock group name */
    public stockGroupName: string = "";
    /** Taxes list */
    public taxes: any[] = [];
    /** Holds list of selected taxes */
    private selectedTaxes: any[] = [];
    /** Holds temporarily list of taxes */
    public taxTempArray: any[] = [];
    /** Holds group unique name if updating group  */
    public groupUniqueName: string = "";
    /** Form Group for group form */
    public groupForm: FormGroup;
    /** True if loader is visible */
    public showLoader: boolean = false;
    /** True if translations loaded */
    public translationLoaded: boolean = false;

    constructor(
        private store: Store<AppState>,
        private inventoryService: InventoryService,
        private companyAction: CompanyActions,
        private formBuilder: FormBuilder,
        private toaster: ToasterService,
        private route: ActivatedRoute,
        private changeDetection: ChangeDetectorRef,
        private router: Router,
        private dialog: MatDialog,
        private location: Location,
    ) {
        this.companyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));
        this.initGroupForm();
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.stockType = params?.type?.toUpperCase();
            if (this.stockType === 'FIXEDASSETS') {
                this.stockType = 'FIXED_ASSETS';
            }
            if (params.groupUniqueName) {
                this.groupUniqueName = params.groupUniqueName;
                this.getGroupDetails();
            } else {
                this.stockGroupUniqueName = "";
            }
        });
    }

    /**
     * Hook for component initialization
     *
     * @memberof CreateUpdateGroupComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.groupForm.controls['isSubGroup'].valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.groupForm.controls['parentStockGroupUniqueName'].enable();
            } else {
                this.groupForm.controls['parentStockGroupUniqueName'].reset();
                this.groupForm.controls['parentStockGroupUniqueName'].disable();
                this.stockGroupName = '';
                this.stockGroupUniqueName = '';
            }
        });
        if (this.stockType) {
            this.getStockGroups();
            this.getTaxes();
        }
        document.querySelector("body").classList.add("group-create-update");
    }

    /**
    * Initializing the group form
    *
    * @private
    * @memberof CreateUpdateGroupComponent
    */
    private initGroupForm(): void {
        this.groupForm = this.formBuilder.group({
            name: ['', Validators.required],
            uniqueName: ['', Validators.required],
            showCodeType: ['hsn'],
            hsnNumber: [''],
            sacNumber: [''],
            parentStockGroupUniqueName: [''],
            isSubGroup: [false],
            taxes: null,
            type: null
        });
    }

    /**
    * Get taxes
    *
    * @memberof CreateUpdateGroupComponent
    */
    public getTaxes(): void {
        this.store.dispatch(this.companyAction.getTax());
        this.store.pipe(select(state => state?.company?.taxes), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.length > 0) {
                this.taxes = response || [];
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
    * This will take the user back to last page
    *
    * @memberof CreateUpdateGroupComponent
    */
    public backClicked(): void {
        this.location.back();
    }

    /**
    * Select tax
    *
    * @param {*} taxSelected
    * @memberof CreateUpdateGroupComponent
    */
    public selectTax(taxSelected: any): void {
        if (!taxSelected) {
            return;
        }
        let isSelected = this.selectedTaxes?.filter(selectedTax => selectedTax === taxSelected.uniqueName);
        if (taxSelected.taxType !== 'gstcess') {
            let index = findIndex(this.taxTempArray, (taxTemp) => taxTemp.taxType === taxSelected.taxType);
            if (index > -1 && !isSelected?.length) {
                forEach(this.taxes, (tax) => {
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') && (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                });
            }

            if (index < 0 && !isSelected?.length) {
                forEach(this.taxes, (tax) => {
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }

                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') && (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                    if (tax?.uniqueName === taxSelected.uniqueName) {
                        taxSelected.isChecked = true;
                        taxSelected.isDisabled = false;
                        this.taxTempArray.push(taxSelected);
                    }
                });
            } else if (index > -1 && !isSelected?.length) {
                taxSelected.isChecked = true;
                taxSelected.isDisabled = false;
                this.taxTempArray = this.taxTempArray?.filter(taxTemp => {
                    return taxSelected.taxType !== taxTemp.taxType;
                });
                this.taxTempArray.push(taxSelected);
            } else {
                let idx = findIndex(this.taxTempArray, (taxTemp) => taxTemp?.uniqueName === taxSelected.uniqueName);
                this.taxTempArray.splice(idx, 1);
                taxSelected.isChecked = false;
                forEach(this.taxes, (tax) => {
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isDisabled = false;
                    }
                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') && (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isDisabled = false;
                    }
                });
            }
        } else {
            if (!isSelected?.length) {
                this.taxTempArray.push(taxSelected);
                taxSelected.isChecked = true;
            } else {
                let idx = findIndex(this.taxTempArray, (taxTemp) => taxTemp?.uniqueName === taxSelected.uniqueName);
                this.taxTempArray.splice(idx, 1);
                taxSelected.isChecked = false;
            }
        }
        this.selectedTaxes = this.taxTempArray.map(tax => tax?.uniqueName);
        this.changeDetection.detectChanges();
    }

    /**
    * Creates/updates the group
    *
    * @memberof CreateUpdateGroupComponent
    */
    public saveGroup(): void {
        this.groupForm.controls['parentStockGroupUniqueName'].setValue(this.stockGroupUniqueName);
        this.groupForm.controls['type'].setValue(this.stockType);
        if (this.groupUniqueName) {
            this.toggleLoader(true);
            this.inventoryService.UpdateStockGroup(this.groupForm?.value, this.groupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.toggleLoader(false);
                    this.getStockGroups();
                    this.selectedGroupTaxes();
                    this.toaster.clearAllToaster();
                    this.toaster.successToast(this.localeData?.stock_group_update);
                    this.backClicked();
                } else {
                    this.toggleLoader(false);
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(response?.message);
                }
                this.changeDetection.detectChanges();
            });

        } else {
            this.toggleLoader(true);
            this.inventoryService.CreateStockGroup(this.groupForm?.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.toggleLoader(false);
                    this.getStockGroups();
                    this.resetTaxes();
                    this.resetGroupForm();
                    this.toaster.clearAllToaster();
                    this.toaster.successToast(this.localeData?.stock_group_create);
                } else {
                    this.toggleLoader(false);
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(response?.message);
                }
                this.changeDetection.detectChanges();
            });
        }
    }

    /**
    * Get stock groups
    *
    * @memberof CreateUpdateGroupComponent
    */
    public getStockGroups(): void {
        this.inventoryService.GetGroupsWithStocksFlatten(this.stockType).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                let stockGroups: IOption[] = [];
                if (response.body?.results?.length > 0) {
                    this.arrangeStockGroups(response.body?.results, stockGroups);
                }
                this.stockGroups = stockGroups;
            }
        });
    }

    /**
     * Arrange stock groups
     *
     * @private
     * @param {IGroupsWithStocksHierarchyMinItem[]} groups
     * @param {IOption[]} [parents=[]]
     * @memberof CreateUpdateGroupComponent
     */
    private arrangeStockGroups(groups: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
        groups.map(group => {
            if (group) {
                let newOption: IOption = { label: '', value: '', additional: {} };
                newOption.label = group?.name;
                newOption.value = group?.uniqueName;
                newOption.additional = group;
                parents.push(newOption);
                if (group?.childStockGroups?.length > 0) {
                    this.arrangeStockGroups(group?.childStockGroups, parents);
                }
            }
        });
    }

    /**
     * Generates the unique name based on name
     *
     * @memberof CreateUpdateGroupComponent
     */
    public generateUniqueName(): void {
        let val: string = this.groupForm.controls['name']?.value;
        val = uniqueNameInvalidStringReplace(val);

        if (val) {
            this.groupForm?.patchValue({ uniqueName: val });
        } else {
            this.groupForm?.patchValue({ uniqueName: '' });
        }
    }

    /**
     * Resets the group form
     *
     * @memberof CreateUpdateGroupComponent
     */
    public resetGroupForm(): void {
        this.groupForm.reset();
        this.groupForm?.patchValue({ showCodeType: "hsn" });
        this.stockGroupName = '';
        this.stockGroupUniqueName = '';
        this.selectedTaxes = [];
        this.changeDetection.detectChanges();
    }

    /**
     * This will reset the taxes list
     *
     * @memberof CreateUpdateGroupComponent
     */
    public resetTaxes(): void {
        this.taxes?.forEach(tax => {
            tax.isChecked = false;
            tax.isDisabled = false;
            return tax;
        });
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for select group tax on update
     *
     * @memberof CreateUpdateGroupComponent
     */
    public selectedGroupTaxes(): void {
        this.taxes?.forEach(tax => {
            if (tax?.isChecked) {
                this.selectTax(tax);
            }
            return tax;
        });
        this.changeDetection.detectChanges();
    }

    /**
    * This will use for set hsn/sac value default
    *
    * @param {*} transaction
    * @memberof CreateUpdateGroupComponent
    */
    public onChangeHsnSacType(): void {
        setTimeout(() => {
            if (this.groupForm.get('showCodeType')?.value === 'hsn') {
                this.groupForm.controls['hsnNumber'].setValue(cloneDeep(this.groupForm.get('sacNumber').value));
                this.groupForm.controls['sacNumber'].setValue('');
            } else {
                this.groupForm.controls['sacNumber'].setValue(cloneDeep(this.groupForm.get('hsnNumber').value));
                this.groupForm.controls['hsnNumber'].setValue('');
            }
            this.changeDetection.detectChanges();
        }, 100);
    }

    /**
     * Validates the unique name
     *
     * @memberof CreateUpdateGroupComponent
     */
    public validateUniqueName(): void {
        if (this.groupForm.get('uniqueName')?.value) {
            let value = uniqueNameInvalidStringReplace(this.groupForm.get('uniqueName')?.value);
            this.groupForm?.patchValue({ uniqueName: value });
        }
    }

    /**
   * Gets the group details
   *
   * @private
   * @memberof CreateUpdateGroupComponent
   */
    private getGroupDetails(): void {
        this.toggleLoader(true);
        this.inventoryService.getStockGroup(this.groupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body) {
                this.toggleLoader(false);
                this.stockGroupName = response.body.parentStockGroupNames;
                this.groupForm?.patchValue({
                    name: response.body.name,
                    uniqueName: response.body.uniqueName,
                    showCodeType: response.body.hsnNumber ? "hsn" : "sac",
                    hsnNumber: response.body.hsnNumber,
                    sacNumber: response.body.sacNumber,
                    parentStockGroupUniqueName: response.body.parentStockGroupNames,
                    isSubGroup: (response.body.parentStockGroup?.uniqueName) ? true : false,
                    taxes: response.body.taxes
                });
                this.groupForm.updateValueAndValidity();
                this.changeDetection.detectChanges();
            } else {
                this.toggleLoader(false);
                this.toaster.showSnackBar("error", response?.message);
                this.changeDetection.detectChanges();
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
    *This will redirect to inventory list page
    *
    * @memberof CreateUpdateGroupComponent
    */
    public cancelEdit(): void {
        this.router.navigate(['/pages/inventory']);
    }

    /**
     *This will delete the stock group
     *
     * @memberof CreateUpdateGroupComponent
     */
    public deleteGroup(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '40%',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.delete_message,
                permanentlyDeleteMessage: this.localeData?.delete_message1,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.toggleLoader(true);
                this.inventoryService.DeleteStockGroup(this.groupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.toggleLoader(false);
                    if (response?.status === "success") {
                        this.toaster.showSnackBar("success", this.localeData?.group_delete);
                        this.cancelEdit();
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            }
        });
    }

    /**
     *Toggle loader
     *
     * @private
     * @param {boolean} showLoader
     * @memberof CreateUpdateGroupComponent
     */
    private toggleLoader(showLoader: boolean): void {
        this.showLoader = showLoader;
    }

    /**
     * This will use for translation complete
     *
     * @param {*} event
     * @memberof CreateUpdateGroupComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
        }
    }

    /**
     * Hook for component destroy
     *
     * @memberof CreateUpdateGroupComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector("body").classList.remove("group-create-update");
    }
}

