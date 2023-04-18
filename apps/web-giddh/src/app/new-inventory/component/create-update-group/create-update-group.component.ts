import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { UploadInput, UploaderOptions, UploadOutput } from "ngx-uploader";
import { Observable, ReplaySubject, of as observableOf } from "rxjs";
import { takeUntil, distinctUntilChanged } from "rxjs/operators";
import { CompanyActions } from "../../../actions/company.actions";
import { cloneDeep, findIndex, forEach } from "../../../lodash-optimized";
import { IForceClear } from "../../../models/api-models/Sales";
import { IGroupsWithStocksHierarchyMinItem } from "../../../models/interfaces/groups-with-stocks.interface";
import { InventoryService } from "../../../services/inventory.service";
import { ToasterService } from "../../../services/toaster.service";
import { uniqueNameInvalidStringReplace } from "../../../shared/helpers/helperFunctions";
import { AppState } from "../../../store";
import { IOption } from "../../../theme/ng-virtual-select/sh-options.interface";


@Component({
    selector: 'create-update-group',
    templateUrl: './create-update-group.component.html',
    styleUrls: ['./create-update-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUpdateGroupComponent implements OnInit, OnDestroy {
    /** Instance of stock create/edit form */
    @ViewChild('groupCreateEditForm', { static: false }) public groupCreateEditForm: NgForm;
    /* This will store image path */
    public imgPath: string = '';
    /** Observable to hold stock groups */
    public groups$: Observable<IOption[]>;
    /* This will clear the select value in sh-select */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** Holds input for file upload */
    public uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
    /** True if file upload is in progress */
    public isFileUploading: boolean = false;
    /** This holds session id */
    public sessionId$: Observable<string>;
    /** This holds company  */
    public companyUniqueName$: Observable<string>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Options for file upload */
    public fileUploadOptions: UploaderOptions = { concurrency: 0 };
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Object of group form */
    // public groupForm: any = {
    //     name: null,
    //     uniqueName: null,
    //     showCodeType: 'hsn',
    //     hsnNumber: null,
    //     sacNumber: null,
    //     isSubGroup: null,
    //     parentStockGroupUniqueName: null,
    //     taxes: null,
    // };
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


    constructor(
        private store: Store<AppState>,
        private inventoryService: InventoryService,
        private companyAction: CompanyActions,
        private formBuilder: FormBuilder,
        private toaster: ToasterService,
        private route: ActivatedRoute,
        private changeDetection: ChangeDetectorRef,
    ) {
        this.sessionId$ = this.store.pipe(select(state => state.session.user.session.id), takeUntil(this.destroyed$));
        this.companyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));
        this.initGroupForm();

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.stockType = params?.type?.toUpperCase();
            if (params.groupUniqueName) {
                this.stockGroupUniqueName = params.groupUniqueName;
                this.groupUniqueName = params.groupUniqueName;
                this.getGroupDetails();
            } else {
                this.stockGroupUniqueName = "";
            }
        });
        this.getStockGroups();
        this.getTaxes();

    }

    /**
     * Hook for component initialization
     *
     * @memberof InventoryCreateUpdateGroupComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        // this.resetForm(this.groupCreateEditForm);

    }

    /**
 * Get taxes
 *
 * @memberof StockCreateEditComponent
 */
    public getTaxes(): void {
        this.store.dispatch(this.companyAction.getTax());
        this.store.pipe(select(state => state?.company?.taxes), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.length > 0) {
                this.taxes = response || [];
                this.checkSelectedTaxes();
            }
        });
    }

    /**
 * Prefill selected taxes
 *
 * @private
 * @memberof StockCreateEditComponent
 */
    private checkSelectedTaxes(): void {
        if (this.taxes?.length > 0) {
            this.taxes?.forEach(tax => {
                if (this.groupForm.get('taxes')?.value?.includes(tax?.uniqueName)) {
                    this.selectTax(tax);
                }
            });
        }
    }


    /**
     * Select tax
     *
     * @param {*} taxSelected
     * @memberof StockCreateEditComponent
     */
    public selectTax(taxSelected: any): void {
        let isSelected = this.selectedTaxes?.filter(selectedTax => selectedTax === taxSelected?.uniqueName);

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
                    if (tax?.uniqueName === taxSelected?.uniqueName) {
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
                let idx = findIndex(this.taxTempArray, (taxTemp) => taxTemp?.uniqueName === taxSelected?.uniqueName);
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
                let idx = findIndex(this.taxTempArray, (taxTemp) => taxTemp?.uniqueName === taxSelected?.uniqueName);
                this.taxTempArray.splice(idx, 1);
                taxSelected.isChecked = false;
            }
        }
        this.selectedTaxes = this.taxTempArray.map(tax => tax?.uniqueName);
    }

    /**
 * Initializing the group form
 *
 * @private
 * @memberof InventoryCreateUpdateGroupComponent
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
            taxes: null
        });
    }

    /**
     * Creates/updates the group
     *
     * @memberof InventoryCreateUpdateGroupComponent
     */
    public saveGroup(): void {
        console.log(this.stockGroupUniqueName);
        this.groupForm.get('parentStockGroupUniqueName').patchValue(this.stockGroupUniqueName);
        console.log(this.groupForm);

        if (this.groupUniqueName) {
            this.inventoryService.updateStockGroup(this.groupForm?.value, this.stockGroupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.toaster.clearAllToaster();
                    this.toaster.successToast("Stock group updated successfully.");
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(response?.message);
                }
            });
        } else {
            this.inventoryService.createStockGroup(this.groupForm?.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.resetGroupForm();
                    this.toaster.clearAllToaster();
                    this.toaster.successToast("Stock group created successfully.");
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(response?.message);
                }
            });
        }
    }


    /**
 * Get stock groups
 *
 * @memberof StockCreateEditComponent
 */
    public getStockGroups(): void {
        if (this.stockType === 'FIXEDASSETS') {
            this.stockType = 'FIXED_ASSETS';
        }
        this.inventoryService.GetGroupsWithStocksFlatten(this.stockType).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                let stockGroups: IOption[] = [];
                this.arrangeStockGroups(response.body?.results, stockGroups);
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
 * @memberof StockCreateEditComponent
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
     * @memberof InventoryCreateUpdateGroupComponent
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
 * @memberof InventoryCreateUpdateGroupComponent
 */
    public resetGroupForm(): void {
        this.groupForm.reset();
        this.groupForm?.patchValue({ showCodeType: "hsn" });
        this.groupForm?.patchValue({ parentStockGroupUniqueName: "" });
        this.changeDetection.detectChanges();

    }

    /**
    * This will use for set hsn/sac value default
    *
    * @param {*} transaction
    * @memberof VoucherComponent
    */
    public onChangeHsnSacType(): void {
        console.log(this.groupForm.get['showCodeType']?.value);
        console.log(this.groupForm.get('showCodeType')?.value);

        setTimeout(() => {
            if (this.groupForm.get('showCodeType')?.value === 'hsn') {
                this.groupForm.controls['hsnNumber'].patchValue(cloneDeep(this.groupForm.get('sacNumber').value));
                this.groupForm.controls['hsnNumber'].patchValue(null);
                this.groupForm.get['sacNumber'].value = null;
            } else {
                this.groupForm.get['sacNumber'].value = cloneDeep(this.groupForm.get('hsnNumber').value);;
                this.groupForm.get['showCodeType'].value = null;
            }
            this.changeDetection.detectChanges();
        }, 100);
    }

    /**
 * Validates the unique name
 *
 * @memberof InventoryCreateUpdateGroupComponent
 */
    public validateUniqueName(): void {
        if (this.groupForm.get('uniqueName')?.value) {
            let value = uniqueNameInvalidStringReplace(this.groupForm.get('uniqueName')?.value);
            this.groupForm?.patchValue({ uniqueName: value });
        }
    }

    /**
     * Hook for component destroy
     *
     * @memberof InventoryCreateUpdateGroupComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
   * Gets the group details
   *
   * @private
   * @memberof InventoryCreateUpdateGroupComponent
   */
    private getGroupDetails(): void {
        this.inventoryService.getStockGroup(this.groupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body) {
                this.groupForm?.patchValue({
                    name: response.body.name,
                    uniqueName: response.body.uniqueName,
                    showCodeType: response.body.hsnNumber ? "hsn" : "sac",
                    hsnNumber: response.body.hsnNumber,
                    sacNumber: response.body.sacNumber,
                    parentStockGroupUniqueName: response.body.parentStockGroup?.uniqueName,
                    isSubGroup: [(response.body.parentStockGroup?.uniqueName) ? true : false],
                });
            }
        });
    }
}

