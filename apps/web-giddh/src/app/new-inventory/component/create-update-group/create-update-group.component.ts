import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable, ReplaySubject } from "rxjs";
import { takeUntil, distinctUntilChanged } from "rxjs/operators";
import { CompanyActions } from "../../../actions/company.actions";
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groups-with-stocks.interface';
import { StockGroupHelper } from '../../../shared/helpers/stock-group.helper';
import { InventoryService } from "../../../services/inventory.service";
import { ToasterService } from "../../../services/toaster.service";
import { uniqueNameInvalidStringReplace } from "../../../shared/helpers/helperFunctions";
import { AppState } from "../../../store";
import { ConfirmModalComponent } from "../../../theme/new-confirm-modal/confirm-modal.component";
import { Location } from '@angular/common';
import { PageLeaveUtilityService } from "../../../services/page-leave-utility.service";
import { InventoryComponentStore } from "../inventory.store";
import { GeneralService } from "../../../services/general.service";
import { IDiscountList } from "../../../models/api-models/SettingsDiscount";
import { ServiceConfig } from "../../../services/service.config";
import { IOption } from "../../../app.constant";
import { Configuration } from '../../../app.constant';
import { environment } from '../../../../environments/environment.generated';
import { cloneDeep, isEqual } from '../../../lodash-optimized';
import { TaxSelectionHelper } from '../../helpers/tax-selection.helper';
import { DataOperationEnum } from "../../../shared/Enums/common.enum";

@Component({
    selector: 'create-update-group',

    templateUrl: './create-update-group.component.html',
    standalone: false,
    styleUrls: ['./create-update-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [InventoryComponentStore]
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
    /** Flag to temporarily disable page leave confirmation after successful operations */
    private skipPageLeaveConfirmation: boolean = false;
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** True if tax selection box is open */
    public isTaxSelectionOpen: boolean = false;
    /** Holds list of taxes processed while tax selection box was closed */
    public processedTaxes: any[] = [];
    /** True if we need to show tax field. We are maintaining this because taxes are not getting reset on form reset */
    public showTaxField: boolean = true;
    /** Returns true if form has actual unsaved changes else false */
    public get showPageLeaveConfirmation(): boolean {

        if (!this.groupForm || !this.initialFormValues || this.skipPageLeaveConfirmation) {
            return false;
        }

        // Use lodash isEqual for deep comparison of form values
        const currentValues = this.groupForm.value;
        return !isEqual(currentValues, this.initialFormValues);
    }
    /** Discounts list Observable */
    public discountsList$: Observable<any> = this.componentStore.discountsList$;
    /** Discounts list */
    public discountsList: IDiscountList[] = [];
    /** Store initial form values to compare for actual changes */
    private initialFormValues: any = null;

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
        @Inject(ServiceConfig) private serviceConfig,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private componentStore: InventoryComponentStore,
        private router: Router,
        private generalService: GeneralService
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
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        /** added parent class to body after entering create group page */
        document.querySelector("body").classList.add("group-create-update");
        this.initGroupForm();
        this.getTaxes();
        this.getAllDiscounts();
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

        // Listen to form value changes to update initial values when form is cleared
        this.groupForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(formValues => {
            // Check if all important form fields are blank/empty
            const isFormBlank = this.isFormCompletelyBlank(formValues);

            if (isFormBlank) {
                // Update initial values to current blank state to prevent popup
                setTimeout(() => {
                    this.captureInitialFormValues();
                }, 100);
            }
        });

        // Capture initial form values after component is fully initialized
        setTimeout(() => {
            this.captureInitialFormValues();
        }, 1000);
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
            discounts: null,
            discountLabel: [''],
            type: null,
            runtimeManufacturing: false
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
    * Get all discounts
    *
    * @private
    * @memberof CreateUpdateGroupComponent
    */
    private getAllDiscounts(): void {
        this.discountsList$.pipe(takeUntil(this.destroyed$)).subscribe( response => {
            if (response) {
                this.discountsList = response;
            }
        });
        this.componentStore.getDiscountList();
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
     * selectTax
     *
     * @param {*} taxSelected
     * @memberof CreateUpdateGroupComponent
     */
    public selectTax(taxSelected: any): void {
        const result = TaxSelectionHelper.selectTax(
            taxSelected,
            this.taxes,
            this.taxTempArray,
            this.selectedTaxes,
            this.processedTaxes,
            this.isTaxSelectionOpen
        );
        this.taxTempArray = result.taxTempArray;
        this.selectedTaxes = result.selectedTaxes;
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
        const model = this.groupForm?.value;
        if (!Array.isArray(model.discounts)) {
            model.discounts = model.discounts?.length ? [model.discounts] : [];
        }
        delete model.discountLabel;
        if (this.groupUniqueName) {
            this.toggleLoader(true);
            this.inventoryService.UpdateStockGroup(this.groupForm?.value, this.groupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.toggleLoader(false);
                    this.clearPageLeaveConfirmation();
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
            this.inventoryService.CreateStockGroup(model).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.toggleLoader(false);
                    this.clearPageLeaveConfirmation();
                    this.toaster.showSnackBar("success", this.localeData?.stock_group_create);

                    if (!this.addGroup) {
                        this.resetGroupForm();
                        this.getStockGroups();
                        this.resetTaxes();
                    } else {
                        this.resetGroupForm();
                        this.closeAsideEvent.emit(DataOperationEnum.CREATE);
                    }
                } else {
                    this.toggleLoader(false);
                    this.clearPageLeaveConfirmation();
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
     * This will use for arrange stock groups
     *
     * @private
     * @param {IGroupsWithStocksHierarchyMinItem[]} groups
     * @param {IOption[]} [parents=[]]
     * @memberof CreateUpdateGroupComponent
     */
    private arrangeStockGroups(groups: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
        StockGroupHelper.arrangeStockGroups(groups, parents);
        this.changeDetection.detectChanges();
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

        // Capture initial form values for comparison after form is fully initialized
        setTimeout(() => {
            this.captureInitialFormValues();
        }, 500);

        this.changeDetection.detectChanges();
    }

    /**
     * Resets the taxes
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
                    taxes: response.body.taxes,
                    discounts: response.body.discounts,
                    runtimeManufacturing: response.body.runtimeManufacturing
                });
                this.groupForm.get('discountLabel').patchValue(this.discountsList?.find(discount => discount.uniqueName === response.body.discounts[0])?.name);
                this.groupForm.updateValueAndValidity();

                // Capture initial form values for comparison
                this.captureInitialFormValues();

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

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.toggleLoader(true);
                this.inventoryService.DeleteStockGroup(this.groupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.toggleLoader(false);
                    if (response?.status === "success") {
                        this.clearPageLeaveConfirmation();
                        this.toaster.showSnackBar("success", this.localeData?.group_delete);
                        if (this.addGroup) {
                            this.closeAsideEvent.emit(DataOperationEnum.DELETE);
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
     * Clears page leave confirmation by setting skip flag
     *
     * @private
     * @memberof CreateUpdateGroupComponent
     */
    private clearPageLeaveConfirmation(): void {
        this.skipPageLeaveConfirmation = true;
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        // Reset the flag after a short delay to allow normal functionality to resume
        setTimeout(() => {
            this.skipPageLeaveConfirmation = false;
        }, 1000);
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
     * Captures the current form values as initial values for comparison
     *
     * @public
     * @memberof CreateUpdateGroupComponent
     */
    public captureInitialFormValues(): void {
        if (this.groupForm) {
            this.initialFormValues = cloneDeep(this.groupForm.value);
        }
    }

    /**
     * Checks if the form is completely blank (all important fields are empty)
     *
     * @private
     * @param {any} formValues
     * @returns {boolean}
     * @memberof CreateUpdateGroupComponent
     */
    private isFormCompletelyBlank(formValues: any): boolean {
        if (!formValues) return true;

        // Check important form fields that indicate user input
        const importantFields = [
            'name',
            'uniqueName',
            'hsnNumber',
            'sacNumber'
        ];

        // Check if all important fields are empty/null/undefined
        const allImportantFieldsEmpty = importantFields.every(field => {
            const value = formValues[field];
            return !value || value.toString().trim() === '';
        });

        // Also check if taxes and discounts arrays are empty
        const taxesEmpty = !formValues.taxes || formValues.taxes.length === 0;
        const discountsEmpty = !formValues.discounts || formValues.discounts.length === 0;

        return allImportantFieldsEmpty && taxesEmpty && discountsEmpty;
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
