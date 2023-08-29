import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
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
import { PageLeaveUtilityService } from "../../../services/page-leave-utility.service";

@Component({
    selector: 'create-update-group',
    templateUrl: './create-update-group.component.html',
    styleUrls: ['./create-update-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUpdateGroupComponent implements OnInit, OnDestroy {
    /** Holds group unique name if updating group  */
    @Input() public groupUniqueName: string = "";
    /** Holds active group to create stock under */
    @Input() public activeGroup: any;
    /* This will hold add group value from aside menu */
    @Input() public addGroup: boolean = false;
    /* This will emit close aside menu event */
    @Output() public closeAsideEvent: EventEmitter<any> = new EventEmitter();
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
    /** Form Group for group form */
    public groupForm: UntypedFormGroup;
    /** True if loader is visible */
    public showLoader: boolean = false;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** True if tax selection box is open */
    public isTaxSelectionOpen: boolean = false;
    /** Holds list of taxes processed while tax selection box was closed */
    public processedTaxes: any[] = [];
    /** True if we need to show tax field. We are maintaining this because taxes are not getting reset on form reset */
    public showTaxField: boolean = true;
    /** Returns true if form is dirty else false */
    public get showPageLeaveConfirmation(): boolean {
        return this.groupForm?.dirty;
    }

    constructor(
        private store: Store<AppState>,
        private inventoryService: InventoryService,
        private companyAction: CompanyActions,
        private formBuilder: UntypedFormBuilder,
        private toaster: ToasterService,
        private route: ActivatedRoute,
        private changeDetection: ChangeDetectorRef,
        private dialog: MatDialog,
        private location: Location,
        private pageLeaveUtilityService: PageLeaveUtilityService
    ) {
        this.companyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));
    }

    /**
     * Hook for component initialization
     *
     * @memberof CreateUpdateGroupComponent
     */
    public ngOnInit(): void {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        /** added parent class to body after entering create group page */
        document.querySelector("body").classList.add("group-create-update");
        this.initGroupForm();
        this.getTaxes();
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                this.stockType = params?.type?.toUpperCase();
            }

            if (this.stockType === 'FIXEDASSETS') {
                this.stockType = 'FIXED_ASSETS';
            }

            if (params.groupUniqueName) {
                this.groupUniqueName = params.groupUniqueName;
                this.getGroupDetails();
            } else if (this.addGroup && this.groupUniqueName) {
                this.getGroupDetails();
            } else if (!this.addGroup) {
                this.stockGroupUniqueName = "";
            }

            if (this.stockType) {
                this.getStockGroups();
                this.changeDetection.detectChanges();
            }
        });

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
            uniqueName: [''],
            showCodeType: ['hsn'],
            hsnNumber: [''],
            sacNumber: [''],
            parentStockGroupUniqueName: [!this.groupUniqueName && this.activeGroup?.uniqueName ? this.activeGroup?.uniqueName : ''],
            isSubGroup: [!this.groupUniqueName && this.activeGroup?.uniqueName ? true : false],
            taxes: null,
            type: null
        });

        if (!this.groupUniqueName && this.activeGroup?.name) {
            this.stockGroupUniqueName = this.activeGroup?.uniqueName;
            this.stockGroupName = this.activeGroup?.name;
        }

        this.groupForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (this.showPageLeaveConfirmation) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
            }
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
            if (response?.length > 0 && !this.processedTaxes?.length) {
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

        if (!this.isTaxSelectionOpen) {
            if (this.processedTaxes.includes(taxSelected.uniqueName)) {
                return;
            }
            this.processedTaxes.push(taxSelected.uniqueName);
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
     * Callback for tax selection box change event
     *
     * @param {boolean} event
     * @memberof CreateUpdateGroupComponent
     */
    public openedSelectTax(event: boolean): void {
        this.isTaxSelectionOpen = event;
        if (event) {
            this.processedTaxes = [];
        }
    }

    /**
     * Creates/updates the group
     *
     * @memberof CreateUpdateGroupComponent
     */
    public saveGroup(): void {
        this.isFormSubmitted = false;
        if (!this.groupForm.get('name')?.value || !this.groupForm.get('uniqueName')?.value) {
            this.isFormSubmitted = true;
            return;
        }
        this.groupForm.controls['parentStockGroupUniqueName'].setValue(this.stockGroupUniqueName);
        this.groupForm.controls['type'].setValue(this.stockType);
        if (this.groupUniqueName) {
            this.toggleLoader(true);
            this.inventoryService.UpdateStockGroup(this.groupForm?.value, this.groupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.toggleLoader(false);
                    this.groupForm.markAsPristine();
                    this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
                    this.toaster.showSnackBar("success", this.localeData?.stock_group_update);
                    if (!this.addGroup) {
                        this.getStockGroups();
                        this.backClicked();
                    } else {
                        this.resetGroupForm();
                        this.closeAsideEvent.emit();
                    }
                } else {
                    this.toggleLoader(false);
                    this.toaster.showSnackBar("error", response?.message);
                }
                this.changeDetection.detectChanges();
            });

        } else {
            this.toggleLoader(true);
            this.inventoryService.CreateStockGroup(this.groupForm?.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.toggleLoader(false);
                    this.toaster.showSnackBar("success", this.localeData?.stock_group_create);

                    if (!this.addGroup) {
                        this.resetGroupForm();
                        this.getStockGroups();
                        this.resetTaxes();
                    } else {
                        this.resetGroupForm();
                        this.closeAsideEvent.emit();
                    }
                } else {
                    this.toggleLoader(false);
                    this.toaster.showSnackBar("error", response?.message);
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
        this.isFormSubmitted = false;
        this.groupForm.reset();
        this.groupForm.markAsPristine();
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        this.groupForm?.patchValue({ showCodeType: "hsn" });
        this.stockGroupName = '';
        this.stockGroupUniqueName = '';
        if (!this.groupUniqueName && this.activeGroup?.name) {
            this.stockGroupUniqueName = this.activeGroup?.uniqueName;
            this.stockGroupName = this.activeGroup?.name;
            this.groupForm?.patchValue({ parentStockGroupUniqueName: this.activeGroup?.uniqueName, isSubGroup: true });
        }
        this.selectedTaxes = [];
        this.processedTaxes = [];
        this.changeDetection.detectChanges();
    }

    /**
     * This will reset the taxes list
     *
     * @memberof CreateUpdateGroupComponent
     */
    public resetTaxes(): void {
        this.showTaxField = false;
        this.changeDetection.detectChanges();
        this.taxes = this.taxes?.map(tax => {
            tax.isChecked = false;
            tax.isDisabled = false;
            return tax;
        });
        this.showTaxField = true;
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
                this.stockGroupName = response.body.parentStockGroup?.name;
                this.stockGroupUniqueName = response?.body.parentStockGroup?.uniqueName;
                this.groupForm?.patchValue({
                    name: response.body.name,
                    uniqueName: response.body.uniqueName,
                    showCodeType: response.body.hsnNumber ? "hsn" : "sac",
                    hsnNumber: response.body.hsnNumber,
                    sacNumber: response.body.sacNumber,
                    parentStockGroupUniqueName: response.body.parentStockGroup ? response.body.parentStockGroup.uniqueName : '',
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
     * This will redirect to inventory list page
     *
     * @memberof CreateUpdateGroupComponent
     */
    public cancelEdit(): void {
        if (this.addGroup) {
            this.closeAsideEvent.emit(true);
        } else {
            this.backClicked();
        }
    }

    /**
     * This will delete the stock group
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
                        if (this.addGroup) {
                            this.closeAsideEvent.emit();
                        } else {
                            this.cancelEdit();
                        }
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